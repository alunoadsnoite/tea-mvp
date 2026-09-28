import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";

/**
 * Error Boundary — Tela de recuperação de erros inesperados.
 *
 * Mostra uma mensagem discreta e oferece voltar à Home ou abrir o Cartão de Crise.
 */
export default function ErrorBoundaryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Algo deu errado</Text>
      <Text style={styles.message}>
        Ocorreu um problema inesperado. Tente novamente ou reinicie o app.
      </Text>

      <View style={styles.actions}>
        <Link href="/" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Voltar à Home</Text>
          </Pressable>
        </Link>
        <Link href="/crisis-card" asChild>
          <Pressable style={styles.crisisButton}>
            <Text style={styles.crisisButtonText}>Abrir Cartão de Crise</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1D23",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#E8E6E3",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    color: "#8A8782",
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
    backgroundColor: "#22262E",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3A3F47",
    alignItems: "center",
  },
  buttonText: {
    color: "#B8B5B0",
    fontSize: 16,
  },
  crisisButton: {
    backgroundColor: "#7B9EA8",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
  },
  crisisButtonText: {
    color: "#1A1D23",
    fontSize: 16,
    fontWeight: "600",
  },
});
