import { useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Hook para gerenciar tema (claro/escuro)
 * 
 * Princípios:
 * - Dark mode por padrão (reduz fadiga visual)
 * - Tema claro opcional para usuários que preferem
 * - Modo automático (segue o sistema)
 * - Transições suaves entre temas
 */

export type ThemeMode = "dark" | "light" | "auto";

const THEME_STORAGE_KEY = "@tea-theme-mode";

export function useThemeMode() {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega tema salvo
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved === "dark" || saved === "light" || saved === "auto") {
        setMode(saved);
      }
      setIsLoaded(true);
    });
  }, []);

  // Salva tema quando muda
  const changeMode = (newMode: ThemeMode) => {
    setMode(newMode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
  };

  // Determina se está em dark mode
  const isDark = mode === "dark" || (mode === "auto" && systemColorScheme === "dark");

  return {
    mode,
    isDark,
    changeMode,
    isLoaded,
    // Cores adaptadas para cada tema
    colors: isDark
      ? {
          background: "#1A1D23",
          surface: "#22262E",
          text: "#E8E6E3",
          textSecondary: "#8A8782",
          accent: "#7B9EA8",
        }
      : {
          background: "#F5F5F5",
          surface: "#FFFFFF",
          text: "#1A1D23",
          textSecondary: "#666666",
          accent: "#5A7A88",
        },
  };
}
