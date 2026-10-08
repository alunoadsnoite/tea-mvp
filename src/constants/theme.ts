/**
 * Tokens de tema — Paleta semântica única do app.
 *
 * Todas as telas devem consumir estes tokens em vez de cores fixas, para que
 * o tema claro/escuro funcione de verdade. As paletas são constantes de módulo
 * (referências estáveis) para permitir memoização dos StyleSheet por tema.
 *
 * Contraste: ambos os conjuntos mantêm WCAG AA (>= 4.5:1) para texto normal.
 */

export type ThemeMode = "dark" | "light" | "auto";

export interface ThemeColors {
  /** Fundo da aplicação */
  background: string;
  /** Cartões, campos e superfícies elevadas */
  surface: string;
  /** Superfície secundária (trilhas de barra, chips neutros) */
  surfaceAlt: string;
  /** Borda padrão */
  border: string;
  /** Borda de controles selecionáveis (mais evidente) */
  borderStrong: string;
  /** Divisórias e separadores sutis */
  borderSubtle: string;
  /** Texto principal */
  text: string;
  /** Texto de apoio legível */
  textSecondary: string;
  /** Texto terciário / legendas */
  textMuted: string;
  /** Cor de destaque (ações principais) */
  accent: string;
  /** Texto sobre a cor de destaque */
  accentText: string;
  /** Realce translúcido do destaque (item selecionado) */
  accentSoft: string;
  /** Cor quente (ações destrutivas suaves, favoritos, pausado) */
  warm: string;
  /** Superfície translúcida da cor quente */
  warmSurface: string;
  /** Confirmação / conclusão */
  success: string;
  /** Fundo de campos de entrada */
  input: string;
  /** Texto de placeholder */
  placeholder: string;
  /** Cor de sombra */
  shadow: string;
}

export const darkTheme: ThemeColors = {
  background: "#1A1D23",
  surface: "#22262E",
  surfaceAlt: "#2A2F38",
  border: "#3A3F47",
  borderStrong: "#575E6A",
  borderSubtle: "#262B33",
  text: "#E8E6E3",
  textSecondary: "#B8B5B0",
  textMuted: "#9A968F",
  accent: "#7B9EA8",
  accentText: "#1A1D23",
  accentSoft: "rgba(123, 158, 168, 0.16)",
  warm: "#C4A882",
  warmSurface: "rgba(196, 168, 130, 0.20)",
  success: "#8FA98F",
  input: "#1A1D23",
  placeholder: "#9A968F",
  shadow: "rgba(0, 0, 0, 0.5)",
};

export const lightTheme: ThemeColors = {
  background: "#F5F5F5",
  surface: "#FFFFFF",
  surfaceAlt: "#ECEEF1",
  border: "#D6D9DE",
  borderStrong: "#B9BEC6",
  borderSubtle: "#E4E7EB",
  text: "#1A1D23",
  textSecondary: "#4A4F57",
  textMuted: "#5C626B",
  accent: "#3F6473",
  accentText: "#FFFFFF",
  accentSoft: "rgba(63, 100, 115, 0.12)",
  warm: "#8A6A3E",
  warmSurface: "rgba(138, 106, 62, 0.14)",
  success: "#4A6B4A",
  input: "#FFFFFF",
  placeholder: "#6B717A",
  shadow: "rgba(15, 20, 28, 0.18)",
};