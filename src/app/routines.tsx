 * Permite visualizar rotinas pré-configuradas, criar novas, editar e excluir
 * as personalizadas.
 */
export default function RoutinesListScreen() {
  const router = useRouter();
  const { fontSize } = useFontScale();
  const { colors } = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const execution = useRoutineStore((state) => state.execution);
  const routines = useRoutineStore((state) => state.routines);
  const startExecution = useRoutineStore((state) => state.startExecution);
  const deleteRoutine = useRoutineStore((state) => state.deleteRoutine);
  const resetToDefaults = useRoutineStore((state) => state.resetToDefaults);

  const handleStartRoutine = (routineId: string) => {
    const current = useRoutineStore.getState().execution;
    if (current && current.completedAt === null && current.routineId !== routineId) {
      Alert.alert("Substituir rotina em andamento?", "O progresso da rotina atual será encerrado para iniciar a outra.", [
        { text: "Cancelar", style: "cancel" },
        { text: "Substituir", style: "destructive", onPress: () => {
          if (startExecution(routineId, true)) router.push("/routine-execution");
        } },
      ]);
      return;
    }
    // Reopening a saved execution preserves the current step and paused timer.
    if (execution?.routineId === routineId || startExecution(routineId)) {
      router.push("/routine-execution");
    }
    if (startExecution(routineId)) router.push("/routine-execution");
  };
