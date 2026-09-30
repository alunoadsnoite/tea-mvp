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
        const newEntry: CheckInEntry = {
          ...entry,
          id: createId("checkin"),
          timestamp: Date.now(),
        };
        set((state) => ({
          entries: [...state.entries, newEntry],
        }));
      },

      getRecentEntries: (days: number) => {
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
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