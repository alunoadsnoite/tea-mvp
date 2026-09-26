import React, { useEffect, useState } from "react";
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
  const execution = useRoutineStore((state) => state.execution);
  const routines = useRoutineStore((state) => state.routines);
  const completeStep = useRoutineStore((state) => state.completeStep);
  const pauseExecution = useRoutineStore((state) => state.pauseExecution);
  const resumeExecution = useRoutineStore((state) => state.resumeExecution);
  const extendTime = useRoutineStore((state) => state.extendTime);
  const stopExecution = useRoutineStore((state) => state.stopExecution);

  const [, setTick] = useState(0);

  // Atualizar a cada segundo para o timer visual
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!execution) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma rotina em execução</Text>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const routine = routines.find((r) => r.id === execution.routineId);
  if (!routine) return null;

  const currentStep = routine.steps[execution.currentStepIndex];
  const isLastStep = execution.currentStepIndex === routine.steps.length - 1;
  const isCompleted = execution.completedAt !== null;

  const handleCompleteStep = () => {
    completeStep();
    if (isLastStep) {
      // Rotina concluída
      setTimeout(() => {
        stopExecution();
        router.replace("/routines");
      }, 1500);
    }
  };

  const handleStop = () => {
    stopExecution();
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
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
                >
                  <Text style={styles.secondaryButtonText}>Continuar</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.secondaryButton}
                  onPress={pauseExecution}
                >
                  <Text style={styles.secondaryButtonText}>Pausar</Text>
                </Pressable>
              )}

              <Pressable
                style={styles.secondaryButton}
                onPress={() => extendTime(5)}
              >
                <Text style={styles.secondaryButtonText}>+5 min</Text>
              </Pressable>

              <Pressable
                style={styles.stopButton}
                onPress={handleStop}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1D23",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    color: "#8A8782",
    fontSize: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#22262E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#B8B5B0",
    fontSize: 16,
  },
  progressContainer: {
    gap: 8,
  },
  progressText: {
    color: "#B8B5B0",
    fontSize: 14,
    textAlign: "center",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#2A2F38",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7B9EA8",
    borderRadius: 3,
  },
  routineTitle: {
    color: "#8A8782",
    fontSize: 16,
    textAlign: "center",
  },
  stepCard: {
    backgroundColor: "#22262E",
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: "#3A3F47",
    gap: 12,
  },
  stepTitle: {
    color: "#E8E6E3",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 36,
  },
  stepDescription: {
    color: "#B8B5B0",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  timerContainer: {
    gap: 8,
  },
  pausedText: {
    color: "#C4A882",
    fontSize: 14,
    textAlign: "center",
  },
  completedContainer: {
    backgroundColor: "#22262E",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  completedText: {
    color: "#8FA98F",
    fontSize: 18,
    textAlign: "center",
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#7B9EA8",
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#1A1D23",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: "#22262E",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3A3F47",
  },
  secondaryButtonText: {
    color: "#B8B5B0",
    fontSize: 14,
  },
  stopButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3A3F47",
  },
  stopButtonText: {
    color: "#8A8782",
    fontSize: 14,
  },
});
