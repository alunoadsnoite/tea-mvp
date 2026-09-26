import type { Config } from "tailwindcss";

/**
 * Tema TEA — Paleta acessível para neurodivergentes
 * 
 * Princípios:
 * - Dark mode por padrão (reduz fadiga visual)
 * - Tons pastel suaves, sem saturação agressiva
 * - Contraste WCAG AA mínimo (4.5:1 para texto normal)
 * - Sem cores de alerta vermelho/urgência
 */
const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Fundo principal — cinza-azulado escuro suave
        background: {
          DEFAULT: "#1A1D23",
          secondary: "#22262E",
          tertiary: "#2A2F38",
        },
        // Texto — branco quente (menos agressivo que branco puro)
        text: {
          primary: "#E8E6E3",
          secondary: "#B8B5B0",
          muted: "#8A8782",
        },
        // Acentos pastel suaves
        accent: {
          // Azul-acinzentado calmo
          calm: "#7B9EA8",
          // Verde sábio suave
          sage: "#8FA98F",
          // Lavanda suave
          lavender: "#A89BB8",
          // Pêssego suave (para alertas não-urgentes)
          peach: "#C4A882",
        },
        // Estados — sem vermelho
        state: {
          success: "#8FA98F",
          warning: "#C4A882",
          info: "#7B9EA8",
        },
        // Bordas sutis
        border: {
          DEFAULT: "#3A3F47",
          subtle: "#2E333B",
        },
      },
      fontFamily: {
        // Tipografia legível, sem serifa
        sans: ["System", "sans-serif"],
      },
      spacing: {
        // Espaçamento generoso para reduzir carga cognitiva
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      borderRadius: {
        // Cantos suaves, não muito arredondados
        card: "12px",
        button: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
