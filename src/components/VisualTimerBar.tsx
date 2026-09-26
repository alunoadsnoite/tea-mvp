import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

interface VisualTimerBarProps {
  startTime: number;
  endTime: number;
  isPaused: boolean;
  color?: string;
}

/**
 * VisualTimerBar — Timer visual de preenchimento suave
 * 
 * Em vez de contagem regressiva numérica, mostra uma barra que esvazia
 * progressivamente com animação suave. Sem números estressantes.
 */
export function VisualTimerBar({
  startTime,
  endTime,
  isPaused,
  color = "#7B9EA8",
}: VisualTimerBarProps) {
  const progress = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const totalDuration = endTime - startTime;
    const remaining = Math.max(0, endTime - Date.now());
    const progressValue = remaining / totalDuration;

    if (isPaused) {
      animationRef.current?.stop();
      return;
    }

    animationRef.current = Animated.timing(progress, {
      toValue: progressValue,
      duration: remaining,
      useNativeDriver: false,
    });

    animationRef.current.start();

    return () => {
      animationRef.current?.stop();
    };
  }, [startTime, endTime, isPaused]);

  return (
    <View style={styles.container}>
      <View style={styles.track}>
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
    backgroundColor: "#2A2F38",
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
});
