import { localizeCrisisMessage } from "@/lib/localizedContent";
import { useTranslation } from "@/hooks/useTranslation";
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useCrisisStore } from "@/stores/crisisStore";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ThemeColors } from "@/constants/theme";

/**
 * CrisisSettingsScreen — Configurações do Cartão de Crise
 *
 * Permite editar mensagens, gerenciar contatos de emergência e definir
 * o contato primário usado pelo cartão de crise.
 */
export default function CrisisSettingsScreen() {
  const { t } = useTranslation();
  const { fontSize } = useFontScale();
  const { colors } = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    messages,
    contacts,
    primaryContactId,
    addMessage,
    updateMessage,
    setMessageHidden,
    deleteMessage,
    addContact,
    updateContact,
    deleteContact,
    setPrimaryContact,
    resetToDefaults,
  } = useCrisisStore();

  // Estados para formulários
  const [editingMessage, setEditingMessage] = useState<{ id: string; title: string; content: string } | null>(null);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messageError, setMessageError] = useState<string | null>(null);

  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactRelationship, setContactRelationship] = useState("");
  const [contactError, setContactError] = useState<string | null>(null);

  // Salvar mensagem
  const handleSaveMessage = () => {
    if (!messageTitle.trim() || !messageContent.trim()) {
      setMessageError(t("Preencha o título e o conteúdo da mensagem para salvar."));
      return;
    }
    setMessageError(null);

    if (editingMessage) {
      const title = messageTitle.trim();
      const content = messageContent.trim();
      updateMessage(editingMessage.id, {
        ...(title !== editingMessage.title ? { title } : {}),
        ...(content !== editingMessage.content ? { content } : {}),
      });
    } else {
      addMessage({
        title: messageTitle.trim(),
        content: messageContent.trim(),
      });
    }

    setEditingMessage(null);
    setMessageTitle("");
    setMessageContent("");
  };

  // Editar mensagem
  const handleEditMessage = (id: string) => {
    const message = messages.find((m) => m.id === id);
    if (!message) return;

    const localized = localizeCrisisMessage(message, t);
    setEditingMessage(localized);
    setMessageTitle(localized.title);
    setMessageContent(localized.content);
    setMessageError(null);
  };

  const handleDeleteMessage = (id: string, title: string) => {
    Alert.alert(
      t("Excluir mensagem"),
      t("A mensagem \"{0}\" será removida do cartão de crise. Deseja continuar?", title),
      [
        { text: t("Cancelar"), style: "cancel" },
        { text: t("Excluir"), style: "destructive", onPress: () => deleteMessage(id) },
      ]
    );
  };

  // Salvar contato
  const handleSaveContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      setContactError(t("Preencha o nome e o telefone do contato para salvar."));
      return;
    }
    setContactError(null);

    if (editingContact) {
      updateContact(editingContact, {
        name: contactName.trim(),
        phone: contactPhone.trim(),
        relationship: contactRelationship.trim(),
      });
    } else {
      addContact({
        name: contactName.trim(),
        phone: contactPhone.trim(),
        relationship: contactRelationship.trim(),
      });
    }

    setEditingContact(null);
    setContactName("");
    setContactPhone("");
    setContactRelationship("");
  };

  // Editar contato
  const handleEditContact = (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;

    setEditingContact(id);
    setContactName(contact.name);
    setContactPhone(contact.phone);
    setContactRelationship(contact.relationship);
    setContactError(null);
  };

  const handleDeleteContact = (id: string, name: string) => {
    Alert.alert(
      t("Excluir contato"),
      t("O contato \"{0}\" será removido do cartão de crise. Deseja continuar?", name),
      [
        { text: t("Cancelar"), style: "cancel" },
        { text: t("Excluir"), style: "destructive", onPress: () => deleteContact(id) },
      ]
    );
  };

  // Resetar padrões
  const handleReset = () => {
    Alert.alert(
      t("Restaurar padrões"),
      t("Isso irá restaurar as mensagens padrão, remover todas as personalizações e apagar os contatos de emergência cadastrados. Deseja continuar?"),
      [
        { text: t("Cancelar"), style: "cancel" },
        { text: t("Restaurar"), style: "destructive", onPress: resetToDefaults },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t("Configurações do Cartão"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Mensagens */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize(20) }]}>{t("Mensagens")}</Text>

          <Text style={[styles.itemDescription, { fontSize: fontSize(14) }]}>{t("Escolha quais mensagens aparecem no cartão. Edite os textos para representar o que você deseja comunicar.")}</Text>
          {messages.map((message) => localizeCrisisMessage(message, t)).map((message) => (
            <View key={message.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={[styles.itemTitle, { fontSize: fontSize(16) }]}>{message.title}</Text>
                <View style={styles.itemActions}>
                  <Pressable
                    onPress={() => handleEditMessage(message.id)}
                    style={styles.actionButton}
                    accessibilityRole="button"
                    accessibilityLabel={t("Editar mensagem {0}", message.title)}
                  >
                    <Text style={[styles.actionButtonText, { fontSize: fontSize(14) }]}>{t("Editar")}</Text>
                  </Pressable>
                  {!message.isDefault && (
                    <Pressable
                      onPress={() => handleDeleteMessage(message.id, message.title)}
                      style={styles.actionButton}
                      accessibilityRole="button"
                      accessibilityLabel={t("Excluir mensagem {0}", message.title)}
                    >
                      <Text style={[styles.actionButtonTextDelete, { fontSize: fontSize(14) }]}>{t("Excluir")}</Text>
                    </Pressable>
                  )}
                </View>
              </View>
              <Text style={[styles.itemDescription, { fontSize: fontSize(14) }]}>{message.content}</Text>
              <Pressable style={styles.actionButton} accessibilityRole="switch" accessibilityState={{ checked: !message.hidden }} accessibilityLabel={t("Mostrar mensagem {0} no cartão", message.title)} onPress={() => setMessageHidden(message.id, !message.hidden)}>
                <Text style={[styles.actionButtonText, { fontSize: fontSize(14) }]}>{message.hidden ? t("Oculta — mostrar no cartão") : t("Visível — ocultar do cartão")}</Text>
              </Pressable>
              {message.isDefault && (
                <Text style={[styles.itemHint, { fontSize: fontSize(12) }]}>{t("Mensagem padrão — pode ser editada ou ocultada.")}</Text>
              )}
            </View>
          ))}

          {/* Formulário de mensagem */}
          <View style={styles.form}>
            <Text style={[styles.formTitle, { fontSize: fontSize(16) }]}>
              {editingMessage ? t("Editar mensagem") : t("Nova mensagem")}
            </Text>

            {messageError && (
              <Text
                style={styles.formError}
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
              >
                {messageError}
              </Text>
            )}

            <TextInput
              style={[styles.input, { fontSize: fontSize(16) }]}
              placeholder={t("Título")}
              placeholderTextColor={colors.placeholder}
              value={messageTitle}
              onChangeText={(text) => {
                setMessageTitle(text);
                setMessageError(null);
              }}
              accessibilityLabel={t("Título da mensagem")}
            />

            <TextInput
              style={[styles.input, styles.textArea, { fontSize: fontSize(16) }]}
              placeholder={t("Conteúdo da mensagem")}
              placeholderTextColor={colors.placeholder}
              value={messageContent}
              onChangeText={(text) => {
                setMessageContent(text);
                setMessageError(null);
              }}
              multiline
              numberOfLines={4}
              accessibilityLabel={t("Conteúdo da mensagem")}
            />

            <View style={styles.formActions}>
              {editingMessage && (
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditingMessage(null);
                    setMessageTitle("");
                    setMessageContent("");
                    setMessageError(null);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={t("Cancelar edição da mensagem")}
                >
                  <Text style={[styles.cancelButtonText, { fontSize: fontSize(16) }]}>{t("Cancelar")}</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.saveButton}
                onPress={handleSaveMessage}
                accessibilityRole="button"
                accessibilityLabel={editingMessage ? t("Salvar alterações da mensagem") : t("Criar mensagem")}
              >
                <Text style={[styles.saveButtonText, { fontSize: fontSize(16) }]}>{t("Salvar")}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Contatos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize(20) }]}>{t("Contatos de Emergência")}</Text>

          {contacts.length === 0 ? (
            <Text style={[styles.emptyText, { fontSize: fontSize(14) }]}>{t("Nenhum contato cadastrado")}</Text>
          ) : (
            contacts.map((contact) => (
              <View key={contact.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemTitle, { fontSize: fontSize(16) }]}>{contact.name}</Text>
                  {primaryContactId === contact.id && (
                    <View style={styles.primaryBadge}>
                      <Text style={[styles.primaryBadgeText, { fontSize: fontSize(11) }]}>{t("Contato primário")}</Text>
                    </View>
                  )}
                  <View style={styles.itemActions}>
                    <Pressable
                      onPress={() =>
                        setPrimaryContact(primaryContactId === contact.id ? null : contact.id)
                      }
                      style={styles.actionButton}
                      accessibilityRole="button"
                      accessibilityLabel={
                        primaryContactId === contact.id
                          ? t("Desmarcar {0} como contato primário", contact.name)
                          : t("Definir {0} como contato primário", contact.name)
                      }
                    >
                      <Text
                        style={[
                          primaryContactId === contact.id
                            ? styles.actionButtonTextDelete
                            : styles.actionButtonText,
                          { fontSize: fontSize(14) },
                        ]}
                      >
                        {primaryContactId === contact.id ? t("Desmarcar") : t("Primário")}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleEditContact(contact.id)}
                      style={styles.actionButton}
                      accessibilityRole="button"
                      accessibilityLabel={t("Editar contato {0}", contact.name)}
                    >
                      <Text style={[styles.actionButtonText, { fontSize: fontSize(14) }]}>{t("Editar")}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleDeleteContact(contact.id, contact.name)}
                      style={styles.actionButton}
                      accessibilityRole="button"
                      accessibilityLabel={t("Excluir contato {0}", contact.name)}
                    >
                      <Text style={[styles.actionButtonTextDelete, { fontSize: fontSize(14) }]}>{t("Excluir")}</Text>
                    </Pressable>
                  </View>
                </View>
                <Text style={[styles.itemDescription, { fontSize: fontSize(14) }]}>
                  {contact.phone}
                  {contact.relationship ? ` • ${contact.relationship}` : ""}
                </Text>
                <Text style={[styles.itemHint, { fontSize: fontSize(12) }]}>
                  {primaryContactId === contact.id
                    ? t("O cartão de crise usa este contato para ligar e enviar mensagem.")
                    : t("Toque em 'Primário' para usar este contato no cartão de crise.")}
                </Text>
              </View>
            ))
          )}

          {/* Formulário de contato */}
          <View style={styles.form}>
            <Text style={[styles.formTitle, { fontSize: fontSize(16) }]}>
              {editingContact ? t("Editar contato") : t("Novo contato")}
            </Text>

            {contactError && (
              <Text
                style={styles.formError}
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
              >
                {contactError}
              </Text>
            )}

            <TextInput
              style={[styles.input, { fontSize: fontSize(16) }]}
              placeholder={t("Nome")}
              placeholderTextColor={colors.placeholder}
              value={contactName}
              onChangeText={(text) => {
                setContactName(text);
                setContactError(null);
              }}
              accessibilityLabel={t("Nome do contato")}
            />

            <TextInput
              style={[styles.input, { fontSize: fontSize(16) }]}
              placeholder={t("Telefone")}
              placeholderTextColor={colors.placeholder}
              value={contactPhone}
              onChangeText={(text) => {
                setContactPhone(text);
                setContactError(null);
              }}
              keyboardType="phone-pad"
              accessibilityLabel={t("Telefone do contato")}
            />

            <TextInput
              style={[styles.input, { fontSize: fontSize(16) }]}
              placeholder={t("Parentesco (opcional)")}
              placeholderTextColor={colors.placeholder}
              value={contactRelationship}
              onChangeText={setContactRelationship}
              accessibilityLabel={t("Relação com o contato (opcional)")}
            />

            <View style={styles.formActions}>
              {editingContact && (
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditingContact(null);
                    setContactName("");
                    setContactPhone("");
                    setContactRelationship("");
                    setContactError(null);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={t("Cancelar edição do contato")}
                >
                  <Text style={[styles.cancelButtonText, { fontSize: fontSize(16) }]}>{t("Cancelar")}</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.saveButton}
                onPress={handleSaveContact}
                accessibilityRole="button"
                accessibilityLabel={editingContact ? t("Salvar alterações do contato") : t("Criar contato")}
              >
                <Text style={[styles.saveButtonText, { fontSize: fontSize(16) }]}>{t("Salvar")}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Reset */}
        <Pressable
          style={styles.resetButton}
          onPress={handleReset}
          accessibilityRole="button"
          accessibilityLabel={t("Restaurar padrões do cartão de crise")}
          accessibilityHint={t("Remove todas as personalizações e volta às mensagens padrão")}
        >
          <Text style={[styles.resetButtonText, { fontSize: fontSize(16) }]}>{t("Restaurar padrões")}</Text>
        </Pressable>
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
      gap: 32,
      paddingBottom: 80, // Espaço para o EmergencyFab
    },
    section: {
      gap: 16,
    },
    sectionTitle: {
      color: colors.text,
      fontWeight: "600",
    },
    itemCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    itemHeader: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: {
      color: colors.text,
      fontWeight: "600",
      flexShrink: 1,
    },
    itemActions: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    actionButton: {
      paddingVertical: 4,
      paddingHorizontal: 4,
    },
    actionButtonText: {
      color: colors.accent,
    },
    actionButtonTextDelete: {
      color: colors.warm,
    },
    itemDescription: {
      color: colors.textSecondary,
      lineHeight: 20,
    },
    itemHint: {
      color: colors.textMuted,
      lineHeight: 16,
    },
    primaryBadge: {
      alignSelf: "flex-start",
      backgroundColor: colors.warmSurface,
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.warm,
    },
    primaryBadgeText: {
      color: colors.warm,
      fontWeight: "600",
    },
    emptyText: {
      color: colors.textMuted,
      textAlign: "center",
      padding: 16,
    },
    form: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    formTitle: {
      color: colors.text,
      fontWeight: "600",
    },
    formError: {
      color: colors.warm,
      lineHeight: 18,
    },
    input: {
      backgroundColor: colors.input,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: "top",
    },
    formActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
    },
    cancelButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    cancelButtonText: {
      color: colors.textMuted,
    },
    saveButton: {
      backgroundColor: colors.accent,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    saveButtonText: {
      color: colors.accentText,
      fontWeight: "600",
    },
    resetButton: {
      backgroundColor: "transparent",
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.warm,
    },
    resetButtonText: {
      color: colors.warm,
    },
  });