import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

/**
 * SettingsScreen — Configurações do App
 * 
 * Princípios:
 * - Uma opção por vez
 * - Descrições claras
 * - Sem sobrecarga de opções
 */
export default function SettingsScreen() {
  const { mode, changeMode, colors } = useThemeMode();
  const { trigger } = useHapticFeedback();

  const themeOptions: { key: typeof mode; label: string; description: string }[] = [
    { key: "dark", label: "Escuro", description: "Reduz fadiga visual (recomendado)" },
    { key: "light", label: "Claro", description: "Para ambientes bem iluminados" },
    { key: "auto", label: "Automático", description: "Segue o tema do sistema" },
  ];

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Configurações",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Tema */}
        <View style={StyleSheet.flatten([styles.section, { backgroundColor: colors.surface }])}>
          <Text style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>
            Tema
          </Text>
          <Text style={StyleSheet.flatten([styles.sectionDescription, { color: colors.textSecondary }])}>
            Escolha como o app aparece
          </Text>

          {themeOptions.map((option) => (
            <Pressable
              key={option.key}
              style={StyleSheet.flatten([
                styles.optionButton,
                { borderColor: colors.textSecondary },
                mode === option.key && { borderColor: colors.accent, backgroundColor: colors.accent + "20" },
              ])}
              onPress={() => {
                trigger("light");
                changeMode(option.key);
              }}
              accessibilityLabel={option.label}
              accessibilityHint={option.description}
            >
              <View style={styles.optionContent}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  {option.label}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  {option.description}
                </Text>
              </View>
              {mode === option.key && (
                <Text style={[styles.checkmark, { color: colors.accent }]}>✓</Text>
              )}
            </Pressable>
          ))}
        </View>

        {/* Sobre */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Sobre
          </Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            TEA Autonomia v1.0.4{'\n'}
            App para autonomia e regulação de adultos no Espectro Autista.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  section: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#3A3F47",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  optionDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: "700",
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
