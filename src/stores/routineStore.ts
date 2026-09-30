import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Routine, RoutineExecutionState, DEFAULT_ROUTINES } from "@/types/routine";
import { createId } from "@/lib/id";

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

function defaultRoutines(): Routine[] {
  return DEFAULT_ROUTINES.map((routine) => ({ ...routine, steps: routine.steps.map((s) => ({ ...s })) }));
}

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      routines: defaultRoutines(),
      execution: null,

      // === ROTINAS ===
      addRoutine: (routine) => {
        const newRoutine: Routine = {
          ...routine,
          id: createId("routine"),
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
        const routine = get().routines.find((r) => r.id === id);
        // Não permite excluir rotinas padrão
        if (routine?.isDefault) return;

        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
          // Encerra a execução caso a rotina removida estivesse em andamento
          execution: state.execution?.routineId === id ? null : state.execution,
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
            pausedAt: null,
          },
        });
      },

      pauseExecution: () => {
        set((state) => {
          if (!state.execution || state.execution.isPaused) return state;
          return {
            execution: {
              ...state.execution,
              isPaused: true,
              pausedAt: Date.now(),
            },
          };
        });
      },

      resumeExecution: () => {
        set((state) => {
          const execution = state.execution;
          if (!execution || !execution.isPaused) return state;

          const now = Date.now();
          const routine = get().routines.find((r) => r.id === execution.routineId);
          if (!routine) return state;

          // Deslocamento do tempo pausado: devolve ao passo o tempo em que ele
          // ficou parado, para que a pausa não consuma a duração do passo.
          const pausedFor = execution.pausedAt ? Math.max(0, now - execution.pausedAt) : 0;

          return {
            execution: {
              ...execution,
              isPaused: false,
              pausedAt: null,
              stepStartedAt: execution.stepStartedAt
                ? execution.stepStartedAt + pausedFor
                : now,
              stepEndsAt: execution.stepEndsAt ? execution.stepEndsAt + pausedFor : now,
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
          if (!nextStep) {
            return {
              execution: {
                ...state.execution,
                isRunning: false,
                completedAt: Date.now(),
              },
            };
          }

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
          routines: defaultRoutines(),
          execution: null,
        });
      },
    }),
    {
      name: "routine-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persisted) => {
        const state = (persisted ?? {}) as Partial<RoutineStore>;
        const routines = Array.isArray(state.routines) ? state.routines : defaultRoutines();

        // v1 -> v2: execuções em andamento não tinham `pausedAt`. Se o app foi
        // fechado durante uma pausa, o tempo pausado é irrecuperável, então a
        // execução é encerrada para não exibir um passo com tempo inconsistente.
        const execution =
          state.execution && typeof state.execution.pausedAt !== "undefined"
            ? state.execution
            : null;

        return { routines, execution };
      },
    }
  )
);