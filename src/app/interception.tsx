import { useTranslation } from "@/hooks/useTranslation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, Link } from "expo-router";
import { useCheckInStore } from "@/stores/checkInStore";
import { COMMON_TRIGGERS, REGULATION_SUGGESTIONS } from "@/types/checkin";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { ThemeColors } from "@/constants/theme";

/**
 * EnergyCheckInScreen — Check-in de Bateria Social & Interocepção
 *
 * Princípios:
 * - Mínimo de esforço cognitivo (menos de 10 segundos)
 * - Sem digitação obrigatória
 * - Feedback imediato e suave
 * - Sem cores saturadas agressivas
 */

const LEVEL_LABELS: Record<string, string> = {
  "0": "nenhum",
  "1": "muito leve",
  "2": "leve",
  "3": "moderado",
  "4": "intenso",
  "5": "muito intenso",
};

export default function EnergyCheckInScreen() {
  const { t } = useTranslation();
  const { fontSize } = useFontScale();
  const { colors } = useThemeMode();
  const { trigger } = useHapticFeedback();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const addEntry = useCheckInStore((state) => state.addEntry);

  // Estados dos seletores
  const [socialBattery, setSocialBattery] = useState(50);
  const [sensoryLoad, setSensoryLoad] = useState(0);
  const [physicalEnergy, setPhysicalEnergy] = useState(3);

  // Gatilhos selecionados
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  // Feedback
  const [showFeedback, setShowFeedback] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) {
        clearTimeout(feedbackTimer.current);
      }
    };
  }, []);

  // Alternar gatilho
  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    );
  };

  // Verificar sugestões de regulação
  const getSuggestions = () => {
    const currentEntry = { socialBattery, sensoryLoad, physicalEnergy, triggers: selectedTriggers };
    return REGULATION_SUGGESTIONS.filter((s) => s.condition(currentEntry));
  };

  // Salvar check-in
  const handleSave = () => {
    addEntry({
      socialBattery,
      sensoryLoad,
      physicalEnergy,
      triggers: selectedTriggers,
    });
    trigger("success");
    setShowFeedback(true);

    // Esconder feedback após 3 segundos (sem animação piscante)
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setShowFeedback(false), 3000);
  };

  const suggestions = getSuggestions();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t("Como estou me sentindo"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Link href="/checkin-history" asChild>
          <Pressable style={styles.adjustButton} accessibilityRole="button" accessibilityLabel={t("Ver histórico de check-ins")}>
            <Text style={[styles.adjustButtonText, { fontSize: fontSize(16) }]}>{t("Ver histórico")}</Text>
          </Pressable>
        </Link>
        {/* Bateria Social */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize(20) }]}>{t("Bateria Social")}</Text>
          <Text style={[styles.sectionDescription, { fontSize: fontSize(14) }]}>{t("Disposição para interação interpessoal")}</Text>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderLabel, { fontSize: fontSize(14) }]}>0%</Text>
              <Text style={[styles.sliderValue, { fontSize: fontSize(24) }]}>{socialBattery}%</Text>
              <Text style={[styles.sliderLabel, { fontSize: fontSize(14) }]}>100%</Text>
            </View>
            <View style={styles.sliderTrack}>
              <View
                style={[
                  styles.sliderFill,
                  { width: `${socialBattery}%` },
                ]}
              />
            </View>
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.adjustButton}
                onPress={() => setSocialBattery(Math.max(0, socialBattery - 10))}
                accessibilityRole="button"
                accessibilityLabel={t("Diminuir Bateria Social em 10%")}
              >
                <Text style={[styles.adjustButtonText, { fontSize: fontSize(16) }]}>-10</Text>
              </Pressable>
              <Pressable
                style={styles.adjustButton}
                onPress={() => setSocialBattery(Math.min(100, socialBattery + 10))}
                accessibilityRole="button"
                accessibilityLabel={t("Aumentar Bateria Social em 10%")}
              >
                <Text style={[styles.adjustButtonText, { fontSize: fontSize(16) }]}>+10</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Carga Sensorial */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize(20) }]}>{t("Carga Sensorial")}</Text>
          <Text style={[styles.sectionDescription, { fontSize: fontSize(14) }]}>{t("Desconforto com luzes, ruídos ou ambientes")}</Text>

          <View style={styles.levelSelector}>
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <Pressable
                key={level}
                style={[
                  styles.levelButton,
                  sensoryLoad === level && styles.levelButtonActive,
                ]}
                onPress={() => setSensoryLoad(level)}
                accessibilityRole="radio"
                accessibilityLabel={t("Nível {0}, {1}", level, t(LEVEL_LABELS[String(level)]))}
                accessibilityState={{ selected: sensoryLoad === level }}
              >
                <Text
                  style={[
                    styles.levelButtonText,
                    sensoryLoad === level && styles.levelButtonTextActive,
                    { fontSize: fontSize(18) },
                  ]}
                >
                  {level}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Energia Física */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize(20) }]}>{t("Energia Física")}</Text>
          <Text style={[styles.sectionDescription, { fontSize: fontSize(14) }]}>{t("Disposição geral do corpo")}</Text>

          <View style={styles.levelSelector}>
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <Pressable
                key={level}
                style={[
                  styles.levelButton,
                  physicalEnergy === level && styles.levelButtonActive,
                ]}
                onPress={() => setPhysicalEnergy(level)}
                accessibilityRole="radio"
                accessibilityLabel={t("Nível {0}, {1}", level, t(LEVEL_LABELS[String(level)]))}
                accessibilityState={{ selected: physicalEnergy === level }}
              >
                <Text
                  style={[
                    styles.levelButtonText,
                    physicalEnergy === level && styles.levelButtonTextActive,
                    { fontSize: fontSize(18) },
                  ]}
                >
                  {level}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Gatilhos Rápidos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize(20) }]}>{t("Gatilhos")}</Text>
          <Text style={[styles.sectionDescription, { fontSize: fontSize(14) }]}>{t("O que pode estar afetando você? (opcional)")}</Text>

          <View style={styles.chipsContainer}>
            {COMMON_TRIGGERS.map((trigger) => {
              const selected = selectedTriggers.includes(trigger);
              return (
                <Pressable
                  key={trigger}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => toggleTrigger(trigger)}
                  accessibilityRole="checkbox"
                  accessibilityLabel={t(trigger)}
                  accessibilityState={{ checked: selected }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.chipTextSelected,
                      { fontSize: fontSize(14) },
                    ]}
                  >
                    {t(trigger)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Sugestões de Regulação */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={[styles.suggestionsTitle, { fontSize: fontSize(16) }]}>{t("Sugestões para você")}</Text>
            {suggestions.map((suggestion, index) => (
              <View key={index} style={styles.suggestionCard}>
                <Text style={[styles.suggestionText, { fontSize: fontSize(14) }]}>{t(suggestion.message)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Feedback de sucesso */}
        {showFeedback && (
          <View
            style={styles.feedbackContainer}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <Text style={[styles.feedbackText, { fontSize: fontSize(16) }]}>{t("Check-in registrado. Cuide-se.")}</Text>
          </View>
        )}

        {/* Botão Salvar */}
        <Pressable
          style={styles.saveButton}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel={t("Registrar check-in")}
          accessibilityHint={t("Salva como você está se sentindo agora")}
        >
          <Text style={[styles.saveButtonText, { fontSize: fontSize(18) }]}>{t("Registrar")}</Text>
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
      gap: 32,
      paddingBottom: 80, // Espaço para o EmergencyFab
    },
    section: {
      gap: 12,
    },
    sectionTitle: {
      color: colors.text,
      fontWeight: "600",
    },
    sectionDescription: {
      color: colors.textMuted,
    },
    sliderContainer: {
      gap: 12,
    },
    sliderLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sliderLabel: {
      color: colors.textMuted,
    },
    sliderValue: {
      color: colors.text,
      fontWeight: "600",
    },
    sliderTrack: {
      height: 8,
      backgroundColor: colors.surfaceAlt,
      borderRadius: 4,
      overflow: "hidden",
    },
    sliderFill: {
      height: "100%",
      backgroundColor: colors.accent,
      borderRadius: 4,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 16,
    },
    adjustButton: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    adjustButtonText: {
      color: colors.textSecondary,
    },
    levelSelector: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    levelButton: {
      flexGrow: 1,
      flexBasis: "25%",
      minWidth: 48,
      backgroundColor: colors.surface,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    levelButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    levelButtonText: {
      color: colors.textSecondary,
      fontWeight: "600",
    },
    levelButtonTextActive: {
      color: colors.accentText,
    },
    chipsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    chip: {
      backgroundColor: colors.surface,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipSelected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    chipText: {
      color: colors.textSecondary,
    },
    chipTextSelected: {
      color: colors.accentText,
    },
    suggestionsContainer: {
      gap: 12,
    },
    suggestionsTitle: {
      color: colors.textSecondary,
      fontWeight: "600",
    },
    suggestionCard: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: colors.success,
    },
    suggestionText: {
      color: colors.textSecondary,
      lineHeight: 20,
    },
    feedbackContainer: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    feedbackText: {
      color: colors.success,
    },
    saveButton: {
      backgroundColor: colors.accent,
      paddingVertical: 18,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 16,
    },
    saveButtonText: {
      color: colors.accentText,
      fontWeight: "600",
    },
  });