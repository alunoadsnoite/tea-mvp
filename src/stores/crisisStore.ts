import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CrisisCardState, CrisisMessage, EmergencyContact } from "@/types/crisis";
import { DEFAULT_MESSAGES } from "@/types/crisis";
import { createId } from "@/lib/id";

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
  setPrimaryContact: (id: string | null) => void;

  // Utilitários
  resetToDefaults: () => void;
}

function defaultMessages(): CrisisMessage[] {
  // Cópia defensiva: nunca compartilha os objetos do módulo entre resets.
  return DEFAULT_MESSAGES.map((message) => ({ ...message }));
}

export const useCrisisStore = create<CrisisStore>()(
  persist(
    (set, get) => ({
      // Estado inicial com mensagens padrão
      messages: defaultMessages(),
      contacts: [],
      activeMessageId: DEFAULT_MESSAGES[0]?.id ?? null,
      isLoading: false,
      primaryContactId: null,

      // === MENSAGENS ===
      addMessage: (message) => {
        const newMessage: CrisisMessage = {
          ...message,
          id: createId("msg"),
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
        const message = get().messages.find((m) => m.id === id);
        // Não permite excluir mensagens padrão
        if (message?.isDefault) return;

        set((state) => {
          const remaining = state.messages.filter((msg) => msg.id !== id);
          // Mantém a mensagem ativa apenas se ela ainda existir na lista.
          const activeStillExists = remaining.some(
            (msg) => msg.id === state.activeMessageId
          );

          return {
            messages: remaining,
            activeMessageId: activeStillExists
              ? state.activeMessageId
              : remaining[0]?.id ?? null,
          };
        });
      },

      setActiveMessage: (id) => {
        set({ activeMessageId: id });
      },

      // === CONTATOS ===
      addContact: (contact) => {
        const newContact: EmergencyContact = {
          ...contact,
          id: createId("contact"),
        };
        set((state) => ({
          contacts: [...state.contacts, newContact],
          // Se for o primeiro contato, torna-o primário automaticamente
          primaryContactId:
            state.primaryContactId ?? newContact.id,
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
        set((state) => {
          const contacts = state.contacts.filter((c) => c.id !== id);
          // Se o contato excluído era o primário, promove o primeiro restante
          // em vez de deixar a referência pendurada (nulo).
          let primaryContactId = state.primaryContactId;
          if (primaryContactId === id || !contacts.some((c) => c.id === primaryContactId)) {
            primaryContactId = contacts[0]?.id ?? null;
          }

          return { contacts, primaryContactId };
        });
      },

      setPrimaryContact: (id) => {
        set({ primaryContactId: id });
      },

      // === UTILITÁRIOS ===
      resetToDefaults: () => {
        set({
          messages: defaultMessages(),
          contacts: [],
          activeMessageId: DEFAULT_MESSAGES[0]?.id ?? null,
          primaryContactId: null,
        });
      },
    }),
    {
      name: "crisis-card-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persisted) => {
        const state = (persisted ?? {}) as Partial<CrisisStore>;
        const messages = Array.isArray(state.messages)
          ? state.messages
          : defaultMessages();

        // v1 -> v2: garante `primaryContactId` e uma mensagem ativa válida.
        const contacts = Array.isArray(state.contacts) ? state.contacts : [];
        const primaryContactId =
          state.primaryContactId && contacts.some((c) => c.id === state.primaryContactId)
            ? state.primaryContactId
            : contacts[0]?.id ?? null;

        const activeMessageId =
          state.activeMessageId && messages.some((m) => m.id === state.activeMessageId)
            ? state.activeMessageId
            : messages[0]?.id ?? null;

        return {
          messages,
          contacts,
          activeMessageId,
          primaryContactId,
          isLoading: false,
        };
      },
    }
  )
);