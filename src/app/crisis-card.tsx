import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { CrisisCardModal } from "@/components/CrisisCardModal";

/**
 * Tela — Cartão de Comunicação de Crise
 * 
 * Modo cheio e alto contraste para momentos de sobrecarga sensorial.
 * Funcional 100% offline.
 */
export default function CrisisCardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Cartão de Crise",
          headerStyle: { backgroundColor: "#1A1D23" },
          headerTintColor: "#E8E6E3",
          headerBackTitle: "Voltar",
        }}
      />
      <CrisisCardModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1D23",
  },
});
