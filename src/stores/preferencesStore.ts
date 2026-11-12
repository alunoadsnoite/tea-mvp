import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { isLanguage, type Language } from "@/lib/i18n";

interface PreferencesStore {
  language: Language;
  setLanguage: (language: Language) => void;
  hapticsEnabled: boolean;
  reduceMotion: boolean;
  showNextStep: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
  setReduceMotion: (enabled: boolean) => void;
  setShowNextStep: (enabled: boolean) => void;
}

const usePreferencesLoadingStore = create(() => ({ finished: false }));

export function usePreferencesHydrated() {
  return usePreferencesLoadingStore((state) => state.finished);
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      language: "pt-BR",
      setLanguage: (language) => set({ language }),
      hapticsEnabled: false,
      reduceMotion: false,
      showNextStep: false,
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setShowNextStep: (showNextStep) => set({ showNextStep }),
    }),
    {
      name: "preferences-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      onRehydrateStorage: () => () => {
        usePreferencesLoadingStore.setState({ finished: true });
      },
      merge: (persisted, current) => {
        const saved = persisted as Partial<PreferencesStore> | undefined;
        return { ...current, ...saved, language: isLanguage(saved?.language) ? saved.language : "pt-BR" };
      },
    }
  )
);
