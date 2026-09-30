import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

interface VisualTimerBarProps {
  startTime: number;
  endTime: number;
  isPaused: boolean;
  color: string;
  trackColor: string;
}

/**
 * VisualTimerBar — Timer visual de preenchimento suave
 *
 * Em vez de contagem regressiva numérica, mostra uma barra que esvazia
 * progressivamente com animação suave. Sem números estressantes.
 *
 * A barra sempre parte da fração de tempo restante real. Isso faz a pausa
 * congelar a barra no ponto em que ela estava (sem voltar a 100%) e a
 * retomada continuar de onde parou, em vez de reiniciar o passo.
 */
export function VisualTimerBar({
  startTime,
  endTime,
  isPaused,
  color,
  trackColor,
}: VisualTimerBarProps) {
  const progress = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Ao pausar, apenas congela a animação onde ela está.
    if (isPaused) {
      animationRef.current?.stop();
      return;
    }

    const totalDuration = endTime - startTime;
    if (totalDuration <= 0) {
      progress.setValue(0);
      return;
    }

    const remaining = Math.max(0, endTime - Date.now());
    const fromValue = Math.min(Math.max(remaining / totalDuration, 0), 1);

    // Parte do que realmente resta do passo — evita salto visual ao retomar.
    progress.setValue(fromValue);

    if (remaining === 0) return;

    animationRef.current = Animated.timing(progress, {
      toValue: 0,
      duration: remaining,
      useNativeDriver: false,
    });

    animationRef.current.start();

    return () => {
      animationRef.current?.stop();
    };
  }, [startTime, endTime, isPaused, progress]);

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
});