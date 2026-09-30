import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCheckInStore } from "@/stores/checkInStore";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ThemeColors } from "@/constants/theme";

function startOfToday(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

/**
 * CheckInCard — Resumo visual do check-in de hoje
 *
 * Exibido na Home para acesso rápido ao estado atual.
 * Design sóbrio, sem elementos de urgência.
 */
export function CheckInCard() {
  const entries = useCheckInStore((state) => state.entries);
  const { colors } = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Apenas o registro de hoje: o texto do estado vazio diz "hoje", então
  // mostrar o último registro de qualquer dia seria inconsistente.
  const todayEntry = useMemo(() => {
    const since = startOfToday();
    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i].timestamp >= since) return entries[i];
    }
    return null;
  }, [entries]);

  if (!todayEntry) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nenhum check-in hoje</Text>
      </View>
    );
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-in de hoje</Text>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Bateria Social</Text>
          <Text style={styles.metricValue}>{todayEntry.socialBattery}%</Text>
        </View>

        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Carga Sensorial</Text>
          <Text style={styles.metricValue}>{todayEntry.sensoryLoad}/5</Text>
        </View>

        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Energia Física</Text>
          <Text style={styles.metricValue}>{todayEntry.physicalEnergy}/5</Text>
        </View>
      </View>

      <Text style={styles.timestamp}>às {formatTime(todayEntry.timestamp)}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      width: "100%",
    },
    title: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 16,
      textAlign: "center",
    },
    metrics: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 12,
    },
    metric: {
      alignItems: "center",
    },
    metricLabel: {
      color: colors.textMuted,
      fontSize: 12,
      marginBottom: 4,
    },
    metricValue: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "600",
    },
    timestamp: {
      color: colors.textMuted,
      fontSize: 12,
      textAlign: "center",
    },
    emptyText: {
      color: colors.textMuted,
      fontSize: 14,
      textAlign: "center",
    },
  });