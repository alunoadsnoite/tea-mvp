import { Stack, useRootNavigationState, useRouter, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { EmergencyFab } from "@/components/EmergencyFab";
import { useThemeMode } from "@/hooks/useThemeMode";
import { View, Linking } from "react-native";

// Registro do error boundary de rota: o Expo Router só reconhece um export
// nomeado `ErrorBoundary` em layout/rota (o antigo `_error.tsx` era ignorado).
export { RouteErrorBoundary as ErrorBoundary } from "@/components/RouteErrorBoundary";

// Mantém o splash screen até que o tema salvo seja lido do armazenamento
void SplashScreen.preventAutoHideAsync();

function ThemedStack() {
  const { colors, isDark } = useThemeMode();
  const router = useRouter();
  const pathname = usePathname();
  const navigationState = useRootNavigationState();
  useEffect(() => {
    if (!navigationState?.key) return;
    let active = true;
    void Linking.getInitialURL().then((url) => {
      if (active && url?.split(/[?#]/)[0] === "tea://crisis-card") router.replace("/crisis-card");
    });
    return () => { active = false; };
  }, [navigationState?.key, router]);

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
      {/* Botão flutuante de emergência em todas as telas (exceto o próprio cartão de crise) */}
      {pathname !== "/crisis-card" && (
        <SafeAreaView edges={["bottom"]} style={{ paddingTop: 8, backgroundColor: colors.background }}>
          <EmergencyFab />
        </SafeAreaView>
      )}
    </View>
  );
}

export default function RootLayout() {
  const { hasHydrated } = useThemeMode();

  useEffect(() => {
    // Só oculta o splash depois da reidratação, para não exibir um flash com
    // a paleta errada quando o usuário tenha salvo o tema claro.
    if (hasHydrated) {
      void SplashScreen.hideAsync();
    }
  }, [hasHydrated]);

  return (
    <SafeAreaProvider>
      <ThemedStack />
    </SafeAreaProvider>
  );
}