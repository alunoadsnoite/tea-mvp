import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useRoutineStore } from "@/stores/routineStore";
import { RoutineStep } from "@/types/routine";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ThemeColors } from "@/constants/theme";
import { createId } from "@/lib/id";

const MINUTES_OPTIONS = [1, 2, 3, 5, 10, 15, 20, 30];

/**
 * NovaRotinaScreen — Criação e edição de rotina personalizada
 *
 * Com `?id=<routineId>` a mesma tela edita uma rotina existente.
 */
export default function NovaRotinaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { fontSize } = useFontScale();
  const { colors } = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const addRoutine = useRoutineStore((state) => state.addRoutine);
  const updateRoutine = useRoutineStore((state) => state.updateRoutine);
  const existingRoutine = useRoutineStore((state) =>
    id ? state.getRoutineById(id) : undefined
  );

  const isEditing = Boolean(id && existingRoutine);

  const [name, setName] = useState(existingRoutine?.name ?? "");
  const [description, setDescription] = useState(existingRoutine?.description ?? "");
  const [steps, setSteps] = useState<RoutineStep[]>(
    existingRoutine?.steps ?? [
      { id: createId("step"), title: "", description: "", estimatedMinutes: 5 },
    ]
  );
  const [formError, setFormError] = useState<string | null>(null);

  // A store é hidratada de forma assíncrona: em deep link ou abertura fria o
  // primeiro render não encontra a rotina. Ressincroniza quando ela chega
  // (ou quando o id editado muda), para não exibir um formulário vazio.
  useEffect(() => {
    if (!existingRoutine) return;
    setName(existingRoutine.name);
    setDescription(existingRoutine.description ?? "");
    setSteps(existingRoutine.steps);
    setFormError(null);
    // Ressincroniza apenas quando o id editado muda (ou a store hidrata)
    // para não sobrescrever o que o usuário já digitou.
  }, [existingRoutine?.id]);

  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      { id: createId("step"), title: "", description: "", estimatedMinutes: 5 },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const handleUpdateStep = (index: number, updates: Partial<RoutineStep>) => {
    setSteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const handleSave = () => {
    const validSteps = steps
      .filter((s) => s.title.trim() !== "")
      .map((s) => ({ ...s, title: s.title.trim() }));
    if (!name.trim() || validSteps.length === 0) {
      setFormError("Preencha o nome e pelo menos um passo com título para salvar.");
      return;
    }
    setFormError(null);

    if (isEditing && existingRoutine) {
      updateRoutine(existingRoutine.id, {
        name: name.trim(),
        description: description.trim(),
        steps: validSteps,
      });
    } else {
      addRoutine({
        name: name.trim(),
        description: description.trim(),
        steps: validSteps,
        isDefault: false,
      });
    }

    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: isEditing ? "Editar Rotina" : "Nova Rotina",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerBackTitle: "Voltar",
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Nome */}
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { fontSize: fontSize(20) }]}>Nome da rotina</Text>
          <TextInput
            style={[styles.input, { fontSize: fontSize(16) }]}
            placeholder="Ex: Preparação matinal"
            placeholderTextColor={colors.placeholder}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setFormError(null);
            }}
            accessibilityLabel="Nome da rotina"
          />
        </View>

        {/* Descrição */}
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { fontSize: fontSize(16) }]}>Descrição (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea, { fontSize: fontSize(16) }]}
            placeholder="Por que esta rotina é importante?"
            placeholderTextColor={colors.placeholder}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            accessibilityLabel="Descrição da rotina (opcional)"
          />
        </View>

        {/* Passos */}
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { fontSize: fontSize(20) }]}>Passos</Text>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={[styles.stepNumber, { fontSize: fontSize(14) }]}>Passo {index + 1}</Text>
                {steps.length > 1 && (
                  <Pressable
                    style={styles.removeStepButton}
                    onPress={() => handleRemoveStep(index)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remover passo ${index + 1}`}
                  >
                    <Text style={[styles.removeStepText, { fontSize: fontSize(18) }]}>×</Text>
                  </Pressable>
                )}
              </View>

              <TextInput
                style={[styles.input, { fontSize: fontSize(16) }]}
                placeholder="Título do passo"
                placeholderTextColor={colors.placeholder}
                value={step.title}
                onChangeText={(title) => handleUpdateStep(index, { title })}
                accessibilityLabel={`Título do passo ${index + 1}`}
              />

              <TextInput
                style={[styles.input, styles.textArea, { fontSize: fontSize(16) }]}
                placeholder="Descrição opcional"
                placeholderTextColor={colors.placeholder}
                value={step.description}
                onChangeText={(stepDescription) =>
                  handleUpdateStep(index, { description: stepDescription })
                }
                multiline
                numberOfLines={2}
                accessibilityLabel={`Descrição do passo ${index + 1} (opcional)`}
              />

              <View style={styles.minutesRow}>
                <Text style={[styles.minutesLabel, { fontSize: fontSize(14) }]}>Minutos estimados:</Text>
                <View style={styles.minutesButtons}>
                  {MINUTES_OPTIONS.map((m) => (
                    <Pressable
                      key={m}
                      style={[
                        styles.minutesChip,
                        step.estimatedMinutes === m && styles.minutesChipActive,
                      ]}
                      onPress={() => handleUpdateStep(index, { estimatedMinutes: m })}
                      accessibilityRole="radio"
                      accessibilityLabel={`${m} minutos`}
                      accessibilityState={{ selected: step.estimatedMinutes === m }}
                    >
                      <Text
                        style={[
                          styles.minutesChipText,
                          step.estimatedMinutes === m && styles.minutesChipTextActive,
                          { fontSize: fontSize(14) },
                        ]}
                      >
                        {m}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          ))}
          <Pressable
            style={styles.addStepButton}
            onPress={handleAddStep}
            accessibilityRole="button"
            accessibilityLabel="Adicionar passo à rotina"
          >
            <Text style={[styles.addStepText, { fontSize: fontSize(16) }]}>Adicionar passo</Text>
          </Pressable>
        </View>

        {/* Salvar */}
        {formError && (
          <Text
            style={styles.formError}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {formError}
          </Text>
        )}
        <Pressable
          style={styles.saveButton}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel={isEditing ? "Salvar alterações da rotina" : "Criar rotina"}
        >
          <Text style={[styles.saveButtonText, { fontSize: fontSize(18) }]}>
            {isEditing ? "Salvar Rotina" : "Criar Rotina"}
          </Text>
        </Pressable>
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
    field: {
      gap: 12,
    },
    fieldLabel: {
      color: colors.text,
      fontWeight: "600",
    },
    formError: {
      color: colors.warm,
      lineHeight: 20,
    },
    input: {
      backgroundColor: colors.input,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    textArea: {
      minHeight: 60,
      textAlignVertical: "top",
    },
    stepCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    stepHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    stepNumber: {
      color: colors.textMuted,
      fontWeight: "600",
    },
    removeStepButton: {
      padding: 8,
    },
    removeStepText: {
      color: colors.warm,
    },
    minutesRow: {
      gap: 8,
    },
    minutesLabel: {
      color: colors.textMuted,
    },
    minutesButtons: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    minutesChip: {
      backgroundColor: colors.input,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      minWidth: 44,
      alignItems: "center",
    },
    minutesChipActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    minutesChipText: {
      color: colors.textSecondary,
    },
    minutesChipTextActive: {
      color: colors.accentText,
    },
    addStepButton: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 14,
      alignItems: "center",
      marginTop: 4,
    },
    addStepText: {
      color: colors.accent,
      fontWeight: "600",
    },
    saveButton: {
      backgroundColor: colors.accent,
      paddingVertical: 18,
      borderRadius: 8,
      alignItems: "center",
    },
    saveButtonText: {
      color: colors.accentText,
      fontWeight: "600",
    },
  });