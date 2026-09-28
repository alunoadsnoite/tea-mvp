import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { EmergencyFab } from "@/components/EmergencyFab";

// Previne que o splash screen seja ocultado automaticamente
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Quando o app estiver pronto, oculta o splash screen
    void SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#1A1D23" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#1A1D23" },
          animation: "fade", // Animação suave, sem elementos piscando
        }}
      />
      {/* Botão flutuante de emergência em todas as telas */}
      <EmergencyFab />
    </SafeAreaProvider>
  );
}
