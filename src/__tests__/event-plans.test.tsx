import React from "react";
import { Pressable, Text, TextInput } from "react-native";
import renderer, { act } from "react-test-renderer";
import EventPlans from "@/app/event-plans";
import { useEventPlanStore } from "@/stores/eventPlanStore";

jest.mock("@/lib/edition", () => ({ isProEdition: true }));
jest.mock("expo-router", () => ({ Stack: { Screen: () => null } }));
jest.mock("@/stores/eventPlanStore", () => ({
  ...jest.requireActual("@/stores/eventPlanStore"), loadEventPlans: () => Promise.resolve(),
}));

it("creates an editable everyday plan and resumes its next unfinished step", async () => {
  useEventPlanStore.setState({ plans: [] });
  let screen!: renderer.ReactTestRenderer;
  await act(async () => { screen = renderer.create(<EventPlans />); });
  const press = (label: string) => act(() => {
    const button = screen.root.findAllByType(Pressable).find((node) =>
      node.findAllByType(Text).some((text) => text.props.children === label));
    expect(button).toBeDefined();
    button!.props.onPress();
  });
  press("Ir ao mercado");
  const title = screen.root.findAllByType(TextInput).find((node) => node.props.accessibilityLabel === "Nome do evento")!;
  act(() => title.props.onChangeText("Minhas compras"));
  press("Salvar plano");
  press("Me ajude a começar");
  expect(JSON.stringify(screen.toJSON())).toContain("Preparar a lista de compras");
  expect(JSON.stringify(screen.toJSON())).not.toContain("Escolher um horário confortável");
  press("Concluir este passo");
  expect(useEventPlanStore.getState().plans[0].preparation[0].done).toBe(true);
  press("Meu plano mudou");
  expect(JSON.stringify(screen.toJSON())).toContain("Se estiver cheio");
  act(() => screen.unmount());
  await act(async () => { screen = renderer.create(<EventPlans />); });
  press("Minhas compras");
  press("Me ajude a começar");
  expect(JSON.stringify(screen.toJSON())).toContain("Escolher um horário confortável");
  expect(JSON.stringify(screen.toJSON())).not.toContain("Preparar a lista de compras");
  act(() => screen.unmount());
});
