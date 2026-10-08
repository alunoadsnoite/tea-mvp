import { PixelRatio } from "react-native";
import { useCallback } from "react";

/**
 * Hook para fonte ajustável
 *
 * Princípios:
 * - Respeita configurações de acessibilidade do sistema
 * - Limita a escala renderizada ao intervalo 0.85x–1.3x
 *
 * O <Text> do React Native já aplica a escala do sistema por padrão
 * (allowFontScaling). Multiplicar o fontSize por essa escala de novo — como
 * fazia a versão anterior — causava escala dupla (150% do sistema virava
 * 1.95x renderizado; 50% virava 0.425x). Aqui o fator aplicado ao estilo
 * compensa a escala do sistema para que o texto final fique exatamente em
 * clamp(systemScale) do tamanho de projeto:
 *   render = fontSize(style) × systemScale
 *          = size × (clamp / systemScale) × systemScale
 *          = size × clamp
 */
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.3;

export function useFontScale() {
  const systemScale = PixelRatio.getFontScale();
  const clampedScale = Math.min(Math.max(systemScale, MIN_SCALE), MAX_SCALE);
  // Fator de compensação: exatamente 1.0 quando o sistema está no intervalo.
  const compensatingFactor =
    systemScale > 0 ? clampedScale / systemScale : 1;

  // Referência estável: só muda quando a escala do sistema muda, para que
  // useMemo de StyleSheet não recalcule a cada render.
  const fontSize = useCallback(
    (size: number) => Math.round(size * compensatingFactor * 100) / 100,
    [compensatingFactor]
  );

  return {
    fontSize,
  };
}
