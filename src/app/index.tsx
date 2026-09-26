import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckInCard } from "@/components/CheckInCard";

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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Ação principal — Cartão de Crise */}
        <Link href="/crisis-card" asChild>
          <Pressable
            style={styles.crisisButton}
            accessibilityLabel="Abrir Cartão de Comunicação de Crise"
            accessibilityHint="Toque para acessar o cartão de emergência"
          >
            <Text style={styles.crisisButtonText}>
              Estou em sobrecarga
            </Text>
          </Pressable>
        </Link>

        {/* Check-in Card — Resumo visual */}
        <CheckInCard />

        {/* Navegação secundária — discreta */}
        <View style={styles.secondaryActions}>
          <Link href="/interception" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                Fazer check-in
              </Text>
            </Pressable>
          </Link>

          <Link href="/checkin-history" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                Histórico
              </Text>
            </Pressable>
          </Link>

          <Link href="/routines" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                Minhas rotinas
              </Text>
            </Pressable>
          </Link>

          <Link href="/regulation" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                Estratégias de calma
              </Text>
            </Pressable>
          </Link>

          <Link href="/crisis-settings" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                Configurar cartão
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1D23",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 80, // Espaço para o FAB
    gap: 20,
  },
  crisisButton: {
    backgroundColor: "#7B9EA8",
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    minHeight: 80,
    justifyContent: "center",
  },
  crisisButtonText: {
    color: "#1A1D23",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryActions: {
    gap: 10,
    width: "100%",
  },
  secondaryButton: {
    backgroundColor: "#22262E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A3F47",
  },
  secondaryButtonText: {
    color: "#B8B5B0",
    fontSize: 15,
    textAlign: "center",
  },
});
