import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useRoutineStore } from "@/stores/routineStore";
import { VisualTimerBar } from "@/components/VisualTimerBar";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ThemeColors } from "@/constants/theme";

/**
 * RoutineExecutionScreen — Execução passo-a-passo
 *
 * Princípios:
 * - Apenas uma subtarefa por vez em destaque
 * - Timer visual suave (sem números estressantes)
 * - Sem elementos distratores
 * - Progresso claro ("Passo 2 de 5")
 */
export default function RoutineExecutionScreen() {
  const router = useRouter();
  const { colors } = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const execution = useRoutineStore((state) => state.execution);
  const routines = useRoutineStore((state) => state.routines);
  const completeStep = useRoutineStore((state) => state.completeStep);
  const pauseExecution = useRoutineStore((state) => state.pauseExecution);
  const resumeExecution = useRoutineStore((state) => state.resumeExecution);
  const extendTime = useRoutineStore((state) => state.extendTime);
  const stopExecution = useRoutineStore((state) => state.stopExecution);

  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Evita que a navegação agendada na conclusão dispare depois de a tela sair.
  useEffect(() => {
    return () => {
      if (completionTimer.current) {
        clearTimeout(completionTimer.current);
        completionTimer.current = null;
      }
    };
  }, []);

  if (!execution) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma rotina em execução</Text>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace("/routines")}
            accessibilityRole="button"
            accessibilityLabel="Voltar para Minhas Rotinas"
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const routine = routines.find((r) => r.id === execution.routineId);
  const currentStep = routine?.steps[execution.currentStepIndex];
  const isLastStep =
    routine !== undefined &&
    execution.currentStepIndex === routine.steps.length - 1;
  const isCompleted = execution.completedAt !== null;

  const handleCompleteStep = () => {
    // Trava contra toques repetidos, que agendariam navegações duplicadas.
    if (completionTimer.current) return;

    completeStep();
    if (isLastStep) {
      completionTimer.current = setTimeout(() => {
        completionTimer.current = null;
        stopExecution();
        router.replace("/routines");
      }, 1500);
    }
  };

  const handleStop = () => {
    stopExecution();
    router.back();
  };

  if (!routine || !currentStep) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Rotina indisponível</Text>
          <Pressable
            style={styles.backButton}
            onPress={handleStop}
            accessibilityRole="button"
            accessibilityLabel="Voltar para Minhas Rotinas"
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false, // Sem header para reduzir distrações
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Progresso geral */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Passo {execution.currentStepIndex + 1} de {routine.steps.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((execution.currentStepIndex + 1) / routine.steps.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Título da rotina */}
        <Text style={styles.routineTitle}>{routine.name}</Text>

        {/* Passo atual em destaque */}
        <View style={styles.stepCard}>
          <Text style={styles.stepTitle}>{currentStep.title}</Text>
          {currentStep.description && (
            <Text style={styles.stepDescription}>{currentStep.description}</Text>
          )}
        </View>

        {/* Timer visual suave */}
        {execution.stepStartedAt && execution.stepEndsAt && !isCompleted && (
          <View style={styles.timerContainer}>
            <VisualTimerBar
              startTime={execution.stepStartedAt}
              endTime={execution.stepEndsAt}
              isPaused={execution.isPaused}
              color={colors.accent}
              trackColor={colors.surfaceAlt}
            />
            {execution.isPaused && (
              <Text style={styles.pausedText}>Pausado</Text>
            )}
          </View>
        )}

        {/* Mensagem de conclusão */}
        {isCompleted && (
          <View style={styles.completedContainer}>
            <Text style={styles.completedText}>
              Rotina concluída. Bom trabalho.
            </Text>
          </View>
        )}

        {/* Ações */}
        {!isCompleted && (
          <View style={styles.actions}>
            <Pressable
              style={styles.primaryButton}
              onPress={handleCompleteStep}
              accessibilityRole="button"
              accessibilityLabel={isLastStep ? "Concluir Rotina" : "Próximo Passo"}
              accessibilityHint={
                isLastStep
                  ? "Encerra a rotina e mostra a mensagem de conclusão"
                  : "Marca o passo atual como concluído e avança para o seguinte"
              }
            >
              <Text style={styles.primaryButtonText}>
                {isLastStep ? "Concluir Rotina" : "Próximo Passo"}
              </Text>
            </Pressable>

            <View style={styles.secondaryActions}>
              {execution.isPaused ? (
                <Pressable
                  style={styles.secondaryButton}
                  onPress={resumeExecution}
                  accessibilityRole="button"
                  accessibilityLabel="Continuar rotina"
                  accessibilityHint="Retoma a contagem do tempo deste passo"
                >
                  <Text style={styles.secondaryButtonText}>Continuar</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.secondaryButton}
                  onPress={pauseExecution}
                  accessibilityRole="button"
                  accessibilityLabel="Pausar rotina"
                  accessibilityHint="Pausa a contagem do tempo deste passo"
                >
                  <Text style={styles.secondaryButtonText}>Pausar</Text>
                </Pressable>
              )}

              <Pressable
                style={styles.secondaryButton}
                onPress={() => extendTime(5)}
                accessibilityRole="button"
                accessibilityLabel="Adicionar 5 minutos"
                accessibilityHint="Estende o tempo estimado deste passo em cinco minutos"
              >
                <Text style={styles.secondaryButtonText}>+5 min</Text>
              </Pressable>

              <Pressable
                style={styles.stopButton}
                onPress={handleStop}
                accessibilityRole="button"
                accessibilityLabel="Encerrar rotina"
                accessibilityHint="Interrompe a execução e volta para a lista de rotinas"
              >
                <Text style={styles.stopButtonText}>Encerrar</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 24,
      gap: 24,
      paddingBottom: 80, // Espaço para o EmergencyFab
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    emptyText: {
      color: colors.textMuted,
      fontSize: 16,
      marginBottom: 24,
      textAlign: "center",
    },
    backButton: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    backButtonText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
    progressContainer: {
      gap: 8,
    },
    progressText: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: "center",
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.surfaceAlt,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.accent,
      borderRadius: 3,
    },
    routineTitle: {
      color: colors.textMuted,
      fontSize: 16,
      textAlign: "center",
    },
    stepCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 32,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    stepTitle: {
      color: colors.text,
      fontSize: 28,
      fontWeight: "700",
      textAlign: "center",
      lineHeight: 36,
    },
    stepDescription: {
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: "center",
      lineHeight: 22,
    },
    timerContainer: {
      gap: 8,
    },
    pausedText: {
      color: colors.warm,
      fontSize: 14,
      textAlign: "center",
    },
    completedContainer: {
      backgroundColor: colors.surface,
      padding: 24,
      borderRadius: 12,
      alignItems: "center",
    },
    completedText: {
      color: colors.success,
      fontSize: 18,
      textAlign: "center",
    },
    actions: {
      gap: 16,
    },
    primaryButton: {
      backgroundColor: colors.accent,
      paddingVertical: 20,
      borderRadius: 8,
      alignItems: "center",
    },
    primaryButtonText: {
      color: colors.accentText,
      fontSize: 18,
      fontWeight: "600",
    },
    secondaryActions: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 12,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    stopButton: {
      backgroundColor: "transparent",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    stopButtonText: {
      color: colors.textMuted,
      fontSize: 14,
    },
  });