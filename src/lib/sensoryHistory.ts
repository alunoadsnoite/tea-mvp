import type { CheckInEntry } from "@/types/checkin";

export function summarizeSensoryHistory(entries: readonly CheckInEntry[]) {
  let highLoadCount = 0;
  const triggerCounts = new Map<string, number>();

  for (const entry of entries) {
    if (entry.sensoryLoad >= 4) highLoadCount++;

    for (const trigger of new Set(entry.triggers)) {
      triggerCounts.set(trigger, (triggerCounts.get(trigger) ?? 0) + 1);
    }
  }

  // Map preserva a primeira ocorrência em caso de empate. O histórico
  // fornece os registros do mais recente para o mais antigo.
  const topTriggers = Array.from(triggerCounts, ([trigger, count]) => ({ trigger, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return { highLoadCount, topTriggers };
}
