import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCopingCardsStore } from "@/stores/copingCardsStore";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ThemeColors } from "@/constants/theme";

const CATEGORY_LABELS = {
  grounding: "Ancoragem",
  breathing: "Respiração",
  custom: "Personalizado",
} as const;

/**
 * NovaCartaScreen — Criação e edição de cartão de regulação
 *
 * Com `?id=<cardId>` a mesma tela edita um cartão existente.
 */
export default function NovaCartaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { fontSize } = useFontScale();
  const { colors } = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const addCard = useCopingCardsStore((state) => state.addCard);
  const updateCard = useCopingCardsStore((state) => state.updateCard);
  const existingCard = useCopingCardsStore((state) =>
    id ? state.getCardById(id) : undefined
  );

  const isEditing = Boolean(id && existingCard);

  const [title, setTitle] = useState(existingCard?.title ?? "");
  const [description, setDescription] = useState(existingCard?.description ?? "");
  const [category, setCategory] = useState<"grounding" | "breathing" | "custom">(
    existingCard?.category ?? "custom"
  );
  const [steps, setSteps] = useState<string[]>(existingCard?.steps ?? [""]);
  const [formError, setFormError] = useState<string | null>(null);

  // A store é hidratada de forma assíncrona: em deep link ou abertura fria o
  // primeiro render não encontra o cartão. Ressincroniza quando ele chega
  // (ou quando o id editado muda), para não exibir um formulário vazio.
  useEffect(() => {
    if (!existingCard) return;
    setTitle(existingCard.title);
    setDescription(existingCard.description);
    setCategory(existingCard.category);
    setSteps(existingCard.steps);
    setFormError(null);
    // Ressincroniza apenas quando o id editado muda (ou a store hidrata)
    // para não sobrescrever o que o usuário já digitou.
  }, [existingCard?.id]);

  const handleAddStep = () => {
    setSteps((prev) => [...prev, ""]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const handleUpdateStep = (index: number, text: string) => {
    setSteps((prev) => {
      const next = [...prev];
      next[index] = text;
      return next;
    });
  };

  const handleSave = () => {
    const filteredSteps = steps.map((s) => s.trim()).filter((s) => s !== "");
    if (!title.trim() || !description.trim() || filteredSteps.length === 0) {
      setFormError(
        "Preencha o título, a descrição e pelo menos um passo para salvar."
      );
      return;
    }
    setFormError(null);

    if (isEditing && existingCard) {
      updateCard(existingCard.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        steps: filteredSteps,
      });
    } else {
      addCard({
        title: title.trim(),
        description: description.trim(),
        category,
        steps: filteredSteps,
        isFavorite: false,
      });
    }

    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: isEditing ? "Editar Cartão" : "Novo Cartão",
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
            placeholderTextColor={colors.placeholder}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setFormError(null);
            }}
            accessibilityLabel="Título do cartão"
          />
        </View>

        {/* Descrição */}
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { fontSize: fontSize(16) }]}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea, { fontSize: fontSize(16) }]}
            placeholder="Descreva para que serve este cartão"
            placeholderTextColor={colors.placeholder}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setFormError(null);
            }}
            multiline
            numberOfLines={3}
            accessibilityLabel="Descrição do cartão"
          />
        </View>

        {/* Categoria */}
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { fontSize: fontSize(16) }]}>Categoria</Text>
          <View style={styles.categoryRow}>
            {(["grounding", "breathing", "custom"] as const).map((cat) => (
              <Pressable
                key={cat}
                style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                onPress={() => setCategory(cat)}
                accessibilityRole="radio"
                accessibilityLabel={CATEGORY_LABELS[cat]}
                accessibilityState={{ selected: category === cat }}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    category === cat && styles.categoryChipTextActive,
                    { fontSize: fontSize(14) },
                  ]}
                >
                  {CATEGORY_LABELS[cat]}
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
                style={[styles.input, styles.stepInput, { fontSize: fontSize(16) }]}
                placeholder={`Descreva o passo ${index + 1}`}
                placeholderTextColor={colors.placeholder}
                value={step}
                onChangeText={(text) => handleUpdateStep(index, text)}
                accessibilityLabel={`Passo ${index + 1}`}
              />
              {steps.length > 1 && (
                <Pressable
                  style={styles.removeStepButton}
                  onPress={() => handleRemoveStep(index)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remover passo ${index + 1}`}
                >
                  <Text style={[styles.removeStepText, { fontSize: fontSize(14) }]}>×</Text>
                </Pressable>
              )}
            </View>
          ))}
          <Pressable
            style={styles.addStepButton}
            onPress={handleAddStep}
            accessibilityRole="button"
            accessibilityLabel="Adicionar passo ao cartão"
          >
            <Text style={[styles.addStepText, { fontSize: fontSize(14) }]}>Adicionar passo</Text>
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
          accessibilityLabel={isEditing ? "Salvar alterações do cartão" : "Criar cartão"}
        >
          <Text style={[styles.saveButtonText, { fontSize: fontSize(16) }]}>
            {isEditing ? "Salvar Cartão" : "Criar Cartão"}
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
      minHeight: 80,
      textAlignVertical: "top",
    },
    categoryRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    categoryChip: {
      backgroundColor: colors.surface,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryChipActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    categoryChipText: {
      color: colors.textSecondary,
    },
    categoryChipTextActive: {
      color: colors.accentText,
    },
    stepRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    stepNumber: {
      color: colors.textMuted,
      width: 60,
    },
    stepInput: {
      flex: 1,
    },
    removeStepButton: {
      padding: 8,
    },
    removeStepText: {
      color: colors.warm,
    },
    addStepButton: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
    },
    addStepText: {
      color: colors.accent,
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