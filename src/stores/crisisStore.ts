import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CrisisCardState, CrisisMessage, EmergencyContact } from "@/types/crisis";
import { DEFAULT_MESSAGES } from "@/types/crisis";

/**
 * Store Zustand — Gerenciamento do Cartão de Crise
 * 
 * Offline-First: Todos os dados persistidos localmente via AsyncStorage.
 * Funciona sem conexão com internet.
 */
interface CrisisStore extends CrisisCardState {
  // Ações para mensagens
  addMessage: (message: Omit<CrisisMessage, "id" | "isDefault">) => void;
  updateMessage: (id: string, updates: Partial<CrisisMessage>) => void;
  deleteMessage: (id: string) => void;
  setActiveMessage: (id: string) => void;

  // Ações para contatos
  addContact: (contact: Omit<EmergencyContact, "id">) => void;
  updateContact: (id: string, updates: Partial<EmergencyContact>) => void;
  deleteContact: (id: string) => void;

  // Utilitários
  resetToDefaults: () => void;
}

export const useCrisisStore = create<CrisisStore>()(
  persist(
    (set, get) => ({
      // Estado inicial com mensagens padrão
      messages: DEFAULT_MESSAGES,
      contacts: [],
      activeMessageId: DEFAULT_MESSAGES[0]?.id ?? null,
      isLoading: false,

      // === MENSAGENS ===
      addMessage: (message) => {
        const newMessage: CrisisMessage = {
          ...message,
          id: `msg-${Date.now()}`,
          isDefault: false,
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },

      updateMessage: (id, updates) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        }));
      },

      deleteMessage: (id) => {
        const state = get();
        const message = state.messages.find((m) => m.id === id);
        // Não permite excluir mensagens padrão
        if (message?.isDefault) return;

        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== id),
          // Se a mensagem ativa foi excluída, ativa a primeira disponível
          activeMessageId:
            state.activeMessageId === id
              ? state.messages[0]?.id ?? null
              : state.activeMessageId,
        }));
      },

      setActiveMessage: (id) => {
        set({ activeMessageId: id });
      },

      // === CONTATOS ===
      addContact: (contact) => {
        const newContact: EmergencyContact = {
          ...contact,
          id: `contact-${Date.now()}`,
        };
        set((state) => ({
          contacts: [...state.contacts, newContact],
        }));
      },

      updateContact: (id, updates) => {
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        }));
      },

      // === UTILITÁRIOS ===
      resetToDefaults: () => {
        set({
          messages: DEFAULT_MESSAGES,
          contacts: [],
          activeMessageId: DEFAULT_MESSAGES[0]?.id ?? null,
        });
      },
    }),
    {
      name: "crisis-card-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
