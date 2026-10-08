import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useCheckInStore } from "@/stores/checkInStore";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ThemeColors } from "@/constants/theme";
import { CheckInEntry } from "@/types/checkin";

/**
 * CheckInHistoryScreen — Histórico de Check-ins
 *
 * Visualização simples dos últimos 7 dias para identificar padrões.
 */
export default function CheckInHistoryScreen() {
  const { fontSize } = useFontScale();
  const getRecentEntries = useCheckInStore((state) => state.getRecentEntries);
  const clearHistory = useCheckInStore((state) => state.clearHistory);
  // Referência estável do store: usar `getRecentEntries().length` criaria um
  // array novo a cada render e invalidaria o memo de agrupamento.
  const allEntries = useCheckInStore((state) => state.entries);
  const { colors } = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Filtrar e agrupar por dia. A dependência é a referência do store, então o
  // memo só recalcula quando um check-in é adicionado ou removido.
  const groupedByDay = useMemo(() => {
    const entries = getRecentEntries(7);
    return entries.reduce((acc, entry) => {
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
    }, {} as Record<string, CheckInEntry[]>);
  }, [allEntries, getRecentEntries]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Limpar histórico",
      "Todos os check-ins registrados serão apagados definitivamente. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Apagar tudo", style: "destructive", onPress: clearHistory },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Histórico de Check-ins",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {Object.keys(groupedByDay).length === 0 ? (
          <Text style={[styles.emptyText, { fontSize: fontSize(16) }]}>
            Nenhum check-in nos últimos 7 dias
          </Text>
        ) : (
          <>
            {Object.entries(groupedByDay).map(([date, dayEntries]) => (
              <View key={date} style={styles.daySection}>
                <Text style={[styles.dayTitle, { fontSize: fontSize(16) }]}>{date}</Text>

                {dayEntries.map((entry) => (
                  <View key={entry.id} style={styles.entryCard}>
                    <Text style={[styles.entryTime, { fontSize: fontSize(14) }]}>
                      {formatTime(entry.timestamp)}
                    </Text>

                    <View style={styles.metrics}>
                      <View style={styles.metric}>
                        <Text style={[styles.metricLabel, { fontSize: fontSize(12) }]}>Bateria Social</Text>
                        <Text style={[styles.metricValue, { fontSize: fontSize(18) }]}>{entry.socialBattery}%</Text>
                      </View>

                      <View style={styles.metric}>
                        <Text style={[styles.metricLabel, { fontSize: fontSize(12) }]}>Carga Sensorial</Text>
                        <Text style={[styles.metricValue, { fontSize: fontSize(18) }]}>{entry.sensoryLoad}/5</Text>
                      </View>

                      <View style={styles.metric}>
                        <Text style={[styles.metricLabel, { fontSize: fontSize(12) }]}>Energia Física</Text>
                        <Text style={[styles.metricValue, { fontSize: fontSize(18) }]}>{entry.physicalEnergy}/5</Text>
                      </View>
                    </View>

                    {entry.triggers.length > 0 && (
                      <View style={styles.triggers}>
                        {entry.triggers.map((trigger, index) => (
                          <View key={`${entry.id}-${trigger}-${index}`} style={styles.triggerChip}>
                            <Text style={[styles.triggerText, { fontSize: fontSize(12) }]}>{trigger}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

        {/* Apagar histórico — os check-ins registram dados pessoais sensíveis.
            Fica fora do branch de lista vazia: registros anteriores a 7 dias
            não aparecem no grupo, mas ainda precisam ser apagáveis. */}
        {allEntries.length > 0 && (
          <Pressable
            style={styles.clearButton}
            onPress={handleClearHistory}
            accessibilityRole="button"
            accessibilityLabel="Limpar histórico de check-ins"
            accessibilityHint="Apaga definitivamente todos os check-ins registrados"
          >
            <Text style={[styles.clearButtonText, { fontSize: fontSize(15) }]}>
              Limpar histórico
            </Text>
          </Pressable>
        )}
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
      gap: 24,
      paddingBottom: 80, // Espaço para o EmergencyFab
    },
    emptyText: {
      color: colors.textMuted,
      textAlign: "center",
      marginTop: 32,
    },
    daySection: {
      gap: 12,
    },
    dayTitle: {
      color: colors.textSecondary,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    entryCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    entryTime: {
      color: colors.textMuted,
    },
    metrics: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    metric: {
      alignItems: "center",
    },
    metricLabel: {
      color: colors.textMuted,
      marginBottom: 4,
    },
    metricValue: {
      color: colors.text,
      fontWeight: "600",
    },
    triggers: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    triggerChip: {
      backgroundColor: colors.surfaceAlt,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
    },
    triggerText: {
      color: colors.textSecondary,
    },
    clearButton: {
      backgroundColor: "transparent",
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.warm,
      marginTop: 8,
    },
    clearButtonText: {
      color: colors.warm,
    },
  });