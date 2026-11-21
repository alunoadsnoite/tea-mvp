import React, { useRef, useState } from "react";
import {
  AccessibilityInfo,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useTranslation } from "@/hooks/useTranslation";
import { InvalidBackupError, restoreBackup, validateBackup } from "@/lib/backup";
import { saveBackupFile, selectBackupFile } from "@/lib/backupFiles";

export default function BackupScreen() {
  const { t } = useTranslation();
  const { colors } = useThemeMode();
  const { fontSize } = useFontScale();
  const [busy, setBusy] = useState(false);
  const operation = useRef(false);

  function run(action: () => Promise<void>, failure: string) {
    if (operation.current) return;
    operation.current = true;
    setBusy(true);
    void action().catch((error: unknown) => {
      Alert.alert(error instanceof InvalidBackupError ? t("Arquivo inválido ou incompatível.") : failure);
    }).finally(() => {
      operation.current = false;
      setBusy(false);
    });
  }

  function confirmRestore(text: string) {
    Alert.alert(
      t("Restaurar backup?"),
      t("Os dados atuais desta edição serão substituídos pelos do arquivo. Salve um backup dos dados atuais antes de continuar."),
      [
        { text: t("Cancelar"), style: "cancel" },
        {
          text: t("Substituir dados"),
          style: "destructive",
          onPress: () => run(async () => {
            await restoreBackup(text);
            Alert.alert(t("Backup restaurado."));
          }, t("Não foi possível restaurar o backup.")),
        },
      ]
    );
  }

  const actions = [
    {
      label: t("Salvar backup"),
      hint: Platform.OS === "android" ? t("Abre o seletor de pastas.") : t("Abre as opções para salvar o arquivo."),
      onPress: () => run(async () => {
        if (await saveBackupFile() === "saved") Alert.alert(t("Backup salvo."));
      }, t("Não foi possível salvar o backup.")),
    },
    {
      label: t("Selecionar backup"),
      hint: t("Abre o seletor de arquivos. A restauração pede confirmação."),
      onPress: () => run(async () => {
        const text = await selectBackupFile();
        if (text === null) return;
        validateBackup(text);
        confirmRestore(text);
      }, t("Não foi possível ler o arquivo.")),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={[]}>
      <Stack.Screen options={{
        headerShown: true,
        title: t("Backup e migração"),
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={{ color: colors.text, fontSize: fontSize(16) }}>
          {t("Salve um arquivo para transferir seus dados entre a edição gratuita e a PRO ou para outro aparelho.")}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: fontSize(16) }}>
          {t("O arquivo contém dados pessoais e não é criptografado. Guarde-o em um local privado.")}
        </Text>
        {actions.map(({ label, hint, onPress }) => (
          <Pressable
            key={label}
            style={[styles.button, { borderColor: colors.borderStrong, opacity: busy ? 0.6 : 1 }]}
            onPress={() => {
              AccessibilityInfo.announceForAccessibility(t("Aguarde."));
              onPress();
            }}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityHint={hint}
            accessibilityState={{ disabled: busy, busy }}
          >
            <Text style={{ color: colors.text, fontSize: fontSize(16), fontWeight: "600" }}>{label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, gap: 16 },
  button: { minHeight: 48, padding: 14, justifyContent: "center", borderWidth: 1, borderRadius: 8 },
});
