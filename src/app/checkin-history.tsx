import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useCheckInStore } from "@/stores/checkInStore";

/**
 * CheckInHistoryScreen — Histórico de Check-ins
 * 
 * Visualização simples dos últimos 7 dias para identificar padrões.
 */
export default function CheckInHistoryScreen() {
  const getRecentEntries = useCheckInStore((state) => state.getRecentEntries);
  const entries = getRecentEntries(7);

  // Agrupar por dia
  const groupedByDay = entries.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Histórico de Check-ins",
          headerStyle: { backgroundColor: "#1A1D23" },
          headerTintColor: "#E8E6E3",
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {Object.keys(groupedByDay).length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhum check-in nos últimos 7 dias
          </Text>
        ) : (
          Object.entries(groupedByDay).map(([date, dayEntries]) => (
            <View key={date} style={styles.daySection}>
              <Text style={styles.dayTitle}>{date}</Text>
              
              {dayEntries.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <Text style={styles.entryTime}>{formatTime(entry.timestamp)}</Text>
                  
                  <View style={styles.metrics}>
                    <View style={styles.metric}>
                      <Text style={styles.metricLabel}>Bateria Social</Text>
                      <Text style={styles.metricValue}>{entry.socialBattery}%</Text>
                    </View>
                    
                    <View style={styles.metric}>
                      <Text style={styles.metricLabel}>Carga Sensorial</Text>
                      <Text style={styles.metricValue}>{entry.sensoryLoad}/5</Text>
                    </View>
                    
                    <View style={styles.metric}>
                      <Text style={styles.metricLabel}>Energia Física</Text>
                      <Text style={styles.metricValue}>{entry.physicalEnergy}/5</Text>
                    </View>
                  </View>

                  {entry.triggers.length > 0 && (
                    <View style={styles.triggers}>
                      {entry.triggers.map((trigger, index) => (
                        <View key={index} style={styles.triggerChip}>
                          <Text style={styles.triggerText}>{trigger}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  emptyText: {
    color: "#8A8782",
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
  daySection: {
    gap: 12,
  },
  dayTitle: {
    color: "#B8B5B0",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  entryCard: {
    backgroundColor: "#22262E",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3A3F47",
    gap: 12,
  },
  entryTime: {
    color: "#8A8782",
    fontSize: 14,
  },
  metrics: {
    flexDirection: "row",
    justifyContent: "space-around",
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
    fontSize: 18,
    fontWeight: "600",
  },
  triggers: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  triggerChip: {
    backgroundColor: "#2A2F38",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  triggerText: {
    color: "#B8B5B0",
    fontSize: 12,
  },
});
