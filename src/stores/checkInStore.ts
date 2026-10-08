import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckInEntry } from "@/types/checkin";
import { createId } from "@/lib/id";

/**
 * Store Zustand — Check-in de Bateria Social & Interocepção
 *
 * Persistência local via AsyncStorage para histórico offline.
 */

// Retenção do histórico: entradas mais antigas que isto são descartadas na
// gravação, para o array não crescer indefinidamente (README: "limite
// configurável"). Ajuste aqui se o app passar a expor a configuração na UI.
const RETENTION_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

interface CheckInStore {
  entries: CheckInEntry[];

  // Ações
  addEntry: (entry: Omit<CheckInEntry, "id" | "timestamp">) => void;
  getRecentEntries: (days: number) => CheckInEntry[];
  clearHistory: () => void;
}

export const useCheckInStore = create<CheckInStore>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const now = Date.now();
        const cutoff = now - RETENTION_DAYS * DAY_MS;
        const newEntry: CheckInEntry = {
          ...entry,
          id: createId("checkin"),
          timestamp: now,
        };
        set((state) => ({
          entries: [...state.entries.filter((e) => e.timestamp >= cutoff), newEntry],
        }));
      },

      getRecentEntries: (days: number) => {
        const cutoff = Date.now() - days * DAY_MS;
        return get()
          .entries.filter((entry) => entry.timestamp >= cutoff)
          .sort((a, b) => b.timestamp - a.timestamp);
      },

      clearHistory: () => {
        set({ entries: [] });
      },
    }),
    {
      name: "checkin-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persisted) => {
        const state = persisted as Partial<CheckInStore> | undefined;
        return {
          entries: Array.isArray(state?.entries) ? state.entries : [],
        };
      },
    }
  )
);