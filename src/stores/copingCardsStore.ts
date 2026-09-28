import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CopingCard, DEFAULT_COPING_CARDS } from "@/types/coping";

/**
 * Store Zustand — Central de Cartões de Regulação
 * 
 * Gerencia cartões de coping padrão e personalizados com persistência local.
 */
interface CopingCardsStore {
  cards: CopingCard[];
  
  // Ações para cartões personalizados
  addCard: (card: Omit<CopingCard, "id" | "createdAt" | "isDefault">) => void;
  updateCard: (id: string, updates: Partial<CopingCard>) => void;
  deleteCard: (id: string) => void;
  
  // Favoritos
  toggleFavorite: (id: string) => void;
  
  // Utilitários
  getCardsByCategory: (category: string) => CopingCard[];
  getFavoriteCards: () => CopingCard[];
  getCardById: (id: string) => CopingCard | undefined;
  resetToDefaults: () => void;
}

export const useCopingCardsStore = create<CopingCardsStore>()(
  persist(
    (set, get) => ({
      cards: DEFAULT_COPING_CARDS,

      // === CARTÕES ===
      addCard: (card) => {
        const newCard: CopingCard = {
          ...card,
          id: `card-${Date.now()}`,
          isDefault: false,
          createdAt: Date.now(),
        };
        set((state) => ({
          cards: [...state.cards, newCard],
        }));
      },

      updateCard: (id, updates) => {
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCard: (id) => {
        const state = get();
        const card = state.cards.find((c) => c.id === id);
        // Não permite excluir cartões padrão
        if (card?.isDefault) return;

        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        }));
      },

      // === FAVORITOS ===
      toggleFavorite: (id) => {
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
          ),
        }));
      },

      // === UTILITÁRIOS ===
      getCardsByCategory: (category) => {
        return get().cards.filter((c) => c.category === category);
      },

      getFavoriteCards: () => {
        return get().cards.filter((c) => c.isFavorite);
      },

      getCardById: (id) => {
        return get().cards.find((c) => c.id === id);
      },

      resetToDefaults: () => {
        set({ cards: DEFAULT_COPING_CARDS.map(c => ({ ...c, createdAt: 0 })) });
      },
    }),
    {
      name: "coping-cards-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
