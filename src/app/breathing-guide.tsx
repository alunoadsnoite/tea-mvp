import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { BREATHING_EXERCISES, BreathingExerciseConfig } from "@/types/coping";

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 0.6;

/**
 * BreathingGuideScreen — Exercício de Respiração Guiada
 * 
 * Animação suave de expansão/contração sem sons estridentes.
 * Técnicas: 4-4-4-4 (caixa) e 4-7-8 (relaxante).
 */
export default function BreathingGuideScreen() {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExerciseConfig>(
    BREATHING_EXERCISES[0]
  );
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const phaseLabels = ["Inspirar", "Segurar", "Expirar", "Segurar"];
  const pattern = selectedExercise.pattern;

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      return;
    }

    const phaseIndex = currentPhase % pattern.length;
    // Fases com duração 0 (como a 4ª fase do 4-7-8) são puladas automaticamente
    const phaseDuration = Math.max(pattern[phaseIndex] * 1000, 100);

    // Animação de expansão/contração
    const isInhale = phaseIndex === 0;
    const isExhale = phaseIndex === 2;

    if (isInhale) {
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: phaseDuration,
        useNativeDriver: true,
      }).start();
    } else if (isExhale) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: phaseDuration,
        useNativeDriver: true,
      }).start();
    }

    intervalRef.current = setTimeout(() => {
      // Avança para a próxima fase, pulando fases com duração 0
      let nextPhase = (currentPhase + 1) % pattern.length;
      while (pattern[nextPhase] === 0) {
        nextPhase = (nextPhase + 1) % pattern.length;
        if (nextPhase === currentPhase) break; // Evita loop infinito se todas as fases forem 0
      }

      const newCycle = nextPhase <= currentPhase ? cycleCount + 1 : cycleCount;

      if (newCycle >= selectedExercise.cycles) {
        setIsActive(false);
        setCurrentPhase(0);
        setCycleCount(0);
        scaleAnim.setValue(1);
        return;
      }

      setCurrentPhase(nextPhase);
      setCycleCount(newCycle);
    }, phaseDuration);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isActive, currentPhase, selectedExercise]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentPhase(0);
    setCycleCount(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentPhase(0);
    setCycleCount(0);
    scaleAnim.setValue(1);
  };

  const currentPhaseLabel = phaseLabels[currentPhase % pattern.length];
  const progress = Math.min(100, ((cycleCount + (currentPhase + 1) / pattern.length) / selectedExercise.cycles) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Respiração Guiada",
          headerStyle: { backgroundColor: "#1A1D23" },
          headerTintColor: "#E8E6E3",
        }}
      />
      
      <View style={styles.content}>
        {/* Seleção de exercício */}
        <View style={styles.exerciseSelector}>
          {BREATHING_EXERCISES.map((exercise) => (
            <Pressable
              key={exercise.id}
              style={[
                styles.exerciseButton,
                selectedExercise.id === exercise.id && styles.exerciseButtonActive,
              ]}
              onPress={() => {
                handleStop();
                setSelectedExercise(exercise);
              }}
            >
              <Text
                style={[
                  styles.exerciseButtonText,
                  selectedExercise.id === exercise.id && styles.exerciseButtonTextActive,
                ]}
              >
                {exercise.name}
              </Text>
              <Text style={styles.exerciseDescription}>
                {exercise.description}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Círculo de respiração */}
        <View style={styles.circleContainer}>
          <Animated.View
            style={[
              styles.circle,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.phaseLabel}>
              {isActive ? currentPhaseLabel : "Pronto?"}
            </Text>
            {isActive && (
              <Text style={styles.cycleLabel}>
                {cycleCount + 1} / {selectedExercise.cycles}
              </Text>
            )}
          </Animated.View>
        </View>

        {/* Barra de progresso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Padrão de respiração */}
        <View style={styles.patternContainer}>
          <Text style={styles.patternLabel}>Padrão:</Text>
          <View style={styles.patternSteps}>
            {pattern.map((seconds, index) => (
              <View
                key={index}
                style={[
                  styles.patternStep,
                  isActive && currentPhase % pattern.length === index && styles.patternStepActive,
                ]}
              >
                <Text
                  style={[
                    styles.patternStepText,
                    isActive && currentPhase % pattern.length === index && styles.patternStepTextActive,
                  ]}
                >
                  {phaseLabels[index % phaseLabels.length]}
                </Text>
                <Text
                  style={[
                    styles.patternSeconds,
                    isActive && currentPhase % pattern.length === index && styles.patternSecondsActive,
                  ]}
                >
                  {seconds}s
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Botão de controle */}
        <Pressable
          style={[styles.controlButton, isActive && styles.controlButtonStop]}
          onPress={isActive ? handleStop : handleStart}
        >
          <Text style={styles.controlButtonText}>
            {isActive ? "Parar" : "Começar"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1D23",
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  exerciseSelector: {
    gap: 12,
  },
  exerciseButton: {
    backgroundColor: "#22262E",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3F47",
  },
  exerciseButtonActive: {
    borderColor: "#7B9EA8",
    backgroundColor: "#2A2F38",
  },
  exerciseButtonText: {
    color: "#E8E6E3",
    fontSize: 16,
    fontWeight: "600",
  },
  exerciseButtonTextActive: {
    color: "#7B9EA8",
  },
  exerciseDescription: {
    color: "#8A8782",
    fontSize: 14,
    marginTop: 4,
  },
  circleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#7B9EA8",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
  },
  phaseLabel: {
    color: "#1A1D23",
    fontSize: 24,
    fontWeight: "700",
  },
  cycleLabel: {
    color: "#1A1D23",
    fontSize: 16,
    marginTop: 8,
  },
  progressContainer: {
    paddingHorizontal: 24,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#2A2F38",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7B9EA8",
    borderRadius: 4,
  },
  patternContainer: {
    gap: 12,
  },
  patternLabel: {
    color: "#8A8782",
    fontSize: 14,
    textAlign: "center",
  },
  patternSteps: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  patternStep: {
    backgroundColor: "#22262E",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A3F47",
    minWidth: 70,
  },
  patternStepActive: {
    backgroundColor: "#7B9EA8",
    borderColor: "#7B9EA8",
  },
  patternStepText: {
    color: "#B8B5B0",
    fontSize: 12,
  },
  patternStepTextActive: {
    color: "#1A1D23",
  },
  patternSeconds: {
    color: "#8A8782",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  patternSecondsActive: {
    color: "#1A1D23",
  },
  controlButton: {
    backgroundColor: "#7B9EA8",
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  controlButtonStop: {
    backgroundColor: "#C4A882",
  },
  controlButtonText: {
    color: "#1A1D23",
    fontSize: 18,
    fontWeight: "600",
  },
});
