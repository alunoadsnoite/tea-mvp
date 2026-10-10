export function getBreathingProgress(
  pattern: readonly number[],
  currentPhase: number,
  completedCycles: number,
  totalCycles: number
): number {
  const activePhases = pattern.filter((duration) => duration > 0).length;
  if (activePhases === 0 || totalCycles <= 0) return 0;

  const completedPhaseCount = pattern
    .slice(0, currentPhase)
    .filter((duration) => duration > 0).length;
  const safeCompletedCycles = Math.min(
    Math.max(completedCycles, 0),
    totalCycles
  );

  return Math.min(
    100,
    ((safeCompletedCycles + completedPhaseCount / activePhases) / totalCycles) *
      100
  );
}
