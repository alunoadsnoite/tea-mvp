import React, { useState } from "react";
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

/**
 * CopingCardDetailScreen — Detalhes de um cartão de regulação
 * 
 * Mostra os passos do cartão de forma clara e sequencial.
 */
export default function CopingCardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const getCardById = useCopingCardsStore((state) => state.getCardById);
  const toggleFavorite = useCopingCardsStore((state) => state.toggleFavorite);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const card = getCardById(id);

  if (!card) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Cartão não encontrado</Text>
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
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: card.title,
          headerStyle: { backgroundColor: "#1A1D23" },
          headerTintColor: "#E8E6E3",
          headerRight: () => (
            <Pressable
              onPress={() => toggleFavorite(card.id)}
              style={styles.headerFavorite}
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
        <Text style={styles.description}>{card.description}</Text>

        {/* Progresso */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Passo {Math.min(currentStep + 1, card.steps.length)} de {card.steps.length}
          </Text>
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
            <Text style={styles.stepNumber}>Passo {currentStep + 1}</Text>
            <Text style={styles.stepText}>{card.steps[currentStep]}</Text>
          </View>
        ) : (
          <View style={styles.completedCard}>
            <Text style={styles.completedText}>
              Exercício concluído. Como você se sente?
            </Text>
          </View>
        )}

        {/* Navegação entre passos */}
        {!isComplete && (
          <View style={styles.actions}>
            {currentStep > 0 && (
              <Pressable
                style={styles.secondaryButton}
                onPress={() => setCurrentStep(currentStep - 1)}
              >
                <Text style={styles.secondaryButtonText}>Passo anterior</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.primaryButton}
              onPress={handleNextStep}
            >
              <Text style={styles.primaryButtonText}>
                {isLastStep ? "Concluir" : "Próximo passo"}
              </Text>
            </Pressable>
          </View>
        )}

        {isComplete && (
          <View style={styles.actions}>
            <Pressable
              style={styles.secondaryButton}
              onPress={handleRestart}
            >
              <Text style={styles.secondaryButtonText}>Recomeçar</Text>
            </Pressable>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.primaryButtonText}>Voltar</Text>
            </Pressable>
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
  headerFavorite: {
    padding: 8,
    marginRight: 8,
  },
  headerFavoriteIcon: {
    color: "#C4A882",
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  description: {
    color: "#B8B5B0",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  progressContainer: {
    gap: 8,
  },
  progressText: {
    color: "#8A8782",
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
  stepCard: {
    backgroundColor: "#22262E",
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: "#3A3F47",
    gap: 16,
  },
  stepNumber: {
    color: "#8A8782",
    fontSize: 14,
    textAlign: "center",
  },
  stepText: {
    color: "#E8E6E3",
    fontSize: 24,
    lineHeight: 34,
    textAlign: "center",
  },
  completedCard: {
    backgroundColor: "#22262E",
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: "#8FA98F",
    alignItems: "center",
  },
  completedText: {
    color: "#8FA98F",
    fontSize: 20,
    textAlign: "center",
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#7B9EA8",
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#1A1D23",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#22262E",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A3F47",
  },
  secondaryButtonText: {
    color: "#B8B5B0",
    fontSize: 16,
  },
});
