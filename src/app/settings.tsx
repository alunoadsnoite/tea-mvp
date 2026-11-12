import { LANGUAGES } from "@/lib/i18n";
import { useTranslation } from "@/hooks/useTranslation";
import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Linking,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, Link } from "expo-router";
import Constants from "expo-constants";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useFontScale } from "@/hooks/useFontScale";
import { ThemeColors } from "@/constants/theme";

import { usePreferencesStore } from "@/stores/preferencesStore";

const DEVELOPER_EMAIL = "valdenorsa@proton.me";

/**
 * SettingsScreen — Configurações do App
 *
 * Princípios:
 * - Uma opção por vez
 * - Descrições claras
 * - Sem sobrecarga de opções
 */
export default function SettingsScreen() {
  const { t } = useTranslation();
  const { mode, changeMode, colors } = useThemeMode();
  const { trigger } = useHapticFeedback();
  const { fontSize } = useFontScale();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const preferences = usePreferencesStore();
  const options = [
    { label: t("Vibração"), description: t("Permitir feedback por vibração nas interações."), value: preferences.hapticsEnabled, onChange: preferences.setHapticsEnabled },
    { label: t("Reduzir movimento"), description: t("Desativar transições e a expansão do círculo de respiração. A preferência do sistema também é respeitada."), value: preferences.reduceMotion, onChange: preferences.setReduceMotion },
    { label: t("Mostrar próximo passo"), description: t("Exibir Agora / Depois durante as rotinas."), value: preferences.showNextStep, onChange: preferences.setShowNextStep },
  ];

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const themeOptions: { key: typeof mode; label: string; description: string }[] = [
    { key: "dark", label: t("Escuro"), description: t("Reduz fadiga visual (recomendado)") },
    { key: "light", label: t("Claro"), description: t("Para ambientes bem iluminados") },
    { key: "auto", label: t("Automático"), description: t("Segue o tema do sistema") },
  ];

  const handleContactDeveloper = () => {
    Linking.openURL(
      `mailto:${DEVELOPER_EMAIL}?subject=TEA%20Autonomia%20-%20Feedback`
    ).catch(() => {
      // Sem app de e-mail disponível: nada a abrir (o botão não é crítico)
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t("Configurações"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.section} accessibilityRole="radiogroup">
          <Text accessibilityRole="header" style={[styles.sectionTitle, { fontSize: fontSize(20) }]}>
            {t("Idioma")}
          </Text>
          {LANGUAGES.map(({ code, label }) => {
            const selected = preferences.language === code;
            return (
              <Pressable
                key={code}
                style={[
                  styles.optionButton,
                  selected && { borderColor: colors.accent, backgroundColor: colors.accentSoft },
                ]}
                onPress={() => {
                  trigger("light");
                  preferences.setLanguage(code);
                }}
                accessibilityRole="radio"
                accessibilityLabel={label}
                accessibilityLanguage={code}
                accessibilityState={{ selected, checked: selected }}
              >
                <Text style={[styles.optionContent, styles.optionLabel, { fontSize: fontSize(16) }]}>
                  {label}
                </Text>
                {selected && <Text style={[styles.checkmark, { fontSize: fontSize(20) }]}>✓</Text>}
              </Pressable>
            );
          })}
        </View>

        {/* Tema */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize(20) }]}>{t("Tema")}</Text>
          <Text style={[styles.sectionDescription, { fontSize: fontSize(14) }]}>{t("Escolha como o app aparece")}</Text>

          {themeOptions.map((option) => {
            const selected = mode === option.key;
            return (
              <Pressable
                key={option.key}
                style={[
                  styles.optionButton,
                  selected && { borderColor: colors.accent, backgroundColor: colors.accentSoft },
                ]}
                onPress={() => {
                  trigger("light");
                  changeMode(option.key);
                }}
                accessibilityRole="radio"
                accessibilityLabel={option.label}
                accessibilityHint={option.description}
                accessibilityState={{ selected }}
              >
                <View style={styles.optionContent}>
                  <Text style={[styles.optionLabel, { fontSize: fontSize(16) }]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.optionDescription, { fontSize: fontSize(13) }]}>
                    {option.description}
                  </Text>
                </View>
                {selected && (
                  <Text style={[styles.checkmark, { fontSize: fontSize(20) }]}>✓</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize(20) }]}>{t("Preferências")}</Text>
          {options.map((option) => (
            <View key={option.label} style={styles.preferenceRow}>
              <View style={styles.optionContent}>
                <Text style={[styles.optionLabel, { fontSize: fontSize(16) }]}>{option.label}</Text>
                <Text style={[styles.optionDescription, { fontSize: fontSize(14) }]}>{option.description}</Text>
              </View>
              <Switch value={option.value} onValueChange={option.onChange} accessibilityLabel={option.label} accessibilityHint={option.description} />
            </View>
          ))}
        </View>
        <Link href="/crisis-settings" asChild>
          <Pressable style={styles.optionButton} accessibilityRole="button" accessibilityLabel={t("Configurar cartão de comunicação")}>
            <Text style={[styles.optionLabel, { fontSize: fontSize(16) }]}>{t("Configurar cartão de comunicação")}</Text>
          </Pressable>
        </Link>

        {/* Sobre */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize(20) }]}>{t("Sobre")}</Text>
          <Text style={[styles.aboutText, { fontSize: fontSize(14) }]}>
            TEA Autonomia v{appVersion}
            {"\n"}
            {t("App para autonomia e regulação de adultos no Espectro Autista.")}
          </Text>
        </View>

        {/* Desenvolvedor */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize(20) }]}>{t("Desenvolvedor")}</Text>
          <Text style={[styles.developerName, { fontSize: fontSize(14) }]}>Valdenor Tavares</Text>
          <Text style={[styles.developerEmail, { fontSize: fontSize(13) }]}>
            {DEVELOPER_EMAIL}
          </Text>
          <Pressable
            style={[styles.contactButton, { backgroundColor: colors.accent }]}
            onPress={handleContactDeveloper}
            accessibilityRole="button"
            accessibilityLabel={t("Enviar e-mail ao desenvolvedor")}
            accessibilityHint={t("Abre seu aplicativo de e-mail")}
          >
            <Text style={[styles.contactButtonText, { fontSize: fontSize(14) }]}>{t("Enviar e-mail")}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 24,
      gap: 24,
      paddingBottom: 80, // Espaço para o EmergencyFab
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    sectionTitle: {
      color: colors.text,
      fontWeight: "600",
    },
    sectionDescription: {
      color: colors.textMuted,
      marginBottom: 8,
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      marginBottom: 8,
    },
    preferenceRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    optionContent: {
      flex: 1,
    },
    optionLabel: {
      color: colors.text,
      fontWeight: "600",
    },
    optionDescription: {
      color: colors.textMuted,
      marginTop: 2,
    },
    checkmark: {
      color: colors.accent,
      fontWeight: "700",
    },
    aboutText: {
      color: colors.textSecondary,
      lineHeight: 20,
    },
    developerName: {
      color: colors.text,
      fontWeight: "600",
    },
    developerEmail: {
      color: colors.accent,
    },
    contactButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    contactButtonText: {
      color: colors.accentText,
      fontWeight: "600",
    },
  });