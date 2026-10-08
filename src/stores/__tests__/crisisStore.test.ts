import { useCrisisStore } from "@/stores/crisisStore";

describe("crisisStore", () => {
  beforeEach(() => {
    useCrisisStore.getState().resetToDefaults();
  });

  it("começa com as duas mensagens padrão", () => {
    const { messages, activeMessageId } = useCrisisStore.getState();
    expect(messages).toHaveLength(2);
    expect(messages.every((m) => m.isDefault)).toBe(true);
    expect(activeMessageId).toBe(messages[0].id);
  });

  it("mensagens padrão não podem ser excluídas", () => {
    const defaultId = useCrisisStore.getState().messages[0].id;
    useCrisisStore.getState().deleteMessage(defaultId);
    expect(
      useCrisisStore.getState().messages.find((m) => m.id === defaultId)
    ).toBeDefined();
  });

  it("excluir a mensagem ativa promove outra para ativa", () => {
    useCrisisStore.getState().addMessage({
      title: "Personalizada",
      content: "Conteúdo",
    });
    const custom = useCrisisStore
      .getState()
      .messages.find((m) => m.title === "Personalizada");
    useCrisisStore.getState().setActiveMessage(custom!.id);
    expect(useCrisisStore.getState().activeMessageId).toBe(custom!.id);

    useCrisisStore.getState().deleteMessage(custom!.id);
    const state = useCrisisStore.getState();
    expect(state.messages.find((m) => m.id === custom!.id)).toBeUndefined();
    expect(state.messages.some((m) => m.id === state.activeMessageId)).toBe(
      true
    );
  });

  it("primeiro contato adicionado vira o primário", () => {
    useCrisisStore.getState().addContact({
      name: "Ana",
      phone: "11999999999",
      relationship: "Mãe",
    });
    const first = useCrisisStore.getState().contacts[0];
    expect(useCrisisStore.getState().primaryContactId).toBe(first.id);

    useCrisisStore.getState().addContact({
      name: "Bia",
      phone: "11888888888",
      relationship: "Irmã",
    });
    // O primário não muda com o segundo contato
    expect(useCrisisStore.getState().primaryContactId).toBe(first.id);
  });

  it("excluir o contato primário promove o próximo", () => {
    useCrisisStore.getState().addContact({
      name: "Ana",
      phone: "11999999999",
      relationship: "Mãe",
    });
    useCrisisStore.getState().addContact({
      name: "Bia",
      phone: "11888888888",
      relationship: "Irmã",
    });
    const [first, second] = useCrisisStore.getState().contacts;

    useCrisisStore.getState().deleteContact(first.id);
    expect(useCrisisStore.getState().primaryContactId).toBe(second.id);

    useCrisisStore.getState().deleteContact(second.id);
    expect(useCrisisStore.getState().primaryContactId).toBeNull();
    expect(useCrisisStore.getState().contacts).toHaveLength(0);
  });

  it("resetToDefaults restaura mensagens e apaga contatos", () => {
    useCrisisStore.getState().addMessage({ title: "Extra", content: "..." });
    useCrisisStore.getState().addContact({
      name: "Ana",
      phone: "11999999999",
      relationship: "Mãe",
    });

    useCrisisStore.getState().resetToDefaults();

    const state = useCrisisStore.getState();
    expect(state.messages).toHaveLength(2);
    expect(state.messages.every((m) => m.isDefault)).toBe(true);
    expect(state.contacts).toHaveLength(0);
    expect(state.primaryContactId).toBeNull();
    expect(state.activeMessageId).toBe(state.messages[0].id);
  });
});
