import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckInCard } from "@/components/CheckInCard";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ThemeColors } from "@/constants/theme";

/**
 * Tela Inicial (Home)
 *
 * Princípios aplicados:
 * - Ação principal: Cartão de Crise em destaque (1 toque)
 * - Check-in card para visualização rápida do estado
 * - Acesso rápido a todas as funcionalidades
 * - Sem contadores vermelhos ou alertas agressivos
 * - Espaçamento generoso para reduzir carga cognitiva
 */
export default function HomeScreen() {
  const { fontSize } = useFontScale();
  const { colors } = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Ação principal — Cartão de Crise */}
        <Link href="/crisis-card" asChild>
          <Pressable
            style={styles.crisisButton}
            accessibilityRole="button"
            accessibilityLabel="Abrir Cartão de Comunicação de Crise"
            accessibilityHint="Toque para acessar o cartão de emergência"
          >
            <Text style={[styles.crisisButtonText, { fontSize: fontSize(20) }]}>
              Estou em sobrecarga
            </Text>
          </Pressable>
        </Link>

        {/* Check-in Card — Resumo visual */}
        <CheckInCard />

        {/* Navegação secundária — discreta */}
        <View style={styles.secondaryActions}>
          <Link href="/interception" asChild>
            <Pressable
              style={styles.secondaryButton}
              accessibilityRole="button"
              accessibilityLabel="Fazer check-in"
              accessibilityHint="Registra como você está se sentindo agora"
            >
              <Text style={[styles.secondaryButtonText, { fontSize: fontSize(15) }]}>
                Fazer check-in
              </Text>
            </Pressable>
          </Link>
          <Link href="/routines" asChild>
            <Pressable
              style={styles.secondaryButton}
              accessibilityRole="button"
              accessibilityLabel="Minhas rotinas"
              accessibilityHint="Inicia ou gerencia suas rotinas visuais"
            >
              <Text style={[styles.secondaryButtonText, { fontSize: fontSize(15) }]}>
                Minhas rotinas
              </Text>
            </Pressable>
          </Link>
          <Link href="/regulation" asChild>
            <Pressable
              style={styles.secondaryButton}
              accessibilityRole="button"
              accessibilityLabel="Estratégias de calma"
              accessibilityHint="Abre os cartões de regulação e a respiração guiada"
            >
              <Text style={[styles.secondaryButtonText, { fontSize: fontSize(15) }]}>
                Estratégias de calma
              </Text>
            </Pressable>
          </Link>
          <Link href="/settings" asChild>
            <Pressable
              style={styles.secondaryButton}
              accessibilityRole="button"
              accessibilityLabel="Configurações"
              accessibilityHint="Ajusta preferências e configura o cartão de comunicação"
            >
              <Text style={[styles.secondaryButtonText, { fontSize: fontSize(15) }]}>
                Configurações
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      paddingTop: 24,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingBottom: 80, // Espaço para o FAB
      gap: 20,
    },
    crisisButton: {
      backgroundColor: colors.accent,
      paddingVertical: 24,
      paddingHorizontal: 32,
      borderRadius: 12,
      width: "100%",
      alignItems: "center",
      minHeight: 80,
      justifyContent: "center",
    },
    crisisButtonText: {
      color: colors.accentText,
      fontWeight: "600",
      textAlign: "center",
    },
    secondaryActions: {
      gap: 10,
      width: "100%",
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      color: colors.textSecondary,
      textAlign: "center",
    },
  });