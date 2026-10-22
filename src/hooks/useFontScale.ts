import { useCallback } from "react";

/** Text e TextInput aplicam a escala de acessibilidade do sistema nativamente. */
export function useFontScale() {
  const fontSize = useCallback((size: number) => size, []);
  return { fontSize };
}
