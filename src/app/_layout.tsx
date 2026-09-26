import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { EmergencyFab } from "@/components/EmergencyFab";

export default function RootLayout() {
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
