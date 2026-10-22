import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PreferencesStore {
  hapticsEnabled: boolean;
  reduceMotion: boolean;
  showNextStep: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
  setReduceMotion: (enabled: boolean) => void;
  setShowNextStep: (enabled: boolean) => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      hapticsEnabled: false,
      reduceMotion: false,
      showNextStep: false,
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setShowNextStep: (showNextStep) => set({ showNextStep }),
    }),
    { name: "preferences-storage", storage: createJSONStorage(() => AsyncStorage), version: 1 }
  )
);
