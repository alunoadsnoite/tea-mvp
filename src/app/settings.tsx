import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useFontScale } from "@/hooks/useFontScale";

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
  const { fontSize } = useFontScale();

  const themeOptions: { key: typeof mode; label: string; description: string }[] = [
    { key: "dark", label: "Escuro", description: "Reduz fadiga visual (recomendado)" },
    { key: "light", label: "Claro", description: "Para ambientes bem iluminados" },
    { key: "auto", label: "Automático", description: "Segue o tema do sistema" },
  ];

  const handleContactDeveloper = () => {
    Linking.openURL("mailto:valdenorsa@proton.me?subject=TEA%20Autonomia%20-%20Feedback");
  };

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
          <Text style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text, fontSize: fontSize(20) }])}>
            Tema
          </Text>
          <Text style={StyleSheet.flatten([styles.sectionDescription, { color: colors.textSecondary, fontSize: fontSize(14) }])}>
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
                <Text style={[styles.optionLabel, { color: colors.text, fontSize: fontSize(16) }]}>
                  {option.label}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary, fontSize: fontSize(13) }]}>
                  {option.description}
                </Text>
              </View>
              {mode === option.key && (
                <Text style={[styles.checkmark, { color: colors.accent, fontSize: fontSize(20) }]}>✓</Text>
              )}
            </Pressable>
          ))}
        </View>

        {/* Sobre */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize(20) }]}>
            Sobre
          </Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary, fontSize: fontSize(14) }]}>
            TEA Autonomia v1.0.5
            {"\n"}
            App para autonomia e regulação de adultos no Espectro Autista.
          </Text>
        </View>

        {/* Desenvolvedor */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize(20) }]}>
            Desenvolvedor
          </Text>
          <Text style={[styles.developerName, { color: colors.text, fontSize: fontSize(14) }]}>
            Valdenor Tavares
          </Text>
          <Text style={[styles.developerEmail, { color: colors.textSecondary, fontSize: fontSize(13) }]}>
            valdenorsa@proton.me
          </Text>
          <Pressable
            style={[styles.contactButton, { backgroundColor: colors.accent }]}
            onPress={handleContactDeveloper}
          >
            <Text style={[styles.contactButtonText, { color: colors.background, fontSize: fontSize(14) }]}>
              Enviar e-mail
            </Text>
          </Pressable>
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
    fontWeight: "600",
  },
  sectionDescription: {
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
    fontWeight: "600",
  },
  optionDescription: {
    marginTop: 2,
  },
  checkmark: {
    fontWeight: "700",
  },
  aboutText: {
    lineHeight: 20,
  },
  developerName: {
    fontWeight: "600",
  },
  developerEmail: {
  },
  contactButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  contactButtonText: {
    fontWeight: "600",
  },
});
