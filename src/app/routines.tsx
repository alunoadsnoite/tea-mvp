import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useRoutineStore } from "@/stores/routineStore";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ThemeColors } from "@/constants/theme";

/**
 * RoutinesListScreen — Listagem, edição e criação de rotinas
 *
 * Permite visualizar rotinas pré-configuradas, criar novas, editar e excluir
 * as personalizadas.
 */
export default function RoutinesListScreen() {
  const router = useRouter();
  const { fontSize } = useFontScale();
  const { colors } = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const routines = useRoutineStore((state) => state.routines);
  const startExecution = useRoutineStore((state) => state.startExecution);
  const deleteRoutine = useRoutineStore((state) => state.deleteRoutine);

  const handleStartRoutine = (routineId: string) => {
    startExecution(routineId);
    router.push("/routine-execution");
  };

  const handleDeleteRoutine = (id: string, name: string) => {
    Alert.alert(
      "Excluir rotina",
      `A rotina "${name}" será removida. Deseja continuar?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => deleteRoutine(id) },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Minhas Rotinas",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Pressable
          style={styles.newButton}
          onPress={() => router.push("/routines/new")}
          accessibilityRole="button"
          accessibilityLabel="Criar nova rotina"
        >
          <Text style={[styles.newButtonText, { fontSize: fontSize(16) }]}>+ Nova rotina</Text>
        </Pressable>

        {routines.map((routine) => (
          <View key={routine.id} style={styles.routineCard}>
            <Text style={[styles.routineName, { fontSize: fontSize(20) }]}>{routine.name}</Text>
            {routine.description && (
              <Text style={[styles.routineDescription, { fontSize: fontSize(14) }]}>
                {routine.description}
              </Text>
            )}

            <View style={styles.stepsPreview}>
              {routine.steps.slice(0, 3).map((step, index) => (
                <Text key={step.id} style={[styles.stepText, { fontSize: fontSize(14) }]}>
                  {index + 1}. {step.title}
                </Text>
              ))}
              {routine.steps.length > 3 && (
                <Text style={[styles.moreSteps, { fontSize: fontSize(12) }]}>
                  +{routine.steps.length - 3} passos
                </Text>
              )}
            </View>

            <Pressable
              style={styles.startButton}
              onPress={() => handleStartRoutine(routine.id)}
              accessibilityRole="button"
              accessibilityLabel={`Iniciar rotina ${routine.name}`}
              accessibilityHint="Começa a execução passo a passo desta rotina"
            >
              <Text style={[styles.startButtonText, { fontSize: fontSize(16) }]}>Iniciar Rotina</Text>
            </Pressable>

            {/* Editar/excluir apenas nas rotinas criadas pelo usuário */}
            {!routine.isDefault && (
              <View style={styles.manageRow}>
                <Pressable
                  style={styles.manageButton}
                  onPress={() => router.push(`/routines/new?id=${routine.id}`)}
                  accessibilityRole="button"
                  accessibilityLabel={`Editar rotina ${routine.name}`}
                >
                  <Text style={[styles.manageButtonText, { fontSize: fontSize(14) }]}>Editar</Text>
                </Pressable>
                <Pressable
                  style={styles.manageButton}
                  onPress={() => handleDeleteRoutine(routine.id, routine.name)}
                  accessibilityRole="button"
                  accessibilityLabel={`Excluir rotina ${routine.name}`}
                >
                  <Text style={[styles.manageButtonTextDelete, { fontSize: fontSize(14) }]}>Excluir</Text>
                </Pressable>
              </View>
            )}
          </View>
        ))}
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
      gap: 16,
      paddingBottom: 80, // Espaço para o EmergencyFab
    },
    routineCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    routineName: {
      color: colors.text,
      fontWeight: "600",
    },
    routineDescription: {
      color: colors.textMuted,
    },
    stepsPreview: {
      gap: 4,
    },
    stepText: {
      color: colors.textSecondary,
    },
    moreSteps: {
      color: colors.textMuted,
      fontStyle: "italic",
    },
    startButton: {
      backgroundColor: colors.accent,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    startButtonText: {
      color: colors.accentText,
      fontWeight: "600",
    },
    newButton: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: colors.accent,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: "center",
      marginBottom: 16,
    },
    newButtonText: {
      color: colors.accent,
      fontWeight: "600",
    },
    manageRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 24,
      marginTop: 4,
    },
    manageButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    manageButtonText: {
      color: colors.accent,
    },
    manageButtonTextDelete: {
      color: colors.warm,
    },
  });