import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useTranslation } from "@/hooks/useTranslation";
import { isProEdition } from "@/lib/edition";
import {
  editPlanItems, loadEventPlans, useEventPlanStore,
  type EventPlan, type PlanList,
} from "@/stores/eventPlanStore";

const fields = {
  title: "Nome do evento",
  date: "Data (AAAA-MM-DD)",
  preparation: "Roteiro de preparação",
  objects: "Objetos para levar",
  alternatives: "Alternativas para imprevistos",
} as const;

const lists: PlanList[] = ["preparation", "objects"];

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export default function EventPlansRoute() {
  if (!isProEdition) return <Redirect href="/" />;
  return <EventPlans />;
}

function EventPlans() {
  const { t } = useTranslation();
  const { colors } = useThemeMode();
  const { fontSize } = useFontScale();
  const { plans, save, remove, toggle } = useEventPlanStore();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [selected, setSelected] = useState<string>();
  const [editor, setEditor] = useState<{
    id?: string;
    title: string;
    date: string;
    preparation: string;
    objects: string;
    alternatives: string;
  }>();
  const plan = plans.find(({ id }) => id === selected);

  useEffect(() => {
    let active = true;
    void loadEventPlans().then(
      () => { if (active) setStatus("ready"); },
      () => { if (active) setStatus("error"); }
    );
    return () => { active = false; };
  }, []);

  function openEditor(source?: EventPlan, reuse = false) {
    setEditor({
      id: reuse ? undefined : source?.id,
      title: source?.title ?? "",
      date: reuse ? "" : source?.date ?? "",
      preparation: source?.preparation.map(({ text }) => text).join("\n") ?? "",
      objects: source?.objects.map(({ text }) => text).join("\n") ?? "",
      alternatives: source?.alternatives ?? "",
    });
  }

  function saveEditor() {
    if (!editor || !editor.title.trim()) return;
    const date = editor.date.trim();
    if (date && !validDate(date)) {
      Alert.alert(t("Informe uma data válida no formato AAAA-MM-DD."));
      return;
    }
    const previous = plans.find(({ id }) => id === editor.id);
    const id = save({
      title: editor.title,
      date,
      preparation: editPlanItems(editor.preparation, previous?.preparation ?? []),
      objects: editPlanItems(editor.objects, previous?.objects ?? []),
      alternatives: editor.alternatives.trim(),
    }, editor.id);
    setSelected(id);
    setEditor(undefined);
  }

  const button = (label: string, onPress: () => void, disabled = false) => (
    <Pressable
      style={[styles.control, { borderColor: colors.borderStrong, opacity: disabled ? 0.6 : 1 }]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={{ color: colors.text, fontSize: fontSize(16) }}>{label}</Text>
    </Pressable>
  );

  const text = (value: string, header = false) => (
    <Text
      accessibilityRole={header ? "header" : undefined}
      style={{ color: colors.text, fontSize: fontSize(header ? 20 : 16), fontWeight: header ? "600" : "400" }}
    >
      {value}
    </Text>
  );

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{
        headerShown: true, title: t("Planejar eventos"),
        headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text,
      }} />
      {status === "loading" && text(t("Aguarde."))}
      {status === "error" && text(t("Não foi possível carregar os planos."))}
      {status === "ready" && editor && (
        <>
          {text(t(editor.id ? "Editar plano" : "Novo plano"), true)}
          {(Object.keys(fields) as (keyof typeof fields)[]).map((key) => {
            const multiline = key !== "title" && key !== "date";
            return (
              <View key={key} style={styles.field}>
                {text(t(fields[key]))}
                <TextInput
                  style={[styles.control, { color: colors.text, borderColor: colors.borderStrong, fontSize: fontSize(16) }]}
                  value={editor[key]}
                  onChangeText={(value) => setEditor({ ...editor, [key]: value })}
                  accessibilityLabel={t(fields[key])}
                  accessibilityHint={lists.some((list) => list === key) ? t("Escreva um item por linha.") : undefined}
                  multiline={multiline}
                  maxLength={key === "date" ? 10 : key === "title" ? 120 : 4000}
                  textAlignVertical={multiline ? "top" : "center"}
                />
              </View>
            );
          })}
          {button(t("Salvar plano"), saveEditor, !editor.title.trim())}
          {button(t("Cancelar"), () => setEditor(undefined))}
        </>
      )}
      {status === "ready" && !editor && plan && (
        <>
          {button(t("Ver todos os planos"), () => setSelected(undefined))}
          {text(plan.title, true)}
          {!!plan.date && text(plan.date)}
          {lists.map((list) => (
            <View key={list} style={styles.field}>
              {text(t(fields[list]), true)}
              {plan[list].length === 0 && text(t("Nenhum item."))}
              {plan[list].map((item) => (
                <Pressable key={item.id} style={[styles.control, { borderColor: colors.borderStrong }]}
                  accessibilityRole="checkbox" accessibilityLabel={item.text}
                  accessibilityState={{ checked: item.done }}
                  onPress={() => toggle(plan.id, list, item.id)}>
                  {text(`${item.done ? "✓" : "○"}  ${item.text}`)}
                </Pressable>
              ))}
            </View>
          ))}
          {!!plan.alternatives && (
            <View style={styles.field}>
              {text(t(fields.alternatives), true)}
              {text(plan.alternatives)}
            </View>
          )}
          {button(t("Editar plano"), () => openEditor(plan))}
          {button(t("Reutilizar como modelo"), () => openEditor(plan, true))}
          {button(t("Excluir plano"), () => Alert.alert(t("Excluir plano?"), plan.title, [
            { text: t("Cancelar"), style: "cancel" },
            { text: t("Excluir"), style: "destructive", onPress: () => { remove(plan.id); setSelected(undefined); } },
          ]))}
        </>
      )}
      {status === "ready" && !editor && !plan && (
        <>
          {button(t("Novo plano"), () => openEditor())}
          {plans.length === 0 && text(t("Nenhum plano salvo."))}
          {plans.map((item) => (
            <View key={item.id}>
              {button(item.date ? `${item.title} · ${item.date}` : item.title, () => setSelected(item.id))}
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, gap: 16 },
  control: { minHeight: 48, padding: 12, borderWidth: 1, borderRadius: 8, justifyContent: "center" },
  field: { gap: 8 },
});
