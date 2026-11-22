import { isProEdition } from "@/lib/edition";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useCallback } from "react";

/** Text e TextInput aplicam a escala de acessibilidade do sistema nativamente. */
export function useFontScale() {
  const larger = usePreferencesStore((state) => isProEdition && state.largerText);
  const fontSize = useCallback((size: number) => larger ? Math.round(size * 1.2) : size, [larger]);
  return { fontSize };
}
