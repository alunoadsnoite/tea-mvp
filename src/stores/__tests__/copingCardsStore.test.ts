import { useCopingCardsStore } from "@/stores/copingCardsStore";
import { DEFAULT_COPING_CARDS } from "@/types/coping";

describe("copingCardsStore", () => {
  beforeEach(() => {
    // Estado limpo sem favoritos: resetToDefaults preserva favoritos por
    // design, então o reset do store não zeraria os likes de testes anteriores.
    useCopingCardsStore.setState({
      cards: DEFAULT_COPING_CARDS.map((c) => ({ ...c, isFavorite: false })),
    });
  });

  it("padrões não podem ser excluídos", () => {
    const defaultId = DEFAULT_COPING_CARDS[0].id;
    useCopingCardsStore.getState().deleteCard(defaultId);
    expect(
      useCopingCardsStore.getState().cards.find((c) => c.id === defaultId)
    ).toBeDefined();
  });

  it("toggleFavorite alterna o favorito do cartão", () => {
    const id = DEFAULT_COPING_CARDS[0].id;
    const before = useCopingCardsStore.getState().cards[0].isFavorite;

    useCopingCardsStore.getState().toggleFavorite(id);
    expect(
      useCopingCardsStore.getState().cards.find((c) => c.id === id)?.isFavorite
    ).toBe(!before);
  });

  it("resetToDefaults remove personalizados e preserva favoritos", () => {
    useCopingCardsStore.getState().addCard({
      title: "Meu cartão",
      description: "Descrição",
      category: "custom",
      steps: ["Passo 1"],
      isFavorite: false,
    });
    const favoriteId = DEFAULT_COPING_CARDS[1].id;
    useCopingCardsStore.getState().toggleFavorite(favoriteId);

    useCopingCardsStore.getState().resetToDefaults();

    const state = useCopingCardsStore.getState();
    expect(state.cards).toHaveLength(DEFAULT_COPING_CARDS.length);
    expect(state.cards.find((c) => c.title === "Meu cartão")).toBeUndefined();
    expect(
      state.cards.find((c) => c.id === favoriteId)?.isFavorite
    ).toBe(true);
    // Os demais não herdam o favorito
    expect(
      state.cards.find((c) => c.id === DEFAULT_COPING_CARDS[0].id)?.isFavorite
    ).toBe(false);
  });
});
