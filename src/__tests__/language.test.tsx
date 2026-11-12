import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking, Pressable } from "react-native";
import renderer, { act } from "react-test-renderer";
import Settings from "@/app/settings";
import { CrisisCardModal } from "@/components/CrisisCardModal";
import { localizeCopingCard, localizeRoutine } from "@/lib/localizedContent";
import { translate } from "@/lib/i18n";
import english from "@/lib/en-US.json";
import spanish from "@/lib/es-ES.json";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useCrisisStore } from "@/stores/crisisStore";
import { DEFAULT_COPING_CARDS } from "@/types/coping";
import { DEFAULT_MESSAGES } from "@/types/crisis";
import { DEFAULT_ROUTINES } from "@/types/routine";

jest.mock("expo-router", () => ({
  Stack: { Screen: () => null },
  Link: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("react-native-safe-area-context", () => ({ SafeAreaView: "View" }));

const preferencesKey = "preferences-storage";

beforeEach(async () => {
  await AsyncStorage.clear();
  usePreferencesStore.setState({ language: "pt-BR", hapticsEnabled: false, reduceMotion: false, showNextStep: false });
  useCrisisStore.getState().resetToDefaults();
});

afterEach(() => jest.restoreAllMocks());

test("old preferences retain their values and default to Brazilian Portuguese", async () => {
  usePreferencesStore.setState({ language: "en-US" });
  await AsyncStorage.setItem(preferencesKey, JSON.stringify({
    version: 1,
    state: { hapticsEnabled: true, reduceMotion: true, showNextStep: true },
  }));
  await usePreferencesStore.persist.rehydrate();
  expect(usePreferencesStore.getState()).toMatchObject({
    language: "pt-BR", hapticsEnabled: true, reduceMotion: true, showNextStep: true,
  });
});

test.each([
  ["English", "Reduce motion"],
  ["Español", "Reducir movimiento"],
])("settings translates immediately and restores %s on hydration", async (language, label) => {
  let screen!: renderer.ReactTestRenderer;
  act(() => { screen = renderer.create(<Settings />); });
  const option = (name: string) => screen.root.findAllByType(Pressable).find(
    (button) => button.props.accessibilityRole === "radio" && button.props.accessibilityLabel === name
  )!;
  expect(option("Português (Brasil)").props.accessibilityState.checked).toBe(true);
  act(() => option(language).props.onPress());
  expect(option(language).props.accessibilityState.checked).toBe(true);
  expect(JSON.stringify(screen.toJSON())).toContain(label);

  const persisted = (await AsyncStorage.getItem(preferencesKey))!;
  act(() => usePreferencesStore.getState().setLanguage("pt-BR"));
  await AsyncStorage.setItem(preferencesKey, persisted);
  await act(async () => { await usePreferencesStore.persist.rehydrate(); });
  expect(option(language).props.accessibilityState.checked).toBe(true);
  act(() => screen.unmount());
});

test("crisis SMS translates the built-in message and keeps saved edits verbatim", async () => {
  const store = useCrisisStore.getState();
  store.addContact({ name: "Apoio", phone: "123", relationship: "" });
  usePreferencesStore.getState().setLanguage("en-US");
  const openURL = jest.spyOn(Linking, "openURL").mockResolvedValue(undefined);
  let screen!: renderer.ReactTestRenderer;
  act(() => { screen = renderer.create(<CrisisCardModal />); });
  const send = () => screen.root.findAllByType(Pressable).find(
    (button) => button.props.accessibilityLabel === "Send a message to Apoio"
  )!.props.onPress();
  await act(async () => { send(); });
  expect(decodeURIComponent(openURL.mock.calls[0][0])).toBe(
    "sms:123?body=I'm experiencing sensory overload. I need a few minutes in a quiet place."
  );
  expect(useCrisisStore.getState().messages[0].content).toBe(DEFAULT_MESSAGES[0].content);

  act(() => store.updateMessage(DEFAULT_MESSAGES[0].id, { content: "Mensagem pessoal {0}" }));
  await act(async () => { send(); });
  expect(decodeURIComponent(openURL.mock.calls[1][0])).toBe("sms:123?body=Mensagem pessoal {0}");
  act(() => screen.unmount());
});

test("built-in content keeps its identifiers and user choices in English", () => {
  const t = translate["en-US"];
  const card = { ...DEFAULT_COPING_CARDS[0], isFavorite: true };
  expect(localizeCopingCard(card, t)).toMatchObject({
    id: card.id, isFavorite: true, title: "5-4-3-2-1 grounding",
  });
  const routine = DEFAULT_ROUTINES[0];
  expect(localizeRoutine(routine, t).steps[0]).toMatchObject({
    id: routine.steps[0].id, estimatedMinutes: routine.steps[0].estimatedMinutes, title: "Organize your desk",
  });
  expect(localizeRoutine({ ...routine, isDefault: false }, t).name).toBe(routine.name);
});


test("both translation catalogs have the same messages and interpolation tokens", () => {
  const tokens = (value: string) => (value.match(/\{\d+\}/g) ?? []).sort();
  expect(Object.keys(spanish).sort()).toEqual(Object.keys(english).sort());
  for (const [key, translation] of Object.entries(english)) {
    expect(tokens(translation)).toEqual(tokens(key));
    expect(tokens(spanish[key as keyof typeof spanish])).toEqual(tokens(key));
  }
  expect(translate["es-ES"]("Passo {0} de {1}", 2, 5)).toBe("Paso 2 de 5");
});
