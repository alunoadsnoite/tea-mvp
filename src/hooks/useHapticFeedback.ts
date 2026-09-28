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
    try {
      switch (type) {
        case "light":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case "medium":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case "heavy":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case "success":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case "warning":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
      }
    } catch {
      // Silenciosamente falha se haptics não estiver disponível
    }
  };

  return { trigger };
}
