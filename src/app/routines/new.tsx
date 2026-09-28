import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useRoutineStore } from "@/stores/routineStore";
import { RoutineStep } from "@/types/routine";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";

/**
 * NovaRotinaScreen — Criação de rotina personalizada
 *
 * Permite criar uma nova rotina com nome, descrição e passos sequenciais.
 */
export default function NovaRotinaScreen() {
  const router = useRouter();
  const { fontSize } = useFontScale();
  const { colors } = useThemeMode();
  const addRoutine = useRoutineStore((state) => state.addRoutine);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<RoutineStep[]>([
    { id: `step-${Date.now()}`, title: "", description: "", estimatedMinutes: 5 },
  ]);

  const handleAddStep = () => {
    setSteps([
      ...steps,
      { id: `step-${Date.now()}-${Math.random()}`, title: "", description: "", estimatedMinutes: 5 },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleUpdateStep = (index: number, updates: Partial<RoutineStep>) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    setSteps(newSteps);
  };

  const handleSave = () => {
    const validSteps = steps.filter((s) => s.title.trim() !== "");
    if (!name.trim() || validSteps.length === 0) return;

    addRoutine({
      name: name.trim(),
      description: description.trim(),
      steps: validSteps,
      isDefault: false,
    });

    router.back();
  };

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Nova Rotina",
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
            placeholderTextColor="#8A8782"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Descrição */}
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { fontSize: fontSize(16) }]}>Descrição (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea, { fontSize: fontSize(16) }]}
            placeholder="Por que esta rotina é importante?"
            placeholderTextColor="#8A8782"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
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
                  <Pressable style={styles.removeStepButton} onPress={() => handleRemoveStep(index)}>
                    <Text style={[styles.removeStepText, { fontSize: fontSize(18) }]}>×</Text>
                  </Pressable>
                )}
              </View>

              <TextInput
                style={[styles.input, { fontSize: fontSize(16) }]}
                placeholder="Título do passo"
                placeholderTextColor="#8A8782"
                value={step.title}
                onChangeText={(title) => handleUpdateStep(index, { title })}
              />

              <TextInput
                style={[styles.input, styles.textArea, { fontSize: fontSize(16) }]}
                placeholder="Descrição opcional"
                placeholderTextColor="#8A8782"
                value={step.description}
                onChangeText={(description) => handleUpdateStep(index, { description })}
                multiline
                numberOfLines={2}
              />

              <View style={styles.minutesRow}>
                <Text style={[styles.minutesLabel, { fontSize: fontSize(14) }]}>Minutos estimados:</Text>
                <View style={styles.minutesButtons}>
                  {[1, 2, 3, 5, 10, 15, 20, 30].map((m) => (
                    <Pressable
                      key={m}
                      style={[
                        styles.minutesChip,
                        step.estimatedMinutes === m && styles.minutesChipActive,
                      ]}
                      onPress={() => handleUpdateStep(index, { estimatedMinutes: m })}
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
          <Pressable style={styles.addStepButton} onPress={handleAddStep}>
            <Text style={[styles.addStepText, { fontSize: fontSize(16) }]}>Adicionar passo</Text>
          </Pressable>
        </View>

        {/* Salvar */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={[styles.saveButtonText, { fontSize: fontSize(18) }]}>Criar Rotina</Text>
        </Pressable>
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
    gap: 24,
  },
  field: {
    gap: 12,
  },
  fieldLabel: {
    color: "#E8E6E3",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1A1D23",
    borderRadius: 8,
    padding: 12,
    color: "#E8E6E3",
    borderWidth: 1,
    borderColor: "#3A3F47",
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  stepCard: {
    backgroundColor: "#22262E",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3A3F47",
    gap: 12,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepNumber: {
    color: "#8A8782",
    fontWeight: "600",
  },
  removeStepButton: {
    padding: 4,
  },
  removeStepText: {
    color: "#C4A882",
  },
  minutesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  minutesLabel: {
    color: "#8A8782",
  },
  minutesButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  minutesChip: {
    backgroundColor: "#1A1D23",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#3A3F47",
  },
  minutesChipActive: {
    backgroundColor: "#7B9EA8",
    borderColor: "#7B9EA8",
  },
  minutesChipText: {
    color: "#B8B5B0",
  },
  minutesChipTextActive: {
    color: "#1A1D23",
  },
  addStepButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3A3F47",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  addStepText: {
    color: "#7B9EA8",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#7B9EA8",
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#1A1D23",
    fontWeight: "600",
  },
});
