import { useColorScheme } from "react-native";
import { useThemeStore, useThemeHydrated } from "@/stores/themeStore";
import { ThemeMode, ThemeColors, darkTheme, lightTheme } from "@/constants/theme";

export type { ThemeMode, ThemeColors };

/**
 * Hook para gerenciar tema (claro/escuro)
 *
 * Princípios:
 * - Dark mode por padrão (reduz fadiga visual)
 * - Tema claro opcional para usuários que preferem
 * - Modo automático (segue o sistema)
 * - Transições suaves entre temas
 *
 * O estado vive em um store compartilhado (ver `themeStore`), então a troca de
 * tema em Configurações se reflete imediatamente em todas as telas.
 */
export function useThemeMode() {
  const systemColorScheme = useColorScheme();
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const hasHydrated = useThemeHydrated();

  // Determina se está em dark mode
  const isDark = mode === "dark" || (mode === "auto" && systemColorScheme === "dark");

  return {
    mode,
    isDark,
    changeMode: setMode,
    hasHydrated,
    /** Alias mantido por compatibilidade com a API anterior */
    isLoaded: hasHydrated,
    // Paletas são constantes de módulo: a referência é estável entre renders,
    // o que permite memoizar StyleSheet por tema.
    colors: isDark ? darkTheme : lightTheme,
  };
}