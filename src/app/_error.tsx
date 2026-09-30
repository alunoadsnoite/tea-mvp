import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ThemeColors } from "@/constants/theme";

/**
 * ErrorBoundaryScreen — Tela de recuperação de erros inesperados.
 *
 * Mostra uma mensagem discreta, oferece tentar novamente e mantém o acesso
 * direto ao Cartão de Crise.
 */
export default function ErrorBoundaryScreen({ retry }: { retry?: () => void }) {
  const { colors } = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Algo deu errado</Text>
        <Text style={styles.message}>
          Ocorreu um problema inesperado. Tente novamente ou volte ao início.
        </Text>

        <View style={styles.actions}>
          {retry && (
            <Pressable
              style={styles.button}
              onPress={retry}
              accessibilityRole="button"
              accessibilityLabel="Tentar novamente"
            >
              <Text style={styles.buttonText}>Tentar novamente</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.button}
            onPress={() => router.replace("/")}
            accessibilityRole="button"
            accessibilityLabel="Voltar ao início"
          >
            <Text style={styles.buttonText}>Voltar ao início</Text>
          </Pressable>

          <Pressable
            style={styles.crisisButton}
            onPress={() => router.replace("/crisis-card")}
            accessibilityRole="button"
            accessibilityLabel="Abrir Cartão de Crise"
          >
            <Text style={styles.crisisButtonText}>Abrir Cartão de Crise</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      padding: 24,
      justifyContent: "center",
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 16,
      textAlign: "center",
    },
    message: {
      color: colors.textMuted,
      fontSize: 16,
      lineHeight: 24,
      textAlign: "center",
      marginBottom: 40,
    },
    actions: {
      gap: 12,
      width: "100%",
    },
    button: {
      backgroundColor: colors.surface,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },
    buttonText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
    crisisButton: {
      backgroundColor: colors.accent,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 8,
      alignItems: "center",
    },
    crisisButtonText: {
      color: colors.accentText,
      fontSize: 16,
      fontWeight: "600",
    },
  });