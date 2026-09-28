import { PixelRatio } from "react-native";

/**
 * Hook para fonte ajustável
 * 
 * Princípios:
 * - Respeita configurações de acessibilidade do sistema
 * - Escala suave (não muda abruptamente)
 * - Limites mínimo e máximo para legibilidade
 */

const MIN_SCALE = 0.85;
const MAX_SCALE = 1.3;

export function useFontScale() {
  // Calcula escala baseada na densidade de pixels
  const scale = PixelRatio.getFontScale();
  
  // Limita a escala para evitar problemas de layout
  const clampedScale = Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);

  return {
    scale: clampedScale,
    // Função para escalar tamanho de fonte
    fontSize: (size: number) => Math.round(size * clampedScale),
  };
}
