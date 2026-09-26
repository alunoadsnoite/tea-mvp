import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";

/**
 * EmergencyFab — Botão Flutuante de Emergência
 * 
 * Acesso instantâneo ao Cartão de Crise de qualquer tela.
 * Discreto mas sempre visível, sem cores agressivas.
 */
export function EmergencyFab() {
  const router = useRouter();

  return (
    <Pressable
      style={styles.fab}
      onPress={() => router.push("/crisis-card")}
      accessibilityLabel="Abrir Cartão de Crise"
      accessibilityHint="Toque para acessar o cartão de emergência"
    >
      <Text style={styles.fabText}>!</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7B9EA8",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: "#1A1D23",
    fontSize: 24,
    fontWeight: "700",
  },
});
