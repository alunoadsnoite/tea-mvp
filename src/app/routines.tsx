import React from "react";
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
import { useThemeMode } from "@/hooks/useThemeMode";

/**
 * RoutinesListScreen — Listagem e criação de rotinas
 * 
 * Permite visualizar rotinas pré-configuradas e criar novas.
 */
export default function RoutinesListScreen() {
  const router = useRouter();
  const routines = useRoutineStore((state) => state.routines);
  const startExecution = useRoutineStore((state) => state.startExecution);
  const { colors } = useThemeMode();

  const handleStartRoutine = (routineId: string) => {
    startExecution(routineId);
    router.push("/routine-execution");
  };

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Minhas Rotinas",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Pressable style={styles.newButton} onPress={() => router.push("/routines/new")}>
          <Text style={styles.newButtonText}>+ Nova rotina</Text>
        </Pressable>

        {routines.map((routine) => (
          <View key={routine.id} style={styles.routineCard}>
            <Text style={styles.routineName}>{routine.name}</Text>
            {routine.description && (
              <Text style={styles.routineDescription}>{routine.description}</Text>
            )}
            
            <View style={styles.stepsPreview}>
              {routine.steps.slice(0, 3).map((step, index) => (
                <Text key={step.id} style={styles.stepText}>
                  {index + 1}. {step.title}
                </Text>
              ))}
              {routine.steps.length > 3 && (
                <Text style={styles.moreSteps}>
                  +{routine.steps.length - 3} passos
                </Text>
              )}
            </View>

            <Pressable
              style={styles.startButton}
              onPress={() => handleStartRoutine(routine.id)}
            >
              <Text style={styles.startButtonText}>Iniciar Rotina</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  routineCard: {
    backgroundColor: "#22262E",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#3A3F47",
    gap: 12,
  },
  routineName: {
    color: "#E8E6E3",
    fontSize: 20,
    fontWeight: "600",
  },
  routineDescription: {
    color: "#8A8782",
    fontSize: 14,
  },
  stepsPreview: {
    gap: 4,
  },
  stepText: {
    color: "#B8B5B0",
    fontSize: 14,
  },
  moreSteps: {
    color: "#8A8782",
    fontSize: 12,
    fontStyle: "italic",
  },
  startButton: {
    backgroundColor: "#7B9EA8",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  startButtonText: {
    color: "#1A1D23",
    fontSize: 16,
    fontWeight: "600",
  },
  newButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#7B9EA8",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  newButtonText: {
    color: "#7B9EA8",
    fontSize: 16,
    fontWeight: "600",
  },
});
