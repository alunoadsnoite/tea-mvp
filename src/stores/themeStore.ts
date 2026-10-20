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

// A tentativa de leitura pode terminar com erro antes de o layout montar.
// Esse sinal não é persistido e libera a abertura também nesse caso.
const useThemeLoadingStore = create<{ finished: boolean }>()(() => ({ finished: false }));

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
      onRehydrateStorage: () => () => {
        useThemeLoadingStore.setState({ finished: true });
      },
    }
  )
);

/**
 * Indica se a tentativa de leitura do tema salvo já terminou.
 *
 * Usado pelo layout raiz para aguardar o tema salvo. Em caso de falha,
 * libera o splash com o tema escuro padrão, mantendo o app acessível.
 */
export function useThemeHydrated() {
  return useThemeLoadingStore((state) => state.finished);
}
