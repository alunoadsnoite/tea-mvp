import React, { useState } from "react";
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

/**
 * CrisisSettingsScreen — Configurações do Cartão de Crise
 * 
 * Permite editar mensagens e gerenciar contatos de emergência.
 */
export default function CrisisSettingsScreen() {
  const {
    messages,
    contacts,
    addMessage,
    updateMessage,
    deleteMessage,
    addContact,
    updateContact,
    deleteContact,
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

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Configurações do Cartão",
          headerStyle: { backgroundColor: "#1A1D23" },
          headerTintColor: "#E8E6E3",
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Mensagens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mensagens</Text>
          
          {messages.map((message) => (
            <View key={message.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{message.title}</Text>
                <View style={styles.itemActions}>
                  <Pressable
                    onPress={() => handleEditMessage(message.id)}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionButtonText}>Editar</Text>
                  </Pressable>
                  {!message.isDefault && (
                    <Pressable
                      onPress={() => deleteMessage(message.id)}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionButtonTextDelete}>Excluir</Text>
                    </Pressable>
                  )}
                </View>
              </View>
              <Text style={styles.itemDescription}>{message.content}</Text>
            </View>
          ))}

          {/* Formulário de mensagem */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>
              {editingMessage ? "Editar mensagem" : "Nova mensagem"}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor="#8A8782"
              value={messageTitle}
              onChangeText={setMessageTitle}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
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
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.saveButton}
                onPress={handleSaveMessage}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Contatos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contatos de Emergência</Text>
          
          {contacts.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum contato cadastrado</Text>
          ) : (
            contacts.map((contact) => (
              <View key={contact.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{contact.name}</Text>
                  <View style={styles.itemActions}>
                    <Pressable
                      onPress={() => handleEditContact(contact.id)}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionButtonText}>Editar</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteContact(contact.id)}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionButtonTextDelete}>Excluir</Text>
                    </Pressable>
                  </View>
                </View>
                <Text style={styles.itemDescription}>
                  {contact.phone} {contact.relationship && `• ${contact.relationship}`}
                </Text>
              </View>
            ))
          )}

          {/* Formulário de contato */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>
              {editingContact ? "Editar contato" : "Novo contato"}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#8A8782"
              value={contactName}
              onChangeText={setContactName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              placeholderTextColor="#8A8782"
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={styles.input}
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
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.saveButton}
                onPress={handleSaveContact}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Reset */}
        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Restaurar padrões</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1D23",
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
    fontSize: 20,
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
    fontSize: 16,
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
    fontSize: 14,
  },
  actionButtonTextDelete: {
    color: "#C4A882",
    fontSize: 14,
  },
  itemDescription: {
    color: "#B8B5B0",
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    color: "#8A8782",
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1A1D23",
    borderRadius: 8,
    padding: 12,
    color: "#E8E6E3",
    fontSize: 16,
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
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#7B9EA8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#1A1D23",
    fontSize: 16,
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
    fontSize: 16,
  },
});
