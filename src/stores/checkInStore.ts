import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckInEntry } from "@/types/checkin";

/**
 * Store Zustand — Check-in de Bateria Social & Interocepção
 * 
 * Persistência local via AsyncStorage para histórico offline.
 */
interface CheckInStore {
  entries: CheckInEntry[];
  
  // Ações
  addEntry: (entry: Omit<CheckInEntry, "id" | "timestamp">) => void;
  getTodayEntries: () => CheckInEntry[];
  getRecentEntries: (days: number) => CheckInEntry[];
  getLastEntry: () => CheckInEntry | null;
  clearHistory: () => void;
}

export const useCheckInStore = create<CheckInStore>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: CheckInEntry = {
          ...entry,
          id: `checkin-${Date.now()}`,
          timestamp: Date.now(),
        };
        set((state) => ({
          entries: [...state.entries, newEntry],
        }));
      },

      getTodayEntries: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();
        
        return get().entries.filter(
          (entry) => entry.timestamp >= todayTimestamp
        );
      },

      getRecentEntries: (days: number) => {
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        return get()
          .entries.filter((entry) => entry.timestamp >= cutoff)
          .sort((a, b) => b.timestamp - a.timestamp);
      },

      getLastEntry: () => {
        const entries = get().entries;
        return entries.length > 0 ? entries[entries.length - 1] : null;
      },

      clearHistory: () => {
        set({ entries: [] });
      },
    }),
    {
      name: "checkin-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
