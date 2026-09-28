import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useCrisisStore } from "@/stores/crisisStore";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";

/**
 * CrisisSettingsScreen — Configurações do Cartão de Crise
 *
 * Permite editar mensagens, gerenciar contatos de emergência e definir
 * o contato primário usado pelo cartão de crise.
 */
export default function CrisisSettingsScreen() {
  const { fontSize } = useFontScale();
  const { colors } = useThemeMode();
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
        title: messageTitle,
        content: messageContent,
      });
    } else {
      addMessage({
        title: messageTitle,
        content: messageContent,
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

  // Salvar contato
  const handleSaveContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) return;

    if (editingContact) {
      updateContact(editingContact, {
        name: contactName,
        phone: contactPhone,
        relationship: contactRelationship,
      });
    } else {
      addContact({
        name: contactName,
        phone: contactPhone,
        relationship: contactRelationship,
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

  // Contato do desenvolvedor
  const handleContactDeveloper = () => {
    Linking.openURL("mailto:valdenorsa@proton.me?subject=TEA%20Autonomia%20-%20Feedback");
  };

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
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
                  >
                    <Text style={[styles.actionButtonText, { fontSize: fontSize(14) }]}>Editar</Text>
                  </Pressable>
                  {!message.isDefault && (
                    <Pressable
                      onPress={() => deleteMessage(message.id)}
                      style={styles.actionButton}
                    >
                      <Text style={[styles.actionButtonTextDelete, { fontSize: fontSize(14) }]}>Excluir</Text>
                    </Pressable>
                  )}
                </View>
              </View>
              <Text style={[styles.itemDescription, { fontSize: fontSize(14) }]}>{message.content}</Text>
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
              placeholderTextColor="#8A8782"
              value={messageTitle}
              onChangeText={setMessageTitle}
            />

            <TextInput
              style={[styles.input, styles.textArea, { fontSize: fontSize(16) }]}
              placeholder="Conteúdo da mensagem"
              placeholderTextColor="#8A8782"
              value={messageContent}
              onChangeText={setMessageContent}
              multiline
              numberOfLines={4}
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
                >
                  <Text style={[styles.cancelButtonText, { fontSize: fontSize(16) }]}>Cancelar</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.saveButton}
                onPress={handleSaveMessage}
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
                      onPress={() => setPrimaryContact(contact.id)}
                      style={styles.actionButton}
                    >
                      <Text style={[
                        primaryContactId === contact.id ? styles.actionButtonTextDelete : styles.actionButtonText,
                        { fontSize: fontSize(14) }
                      ]}>
                        {primaryContactId === contact.id ? "Desmarcar" : "Primário"}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleEditContact(contact.id)}
                      style={styles.actionButton}
                    >
                      <Text style={[styles.actionButtonText, { fontSize: fontSize(14) }]}>Editar</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteContact(contact.id)}
                      style={styles.actionButton}
                    >
                      <Text style={[styles.actionButtonTextDelete, { fontSize: fontSize(14) }]}>Excluir</Text>
                    </Pressable>
                  </View>
                </View>
                <Text style={[styles.itemDescription, { fontSize: fontSize(14) }]}>
                  {contact.phone} {contact.relationship && ` • ${contact.relationship}`}
                </Text>
                <Text style={[styles.itemHint, { fontSize: fontSize(12) }]}>
                  {primaryContactId === contact.id
                    ? "Toque em 'Desmarcar' para remover o contato primário, ou escolha outro contato."
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
              placeholderTextColor="#8A8782"
              value={contactName}
              onChangeText={setContactName}
            />

            <TextInput
              style={[styles.input, { fontSize: fontSize(16) }]}
              placeholder="Telefone"
              placeholderTextColor="#8A8782"
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
            />

            <TextInput
              style={[styles.input, { fontSize: fontSize(16) }]}
              placeholder="Parentesco (opcional)"
              placeholderTextColor="#8A8782"
              value={contactRelationship}
              onChangeText={setContactRelationship}
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
                >
                  <Text style={[styles.cancelButtonText, { fontSize: fontSize(16) }]}>Cancelar</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.saveButton}
                onPress={handleSaveContact}
              >
                <Text style={[styles.saveButtonText, { fontSize: fontSize(16) }]}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Reset */}
        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={[styles.resetButtonText, { fontSize: fontSize(16) }]}>Restaurar padrões</Text>
        </Pressable>

        {/* Desenvolvedor */}
        <View style={styles.developerSection}>
          <Text style={[styles.developerTitle, { fontSize: fontSize(14) }]}>Desenvolvedor</Text>
          <Text style={[styles.developerName, { fontSize: fontSize(14) }]}>Valdenor Tavares</Text>
          <Text style={[styles.developerEmail, { fontSize: fontSize(13) }]}>valdenorsa@proton.me</Text>
          <Pressable style={styles.contactButton} onPress={handleContactDeveloper}>
            <Text style={[styles.contactButtonText, { fontSize: fontSize(14) }]}>Enviar e-mail</Text>
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
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    color: "#E8E6E3",
    fontWeight: "600",
  },
  itemCard: {
    backgroundColor: "#22262E",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3A3F47",
    gap: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTitle: {
    color: "#E8E6E3",
    fontWeight: "600",
    flex: 1,
  },
  itemActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  actionButtonText: {
    color: "#7B9EA8",
  },
  actionButtonTextDelete: {
    color: "#C4A882",
  },
  itemDescription: {
    color: "#B8B5B0",
    lineHeight: 20,
  },
  itemHint: {
    color: "#8A8782",
    lineHeight: 16,
    marginTop: 4,
  },
  primaryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(196, 168, 130, 0.2)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#C4A882",
    marginRight: 8,
  },
  primaryBadgeText: {
    color: "#C4A882",
    fontWeight: "600",
  },
  emptyText: {
    color: "#8A8782",
    textAlign: "center",
    padding: 16,
  },
  form: {
    backgroundColor: "#22262E",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3A3F47",
    gap: 12,
  },
  formTitle: {
    color: "#E8E6E3",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1A1D23",
    borderRadius: 8,
    padding: 12,
    color: "#E8E6E3",
    borderWidth: 1,
    borderColor: "#3A3F47",
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
    color: "#8A8782",
  },
  saveButton: {
    backgroundColor: "#7B9EA8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#1A1D23",
    fontWeight: "600",
  },
  resetButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C4A882",
  },
  resetButtonText: {
    color: "#C4A882",
  },
  developerSection: {
    backgroundColor: "#22262E",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#3A3F47",
    alignItems: "center",
    gap: 8,
  },
  developerTitle: {
    color: "#8A8782",
    fontWeight: "600",
  },
  developerName: {
    color: "#E8E6E3",
    fontWeight: "600",
  },
  developerEmail: {
    color: "#7B9EA8",
  },
  contactButton: {
    backgroundColor: "#7B9EA8",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  contactButtonText: {
    color: "#1A1D23",
    fontWeight: "600",
  },
});
