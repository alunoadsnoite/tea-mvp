import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCheckInStore } from "@/stores/checkInStore";
import { useThemeMode } from "@/hooks/useThemeMode";

/**
 * CheckInCard — Resumo visual do último check-in
 * 
 * Exibido na Home para acesso rápido ao estado atual.
 * Design sóbrio, sem elementos de urgência.
 */
export function CheckInCard() {
  const lastEntry = useCheckInStore((state) => state.getLastEntry());
  const { colors } = useThemeMode();

  if (!lastEntry) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          Nenhum check-in hoje
        </Text>
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
      <Text style={styles.title}>Último check-in</Text>
      
      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Bateria Social</Text>
          <Text style={styles.metricValue}>{lastEntry.socialBattery}%</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Carga Sensorial</Text>
          <Text style={styles.metricValue}>{lastEntry.sensoryLoad}/5</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Energia Física</Text>
          <Text style={styles.metricValue}>{lastEntry.physicalEnergy}/5</Text>
        </View>
      </View>

      <Text style={styles.timestamp}>
        às {formatTime(lastEntry.timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#22262E",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#3A3F47",
    width: "100%",
  },
  title: {
    color: "#B8B5B0",
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
    color: "#8A8782",
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    color: "#E8E6E3",
    fontSize: 20,
    fontWeight: "600",
  },
  timestamp: {
    color: "#8A8782",
    fontSize: 12,
    textAlign: "center",
  },
  emptyText: {
    color: "#8A8782",
    fontSize: 14,
    textAlign: "center",
  },
});
