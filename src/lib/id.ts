/**
 * Geração de ids locais.
 *
 * `Date.now()` sozinho pode colidir quando dois itens são criados no mesmo
 * milissegio (toques rápidos), o que geraria chaves React duplicadas e
 * registros sobrescritos na persistência.
 */
export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}