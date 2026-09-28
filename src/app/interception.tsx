import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useCheckInStore } from "@/stores/checkInStore";
import { COMMON_TRIGGERS, REGULATION_SUGGESTIONS } from "@/types/checkin";

/**
 * EnergyCheckInScreen — Check-in de Bateria Social & Interocepção
 * 
 * Princípios:
 * - Mínimo de esforço cognitivo (menos de 10 segundos)
 * - Sem digitação obrigatória
 * - Feedback imediato e suave
 * - Sem cores saturadas agressivas
 */
export default function EnergyCheckInScreen() {
  const addEntry = useCheckInStore((state) => state.addEntry);
  
  // Estados dos seletores
  const [socialBattery, setSocialBattery] = useState(50);
  const [sensoryLoad, setSensoryLoad] = useState(0);
  const [physicalEnergy, setPhysicalEnergy] = useState(3);
  
  // Gatilhos selecionados
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  
  // Feedback
  const [showFeedback, setShowFeedback] = useState(false);

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
    setShowFeedback(true);
    
    // Esconder feedback após 3 segundos (sem animação piscante)
    setTimeout(() => setShowFeedback(false), 3000);
  };

  const suggestions = getSuggestions();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Como estou me sentindo",
          headerStyle: { backgroundColor: "#1A1D23" },
          headerTintColor: "#E8E6E3",
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Bateria Social */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bateria Social</Text>
          <Text style={styles.sectionDescription}>
            Disposição para interação interpessoal
          </Text>
          
          <View style={styles.sliderContainer}>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>0%</Text>
              <Text style={styles.sliderValue}>{socialBattery}%</Text>
              <Text style={styles.sliderLabel}>100%</Text>
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
              >
                <Text style={styles.adjustButtonText}>-10</Text>
              </Pressable>
              <Pressable
                style={styles.adjustButton}
                onPress={() => setSocialBattery(Math.min(100, socialBattery + 10))}
              >
                <Text style={styles.adjustButtonText}>+10</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Carga Sensorial */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Carga Sensorial</Text>
          <Text style={styles.sectionDescription}>
            Desconforto com luzes, ruídos ou ambientes
          </Text>
          
          <View style={styles.levelSelector}>
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <Pressable
                key={level}
                style={[
                  styles.levelButton,
                  sensoryLoad === level && styles.levelButtonActive,
                ]}
                onPress={() => setSensoryLoad(level)}
              >
                <Text
                  style={[
                    styles.levelButtonText,
                    sensoryLoad === level && styles.levelButtonTextActive,
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
          <Text style={styles.sectionTitle}>Energia Física</Text>
          <Text style={styles.sectionDescription}>
            Disposição geral do corpo
          </Text>
          
          <View style={styles.levelSelector}>
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <Pressable
                key={level}
                style={[
                  styles.levelButton,
                  physicalEnergy === level && styles.levelButtonActive,
                ]}
                onPress={() => setPhysicalEnergy(level)}
              >
                <Text
                  style={[
                    styles.levelButtonText,
                    physicalEnergy === level && styles.levelButtonTextActive,
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
          <Text style={styles.sectionTitle}>Gatilhos</Text>
          <Text style={styles.sectionDescription}>
            O que pode estar afetando você? (opcional)
          </Text>
          
          <View style={styles.chipsContainer}>
            {COMMON_TRIGGERS.map((trigger) => (
              <Pressable
                key={trigger}
                style={[
                  styles.chip,
                  selectedTriggers.includes(trigger) && styles.chipSelected,
                ]}
                onPress={() => toggleTrigger(trigger)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedTriggers.includes(trigger) && styles.chipTextSelected,
                  ]}
                >
                  {trigger}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Sugestões de Regulação */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Sugestões para você</Text>
            {suggestions.map((suggestion, index) => (
              <View key={index} style={styles.suggestionCard}>
                <Text style={styles.suggestionText}>{suggestion.message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Feedback de sucesso */}
        {showFeedback && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>
              Check-in registrado. Cuide-se.
            </Text>
          </View>
        )}

        {/* Botão Salvar */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Registrar</Text>
        </Pressable>
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
    gap: 32,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: "#E8E6E3",
    fontSize: 20,
    fontWeight: "600",
  },
  sectionDescription: {
    color: "#8A8782",
    fontSize: 14,
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
    color: "#8A8782",
    fontSize: 14,
  },
  sliderValue: {
    color: "#E8E6E3",
    fontSize: 24,
    fontWeight: "600",
  },
  sliderTrack: {
    height: 8,
    backgroundColor: "#2A2F38",
    borderRadius: 4,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#7B9EA8",
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  adjustButton: {
    backgroundColor: "#22262E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3A3F47",
  },
  adjustButtonText: {
    color: "#B8B5B0",
    fontSize: 16,
  },
  levelSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  levelButton: {
    flex: 1,
    backgroundColor: "#22262E",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A3F47",
  },
  levelButtonActive: {
    backgroundColor: "#7B9EA8",
    borderColor: "#7B9EA8",
  },
  levelButtonText: {
    color: "#B8B5B0",
    fontSize: 18,
    fontWeight: "600",
  },
  levelButtonTextActive: {
    color: "#1A1D23",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#22262E",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3A3F47",
  },
  chipSelected: {
    backgroundColor: "#7B9EA8",
    borderColor: "#7B9EA8",
  },
  chipText: {
    color: "#B8B5B0",
    fontSize: 14,
  },
  chipTextSelected: {
    color: "#1A1D23",
  },
  suggestionsContainer: {
    gap: 12,
  },
  suggestionsTitle: {
    color: "#B8B5B0",
    fontSize: 16,
    fontWeight: "600",
  },
  suggestionCard: {
    backgroundColor: "#22262E",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#8FA98F",
  },
  suggestionText: {
    color: "#B8B5B0",
    fontSize: 14,
    lineHeight: 20,
  },
  feedbackContainer: {
    backgroundColor: "#22262E",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  feedbackText: {
    color: "#8FA98F",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#7B9EA8",
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    color: "#1A1D23",
    fontSize: 18,
    fontWeight: "600",
  },
});
