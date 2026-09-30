import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { BREATHING_EXERCISES, BreathingExerciseConfig } from "@/types/coping";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ThemeColors } from "@/constants/theme";

/**
 * BreathingGuideScreen — Exercício de Respiração Guiada
 *
 * Animação suave de expansão/contração sem sons estridentes.
 * Técnicas: 4-4-4-4 (caixa) e 4-7-8 (relaxante).
 */
export default function BreathingGuideScreen() {
  const { colors } = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
  const progress = Math.min(
    100,
    ((cycleCount + (currentPhase + 1) / pattern.length) / selectedExercise.cycles) * 100
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Respiração Guiada",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
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
              accessibilityRole="radio"
              accessibilityLabel={exercise.name}
              accessibilityState={{ selected: selectedExercise.id === exercise.id }}
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
          accessibilityRole="button"
          accessibilityLabel={isActive ? "Parar exercício" : "Começar exercício"}
          accessibilityHint={
            isActive
              ? "Interrompe o ciclo de respiração"
              : `Inicia ${selectedExercise.cycles} ciclos de respiração ${selectedExercise.name}`
          }
        >
          <Text style={styles.controlButtonText}>
            {isActive ? "Parar" : "Começar"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
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
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    exerciseButtonActive: {
      borderColor: colors.accent,
      backgroundColor: colors.surfaceAlt,
    },
    exerciseButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
    exerciseButtonTextActive: {
      color: colors.accent,
    },
    exerciseDescription: {
      color: colors.textMuted,
      fontSize: 14,
      marginTop: 4,
    },
    circleContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    circle: {
      width: "60%",
      aspectRatio: 1,
      borderRadius: 9999,
      backgroundColor: colors.accent,
      justifyContent: "center",
      alignItems: "center",
      opacity: 0.8,
    },
    phaseLabel: {
      color: colors.accentText,
      fontSize: 24,
      fontWeight: "700",
    },
    cycleLabel: {
      color: colors.accentText,
      fontSize: 16,
      marginTop: 8,
    },
    progressContainer: {
      paddingHorizontal: 24,
    },
    progressTrack: {
      height: 8,
      backgroundColor: colors.surfaceAlt,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.accent,
      borderRadius: 4,
    },
    patternContainer: {
      gap: 12,
    },
    patternLabel: {
      color: colors.textMuted,
      fontSize: 14,
      textAlign: "center",
    },
    patternSteps: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 12,
    },
    patternStep: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      minWidth: 70,
    },
    patternStepActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    patternStepText: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    patternStepTextActive: {
      color: colors.accentText,
    },
    patternSeconds: {
      color: colors.textMuted,
      fontSize: 18,
      fontWeight: "600",
      marginTop: 4,
    },
    patternSecondsActive: {
      color: colors.accentText,
    },
    controlButton: {
      backgroundColor: colors.accent,
      paddingVertical: 18,
      borderRadius: 8,
      alignItems: "center",
    },
    controlButtonStop: {
      backgroundColor: colors.warm,
    },
    controlButtonText: {
      color: colors.accentText,
      fontSize: 18,
      fontWeight: "600",
    },
  });
