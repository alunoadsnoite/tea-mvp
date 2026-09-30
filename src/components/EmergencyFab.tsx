import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ThemeColors } from "@/constants/theme";

/**
 * EmergencyFab — Botão Flutuante de Emergência
 *
 * Acesso instantâneo ao Cartão de Crise de qualquer tela.
 * Discreto mas sempre visível, sem cores agressivas.
 *
 * Não aparece no próprio Cartão de Crise: ali ele cobriria os botões de
 * ligação/emergência, que são a ação principal daquela tela.
 */
export function EmergencyFab() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useThemeMode();

  if (pathname === "/crisis-card") return null;

  const styles = createStyles(colors);

  return (
    <Pressable
      style={styles.fab}
      onPress={() => router.push("/crisis-card")}
      accessibilityRole="button"
      accessibilityLabel="Abrir Cartão de Crise"
      accessibilityHint="Toque para acessar o cartão de emergência"
    >
      <Text style={styles.fabText}>!</Text>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    fab: {
      position: "absolute",
      bottom: 32,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.accent,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
    },
    fabText: {
      color: colors.accentText,
      fontSize: 24,
      fontWeight: "700",
    },
  });