import * as Haptics from "expo-haptics";

/**
 * Hook para feedback háptico sutil
 * 
 * Princípios:
 * - Vibração suave, não intrusiva
 * - Apenas em interações importantes
 * - Desativada por padrão em momentos de crise
 */

export type HapticType = "light" | "medium" | "heavy" | "success" | "warning";

export function useHapticFeedback() {
  const trigger = (type: HapticType = "light") => {
    // Haptics retorna Promise: o try/catch síncrono não capturava a
    // rejeição (ex.: dispositivo sem motor háptico), gerando unhandled
    // rejection. Trata o erro de forma silenciosa — o háptico é opcional.
    const feedback = ((): Promise<void> | null => {
      switch (type) {
        case "light":
          return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        case "medium":
          return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        case "heavy":
          return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        case "success":
          return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        case "warning":
          return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        default:
          return null;
      }
    })();

    feedback?.catch(() => {
      // Silenciosamente falha se haptics não estiver disponível
    });
  };

  return { trigger };
}
