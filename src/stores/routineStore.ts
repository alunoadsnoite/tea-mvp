import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Routine, RoutineExecutionState, DEFAULT_ROUTINES } from "@/types/routine";

/**
 * Store Zustand — Rotinas Visuais Sequenciais
 * 
 * Gerencia rotinas, execução e progresso com persistência local.
 */
interface RoutineStore {
  routines: Routine[];
  execution: RoutineExecutionState | null;
  
  // Ações para rotinas
  addRoutine: (routine: Omit<Routine, "id" | "createdAt">) => void;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  
  // Ações para execução
  startExecution: (routineId: string) => void;
  pauseExecution: () => void;
  resumeExecution: () => void;
  completeStep: () => void;
  extendTime: (minutes: number) => void;
  stopExecution: () => void;
  
  // Utilitários
  getRoutineById: (id: string) => Routine | undefined;
  resetToDefaults: () => void;
}

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      routines: DEFAULT_ROUTINES,
      execution: null,

      // === ROTINAS ===
      addRoutine: (routine) => {
        const newRoutine: Routine = {
          ...routine,
          id: `routine-${Date.now()}`,
          createdAt: Date.now(),
        };
        set((state) => ({
          routines: [...state.routines, newRoutine],
        }));
      },

      updateRoutine: (id, updates) => {
        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      deleteRoutine: (id) => {
        const state = get();
        const routine = state.routines.find((r) => r.id === id);
        // Não permite excluir rotinas padrão
        if (routine?.isDefault) return;

        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
        }));
      },

      // === EXECUÇÃO ===
      startExecution: (routineId) => {
        const routine = get().routines.find((r) => r.id === routineId);
        if (!routine || routine.steps.length === 0) return;

        const now = Date.now();
        const firstStep = routine.steps[0];
        
        set({
          execution: {
            routineId,
            currentStepIndex: 0,
            isRunning: true,
            isPaused: false,
            startedAt: now,
            completedAt: null,
            stepStartedAt: now,
            stepEndsAt: now + firstStep.estimatedMinutes * 60 * 1000,
            extendedMinutes: 0,
          },
        });
      },

      pauseExecution: () => {
        set((state) => {
          if (!state.execution) return state;
          return {
            execution: {
              ...state.execution,
              isPaused: true,
            },
          };
        });
      },

      resumeExecution: () => {
        set((state) => {
          if (!state.execution || !state.execution.isPaused) return state;
          
          const now = Date.now();
          const routine = get().routines.find(
            (r) => r.id === state.execution!.routineId
          );
          if (!routine) return state;

          const currentStep = routine.steps[state.execution.currentStepIndex];
          const remainingTime = state.execution.stepEndsAt! - now;
          const newEndTime = now + Math.max(remainingTime, 0);

          return {
            execution: {
              ...state.execution,
              isPaused: false,
              stepStartedAt: now,
              stepEndsAt: newEndTime,
            },
          };
        });
      },

      completeStep: () => {
        set((state) => {
          if (!state.execution) return state;

          const routine = get().routines.find(
            (r) => r.id === state.execution!.routineId
          );
          if (!routine) return state;

          const nextIndex = state.execution.currentStepIndex + 1;
          
          // Verifica se é o último passo
          if (nextIndex >= routine.steps.length) {
            return {
              execution: {
                ...state.execution,
                isRunning: false,
                completedAt: Date.now(),
              },
            };
          }

          // Avança para o próximo passo
          const nextStep = routine.steps[nextIndex];
          const now = Date.now();
          
          return {
            execution: {
              ...state.execution,
              currentStepIndex: nextIndex,
              stepStartedAt: now,
              stepEndsAt: now + nextStep.estimatedMinutes * 60 * 1000,
              extendedMinutes: 0,
            },
          };
        });
      },

      extendTime: (minutes) => {
        set((state) => {
          if (!state.execution) return state;
          
          const now = Date.now();
          const newEndTime = (state.execution.stepEndsAt ?? now) + minutes * 60 * 1000;
          
          return {
            execution: {
              ...state.execution,
              stepEndsAt: newEndTime,
              extendedMinutes: state.execution.extendedMinutes + minutes,
            },
          };
        });
      },

      stopExecution: () => {
        set({ execution: null });
      },

      // === UTILITÁRIOS ===
      getRoutineById: (id) => {
        return get().routines.find((r) => r.id === id);
      },

      resetToDefaults: () => {
        set({
          routines: DEFAULT_ROUTINES,
          execution: null,
        });
      },
    }),
    {
      name: "routine-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
