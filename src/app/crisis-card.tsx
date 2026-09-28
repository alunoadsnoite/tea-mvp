import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { CrisisCardModal } from "@/components/CrisisCardModal";
import { useThemeMode } from "@/hooks/useThemeMode";

/**
 * Tela — Cartão de Comunicação de Crise
 * 
 * Modo cheio e alto contraste para momentos de sobrecarga sensorial.
 * Funcional 100% offline.
 * Suporta rotação automática (portrait e landscape).
 */
export default function CrisisCardScreen() {
  const { colors } = useThemeMode();
  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Cartão de Crise",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerBackTitle: "Voltar",
          orientation: "default",
        }}
      />
      <CrisisCardModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
