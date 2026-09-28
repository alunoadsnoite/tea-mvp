import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useCopingCardsStore } from "@/stores/copingCardsStore";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";

/**
 * NovaCartaScreen — Criação de cartão de regulação personalizado
 *
 * Permite criar um novo cartão de coping com título, descrição,
 * categoria e passos personalizados.
 */
export default function NovaCartaScreen() {
  const router = useRouter();
  const { fontSize } = useFontScale();
  const { colors } = useThemeMode();
  const addCard = useCopingCardsStore((state) => state.addCard);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"grounding" | "breathing" | "custom">("custom");
  const [steps, setSteps] = useState<string[]>([""]);

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleUpdateStep = (index: number, text: string) => {
    const newSteps = [...steps];
    newSteps[index] = text;
    setSteps(newSteps);
  };

  const handleSave = () => {
    const filteredSteps = steps.filter((s) => s.trim() !== "");
    if (!title.trim() || !description.trim() || filteredSteps.length === 0) return;

    addCard({
      title: title.trim(),
      description: description.trim(),
      category,
      steps: filteredSteps,
      isFavorite: false,
    });

    router.back();
  };

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Novo Cartão",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerBackTitle: "Voltar",
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Título */}
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { fontSize: fontSize(16) }]}>Título</Text>
          <TextInput
            style={[styles.input, { fontSize: fontSize(16) }]}
            placeholder="Ex: Respirar fundo"
            placeholderTextColor="#8A8782"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Descrição */}
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { fontSize: fontSize(16) }]}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea, { fontSize: fontSize(16) }]}
            placeholder="Descreva para que serve este cartão"
            placeholderTextColor="#8A8782"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Categoria */}
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { fontSize: fontSize(16) }]}>Categoria</Text>
          <View style={styles.categoryRow}>
            {(["grounding", "breathing", "custom"] as const).map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    category === cat && styles.categoryChipTextActive,
                    { fontSize: fontSize(14) },
                  ]}
                >
                  {cat === "grounding" ? "Ancoragem" : cat === "breathing" ? "Respiração" : "Personalizado"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Passos */}
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { fontSize: fontSize(16) }]}>Passos</Text>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <Text style={[styles.stepNumber, { fontSize: fontSize(12) }]}>Passo {index + 1}</Text>
              <TextInput
                style={[styles.input, { fontSize: fontSize(16) }]}
                placeholder={`Descreva o passo ${index + 1}`}
                placeholderTextColor="#8A8782"
                value={step}
                onChangeText={(text) => handleUpdateStep(index, text)}
              />
              {steps.length > 1 && (
                <Pressable
                  style={styles.removeStepButton}
                  onPress={() => handleRemoveStep(index)}
                >
                  <Text style={[styles.removeStepText, { fontSize: fontSize(14) }]}>×</Text>
                </Pressable>
              )}
            </View>
          ))}
          <Pressable style={styles.addStepButton} onPress={handleAddStep}>
            <Text style={[styles.addStepText, { fontSize: fontSize(14) }]}>Adicionar passo</Text>
          </Pressable>
        </View>

        {/* Salvar */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={[styles.saveButtonText, { fontSize: fontSize(16) }]}>Criar Cartão</Text>
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
    minHeight: 80,
    textAlignVertical: "top",
  },
  categoryRow: {
    flexDirection: "row",
    gap: 8,
  },
  categoryChip: {
    backgroundColor: "#22262E",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3A3F47",
  },
  categoryChipActive: {
    backgroundColor: "#7B9EA8",
    borderColor: "#7B9EA8",
  },
  categoryChipText: {
    color: "#B8B5B0",
  },
  categoryChipTextActive: {
    color: "#1A1D23",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  stepNumber: {
    color: "#8A8782",
    width: 60,
  },
  removeStepButton: {
    padding: 8,
    marginLeft: 4,
  },
  removeStepText: {
    color: "#C4A882",
  },
  addStepButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3A3F47",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  addStepText: {
    color: "#7B9EA8",
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
