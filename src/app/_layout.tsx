import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { EmergencyFab } from "@/components/EmergencyFab";
import { useThemeMode } from "@/hooks/useThemeMode";
import { View } from "react-native";

// Previne que o splash screen seja ocultado automaticamente
void SplashScreen.preventAutoHideAsync();

function ThemedStack() {
  const { colors, isDark } = useThemeMode();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "fade", // Animação suave, sem elementos piscando
        }}
      />
      {/* Botão flutuante de emergência em todas as telas */}
      <EmergencyFab />
    </View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Quando o app estiver pronto, oculta o splash screen
    void SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemedStack />
    </SafeAreaProvider>
  );
}
