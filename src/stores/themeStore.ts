import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeMode } from "@/constants/theme";

/**
 * Store Zustand — Tema do app
 *
 * Fica em um store (e não em estado local do hook) para que a troca de tema
 * propague imediatamente para todas as telas, incluindo o layout raiz
 * (fundo e StatusBar).
 */
interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: "dark",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);

/**
 * Indica se a leitura do tema salvo no armazenamento já terminou.
 *
 * Usado pelo layout raiz para manter o splash screen até que a paleta correta
 * esteja disponível, evitando um flash com as cores do tema errado.
 */
export function useThemeHydrated() {
  const [hydrated, setHydrated] = useState(() => useThemeStore.persist.hasHydrated());

  useEffect(() => {
    if (useThemeStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsubscribe = useThemeStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return unsubscribe;
  }, []);

  return hydrated;
}