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
  const { fontSize } = useFontScale();
  const { colors } = useThemeMode();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    messages,
    contacts,
    primaryContactId,
    addMessage,
    updateMessage,
    deleteMessage,
    addContact,
    updateContact,
    deleteContact,
    setPrimaryContact,
    resetToDefaults,
  } = useCrisisStore();

  // Estados para formulários
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactRelationship, setContactRelationship] = useState("");

  // Salvar mensagem
  const handleSaveMessage = () => {
    if (!messageTitle.trim() || !messageContent.trim()) return;

    if (editingMessage) {
      updateMessage(editingMessage, {
        title: messageTitle.trim(),
        content: messageContent.trim(),
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

    setEditingMessage(id);
    setMessageTitle(message.title);
    setMessageContent(message.content);
  };

  const handleDeleteMessage = (id: string, title: string) => {
    Alert.alert(
      "Excluir mensagem",
      `A mensagem "${title}" será removida do cartão de crise. Deseja continuar?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => deleteMessage(id) },
      ]
    );
  };

  // Salvar contato
  const handleSaveContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) return;

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
  };

  const handleDeleteContact = (id: string, name: string) => {
    Alert.alert(
      "Excluir contato",
      `O contato "${name}" será removido do cartão de crise. Deseja continuar?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => deleteContact(id) },
      ]
    );
  };

  // Resetar padrões
  const handleReset = () => {
    Alert.alert(
      "Restaurar padrões",
      "Isso irá restaurar as mensagens padrão e remover todas as personalizações. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Restaurar", style: "destructive", onPress: resetToDefaults },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Configurações do Cartão",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Mensagens */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize(20) }]}>Mensagens</Text>

          {messages.map((message) => (
            <View key={message.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={[styles.itemTitle, { fontSize: fontSize(16) }]}>{message.title}</Text>
                <View style={styles.itemActions}>
                  <Pressable
                    onPress={() => handleEditMessage(message.id)}
                    style={styles.actionButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Editar mensagem ${message.title}`}
                  >
                    <Text style={[styles.actionButtonText, { fontSize: fontSize(14) }]}>Editar</Text>
                  </Pressable>
                  {!message.isDefault && (
                    <Pressable
                      onPress={() => handleDeleteMessage(message.id, message.title)}
                      style={styles.actionButton}
                      accessibilityRole="button"
                      accessibilityLabel={`Excluir mensagem ${message.title}`}
                    >
                      <Text style={[styles.actionButtonTextDelete, { fontSize: fontSize(14) }]}>Excluir</Text>
                    </Pressable>
                  )}
                </View>
              </View>
              <Text style={[styles.itemDescription, { fontSize: fontSize(14) }]}>{message.content}</Text>
              {message.isDefault && (
                <Text style={[styles.itemHint, { fontSize: fontSize(12) }]}>
                  Mensagem padrão — pode ser editada, mas não excluída.
                </Text>
              )}
            </View>
          ))}

          {/* Formulário de mensagem */}
          <View style={styles.form}>
            <Text style={[styles.formTitle, { fontSize: fontSize(16) }]}>
              {editingMessage ? "Editar mensagem" : "Nova mensagem"}
            </Text>

            <TextInput
              style={[styles.input, { fontSize: fontSize(16) }]}
              placeholder="Título"
              placeholderTextColor={colors.placeholder}
              value={messageTitle}
              onChangeText={setMessageTitle}
              accessibilityLabel="Título da mensagem"
            />

            <TextInput
              style={[styles.input, styles.textArea, { fontSize: fontSize(16) }]}
              placeholder="Conteúdo da mensagem"
              placeholderTextColor={colors.placeholder}
              value={messageContent}
              onChangeText={setMessageContent}
              multiline
              numberOfLines={4}
              accessibilityLabel="Conteúdo da mensagem"
            />

            <View style={styles.formActions}>
              {editingMessage && (
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditingMessage(null);
                    setMessageTitle("");
                    setMessageContent("");
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar edição da mensagem"
                >
                  <Text style={[styles.cancelButtonText, { fontSize: fontSize(16) }]}>Cancelar</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.saveButton}
                onPress={handleSaveMessage}
                accessibilityRole="button"
                accessibilityLabel={editingMessage ? "Salvar alterações da mensagem" : "Criar mensagem"}
              >
                <Text style={[styles.saveButtonText, { fontSize: fontSize(16) }]}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Contatos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize(20) }]}>Contatos de Emergência</Text>

          {contacts.length === 0 ? (
            <Text style={[styles.emptyText, { fontSize: fontSize(14) }]}>Nenhum contato cadastrado</Text>
          ) : (
            contacts.map((contact) => (
              <View key={contact.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemTitle, { fontSize: fontSize(16) }]}>{contact.name}</Text>
                  {primaryContactId === contact.id && (
                    <View style={styles.primaryBadge}>
                      <Text style={[styles.primaryBadgeText, { fontSize: fontSize(11) }]}>Contato primário</Text>
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
                          ? `Desmarcar ${contact.name} como contato primário`
                          : `Definir ${contact.name} como contato primário`
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
                        {primaryContactId === contact.id ? "Desmarcar" : "Primário"}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleEditContact(contact.id)}
                      style={styles.actionButton}
                      accessibilityRole="button"
                      accessibilityLabel={`Editar contato ${contact.name}`}
                    >
                      <Text style={[styles.actionButtonText, { fontSize: fontSize(14) }]}>Editar</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleDeleteContact(contact.id, contact.name)}
                      style={styles.actionButton}
                      accessibilityRole="button"
                      accessibilityLabel={`Excluir contato ${contact.name}`}
                    >
                      <Text style={[styles.actionButtonTextDelete, { fontSize: fontSize(14) }]}>Excluir</Text>
                    </Pressable>
                  </View>
                </View>
                <Text style={[styles.itemDescription, { fontSize: fontSize(14) }]}>
                  {contact.phone}
                  {contact.relationship ? ` • ${contact.relationship}` : ""}
                </Text>
                <Text style={[styles.itemHint, { fontSize: fontSize(12) }]}>
                  {primaryContactId === contact.id
                    ? "O cartão de crise usa este contato para ligar e enviar mensagem."
                    : "Toque em 'Primário' para usar este contato no cartão de crise."}
                </Text>
              </View>
            ))
          )}

          {/* Formulário de contato */}
          <View style={styles.form}>
            <Text style={[styles.formTitle, { fontSize: fontSize(16) }]}>
              {editingContact ? "Editar contato" : "Novo contato"}
            </Text>

            <TextInput
              style={[styles.input, { fontSize: fontSize(16) }]}
              placeholder="Nome"
              placeholderTextColor={colors.placeholder}
              value={contactName}
              onChangeText={setContactName}
              accessibilityLabel="Nome do contato"
            />

            <TextInput
              style={[styles.input, { fontSize: fontSize(16) }]}
              placeholder="Telefone"
              placeholderTextColor={colors.placeholder}
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
              accessibilityLabel="Telefone do contato"
            />

            <TextInput
              style={[styles.input, { fontSize: fontSize(16) }]}
              placeholder="Parentesco (opcional)"
              placeholderTextColor={colors.placeholder}
              value={contactRelationship}
              onChangeText={setContactRelationship}
              accessibilityLabel="Relação com o contato (opcional)"
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
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar edição do contato"
                >
                  <Text style={[styles.cancelButtonText, { fontSize: fontSize(16) }]}>Cancelar</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.saveButton}
                onPress={handleSaveContact}
                accessibilityRole="button"
                accessibilityLabel={editingContact ? "Salvar alterações do contato" : "Criar contato"}
              >
                <Text style={[styles.saveButtonText, { fontSize: fontSize(16) }]}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Reset */}
        <Pressable
          style={styles.resetButton}
          onPress={handleReset}
          accessibilityRole="button"
          accessibilityLabel="Restaurar padrões do cartão de crise"
          accessibilityHint="Remove todas as personalizações e volta às mensagens padrão"
        >
          <Text style={[styles.resetButtonText, { fontSize: fontSize(16) }]}>Restaurar padrões</Text>
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
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: 8,
    },
    itemTitle: {
      color: colors.text,
      fontWeight: "600",
      flexShrink: 1,
    },
    itemActions: {
      flexDirection: "row",
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