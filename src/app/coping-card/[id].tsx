import { localizeCopingCard } from "@/lib/localizedContent";
import { useTranslation } from "@/hooks/useTranslation";
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCopingCardsStore } from "@/stores/copingCardsStore";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ThemeColors } from "@/constants/theme";

/**
 * CopingCardDetailScreen — Detalhes de um cartão de regulação
 *
 * Mostra os passos do cartão de forma clara e sequencial.
 */
export default function CopingCardDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { fontSize } = useFontScale();
  const { colors } = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const savedCard = useCopingCardsStore((state) =>
    id ? state.getCardById(id) : undefined
  );
  const toggleFavorite = useCopingCardsStore((state) => state.toggleFavorite);

  const card = savedCard && localizeCopingCard(savedCard, t);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  if (!card || card.steps.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { fontSize: fontSize(16) }]}>{t("Cartão não encontrado")}</Text>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t("Voltar para as estratégias de calma")}
          >
            <Text style={[styles.backButtonText, { fontSize: fontSize(16) }]}>{t("Voltar")}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isLastStep = currentStep === card.steps.length - 1;

  const handleNextStep = () => {
    if (isLastStep) {
      setIsComplete(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsComplete(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: card.title,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerRight: () => (
            <Pressable
              onPress={() => toggleFavorite(card.id)}
              style={styles.headerFavorite}
              accessibilityRole="checkbox"
              accessibilityLabel={card.isFavorite ? t("Remover dos favoritos") : t("Adicionar aos favoritos")}
              accessibilityState={{ checked: card.isFavorite }}
            >
              <Text style={styles.headerFavoriteIcon}>
                {card.isFavorite ? "★" : "☆"}
              </Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Descrição */}
        <Text style={[styles.description, { fontSize: fontSize(16) }]}>{card.description}</Text>

        {/* Progresso */}
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { fontSize: fontSize(14) }]}>{t("Passo {0} de {1}", Math.min(currentStep + 1, card.steps.length), card.steps.length)}</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentStep + 1) / card.steps.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Passo atual */}
        {!isComplete ? (
          <View style={styles.stepCard}>
            <Text style={[styles.stepNumber, { fontSize: fontSize(14) }]}>{t("Passo {0}", currentStep + 1)}</Text>
            <Text style={[styles.stepText, { fontSize: fontSize(24) }]}>
              {card.steps[currentStep]}
            </Text>
          </View>
        ) : (
          <View style={styles.completedCard}>
            <Text style={[styles.completedText, { fontSize: fontSize(20) }]}>{t("Exercício concluído. Como você se sente?")}</Text>
          </View>
        )}

        {/* Navegação entre passos */}
        {!isComplete && (
          <View style={styles.actions}>
            {currentStep > 0 && (
              <Pressable
                style={styles.secondaryButton}
                onPress={() => setCurrentStep(currentStep - 1)}
                accessibilityRole="button"
                accessibilityLabel={t("Passo anterior")}
                accessibilityHint={t("Volta para o passo {0}", currentStep)}
              >
                <Text style={[styles.secondaryButtonText, { fontSize: fontSize(16) }]}>{t("Passo anterior")}</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.primaryButton}
              onPress={handleNextStep}
              accessibilityRole="button"
              accessibilityLabel={isLastStep ? t("Concluir exercício") : t("Próximo passo")}
            >
              <Text style={[styles.primaryButtonText, { fontSize: fontSize(18) }]}>
                {isLastStep ? t("Concluir") : t("Próximo passo")}
              </Text>
            </Pressable>
          </View>
        )}

        {isComplete && (
          <View style={styles.actions}>
            <Pressable
              style={styles.secondaryButton}
              onPress={handleRestart}
              accessibilityRole="button"
              accessibilityLabel={t("Recomeçar exercício")}
            >
              <Text style={[styles.secondaryButtonText, { fontSize: fontSize(16) }]}>{t("Recomeçar")}</Text>
            </Pressable>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel={t("Voltar para as estratégias de calma")}
            >
              <Text style={[styles.primaryButtonText, { fontSize: fontSize(18) }]}>{t("Voltar")}</Text>
            </Pressable>
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
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    emptyText: {
      color: colors.textMuted,
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
    },
    headerFavorite: {
      padding: 8,
      marginRight: 8,
    },
    headerFavoriteIcon: {
      color: colors.warm,
      fontSize: 24,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 24,
      gap: 24,
      paddingBottom: 80, // Espaço para o EmergencyFab
    },
    description: {
      color: colors.textSecondary,
      lineHeight: 24,
      textAlign: "center",
    },
    progressContainer: {
      gap: 8,
    },
    progressText: {
      color: colors.textMuted,
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
    stepCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 32,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 16,
    },
    stepNumber: {
      color: colors.textMuted,
      textAlign: "center",
    },
    stepText: {
      color: colors.text,
      lineHeight: 34,
      textAlign: "center",
    },
    completedCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 32,
      borderWidth: 1,
      borderColor: colors.success,
      alignItems: "center",
    },
    completedText: {
      color: colors.success,
      textAlign: "center",
    },
    actions: {
      gap: 12,
    },
    primaryButton: {
      backgroundColor: colors.accent,
      paddingVertical: 18,
      borderRadius: 8,
      alignItems: "center",
    },
    primaryButtonText: {
      color: colors.accentText,
      fontWeight: "600",
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      color: colors.textSecondary,
    },
  });