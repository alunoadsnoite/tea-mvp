import React from "react";
import { Pressable, Text, TextInput } from "react-native";
import renderer, { act } from "react-test-renderer";
import RoutineEditor from "@/app/routines/new";
import Routines from "@/app/routines";
import { EmergencyFab } from "@/components/EmergencyFab";
import { PRO_ROUTINE_TEMPLATES, EVENT_TEMPLATES } from "@/lib/practicalTemplates";
import { useRoutineStore } from "@/stores/routineStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import english from "@/lib/en-US.json";
import spanish from "@/lib/es-ES.json";
import french from "@/lib/fr-FR.json";

let mockParams: { template?: string } = {};
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock("@/lib/edition", () => ({ isProEdition: true }));
jest.mock("expo-router", () => ({
  Stack: { Screen: () => null },
  useLocalSearchParams: () => mockParams,
  useRouter: () => ({ push: mockPush, back: mockBack }),
  usePathname: () => "/routines",
}));
jest.mock("react-native-safe-area-context", () => ({ SafeAreaView: "View" }));

beforeEach(() => {
  jest.requireMock("@/lib/edition").isProEdition = true;
  mockParams = {};
  mockPush.mockClear();
  mockBack.mockClear();
  usePreferencesStore.setState({ language: "pt-BR" });
  useRoutineStore.getState().resetToDefaults();
});

test.each([true, false])("SOS keeps its accessible crisis action with the edition symbol (PRO=%s)", (pro) => {
  jest.requireMock("@/lib/edition").isProEdition = pro;
  let screen!: renderer.ReactTestRenderer;
  act(() => { screen = renderer.create(<EmergencyFab />); });
  const button = screen.root.findByType(Pressable);
  expect(button.props.accessibilityLabel).toBe("Abrir Cartão de Crise");
  expect(screen.root.findByType(Text).props.children).toBe(pro ? "∞" : "!");
  act(() => button.props.onPress());
  expect(mockPush).toHaveBeenCalledWith("/crisis-card");
  act(() => screen.unmount());
});

test("examples open as a draft, preserve the active routine, and save an editable copy", () => {
  useRoutineStore.getState().startExecution("default-work");
  useRoutineStore.getState().pauseExecution();
  const before = useRoutineStore.getState();
  let screen!: renderer.ReactTestRenderer;
  act(() => { screen = renderer.create(<Routines />); });
  act(() => screen.root.findAllByType(Pressable).find((b) => b.props.accessibilityLabel === "Exemplos de rotinas")!.props.onPress());
  act(() => screen.root.findAllByType(Pressable).find((b) => b.props.accessibilityLabel === "Usar Preparar o sono como modelo")!.props.onPress());
  const route = mockPush.mock.calls[0][0];
  expect(route.pathname).toBe("/routines/new");
  act(() => screen.unmount());
  mockParams = route.params;
  act(() => { screen = renderer.create(<RoutineEditor />); });
  expect(useRoutineStore.getState().routines).toBe(before.routines);
  expect(useRoutineStore.getState().execution).toBe(before.execution);
  const field = screen.root.findAllByType(TextInput).find((input) => input.props.accessibilityLabel === "Nome da rotina")!;
  expect(field.props.value).toBe("Preparar o sono");
  act(() => field.props.onChangeText("Minha noite"));
  // Changing a field must not reset the template form.
  expect(screen.root.findAllByType(TextInput).find((input) => input.props.accessibilityLabel === "Nome da rotina")!.props.value).toBe("Minha noite");
  act(() => screen.root.findAllByType(Pressable).find((b) => b.props.accessibilityLabel === "Criar rotina")!.props.onPress());
  const saved = useRoutineStore.getState().routines.slice(-1)[0];
  expect(saved.name).toBe("Minha noite");
  expect(saved.isDefault).toBe(false);
  expect(saved.steps).toHaveLength(4);
  expect(saved.steps[0].id).not.toBe(PRO_ROUTINE_TEMPLATES.find((t) => t.id === mockParams.template)!.steps[0].id);
  expect(useRoutineStore.getState().execution).toBe(before.execution);
  act(() => screen.unmount());
});

test("free edition does not expose PRO routine examples, including direct links", () => {
  jest.requireMock("@/lib/edition").isProEdition = false;
  let screen!: renderer.ReactTestRenderer;
  act(() => { screen = renderer.create(<Routines />); });
  expect(JSON.stringify(screen.toJSON())).not.toContain("Exemplos de rotinas");
  act(() => screen.unmount());
  mockParams = { template: PRO_ROUTINE_TEMPLATES[0].id };
  act(() => { screen = renderer.create(<RoutineEditor />); });
  expect(screen.root.findAllByType(TextInput).find((input) => input.props.accessibilityLabel === "Nome da rotina")!.props.value).toBe("");
  act(() => screen.unmount());
});

test("every example has translations in all supported languages", () => {
  const messages = [
    ...PRO_ROUTINE_TEMPLATES.flatMap((r) => [r.name, r.description!, ...r.steps.map((s) => s.title)]),
    ...EVENT_TEMPLATES.flatMap((e) => [e.title, ...e.preparation.split("\n"), ...e.objects.split("\n"), e.alternatives]),
  ];
  for (const catalog of [english, spanish, french]) {
    for (const message of messages) expect(catalog).toHaveProperty([message]);
  }
});
