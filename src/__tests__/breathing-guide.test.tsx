import React from "react";
import renderer, { act } from "react-test-renderer";
import { Pressable, Text, StyleSheet } from "react-native";
import BreathingGuideScreen from "../app/breathing-guide";

jest.mock("expo-router", () => ({ Stack: { Screen: () => null } }));
jest.mock("react-native-safe-area-context", () => ({ SafeAreaView: "SafeAreaView" }));
jest.mock("../hooks/useReducedMotion", () => ({ useReducedMotion: () => true }));
jest.mock("../hooks/useThemeMode", () => ({ useThemeMode: () => ({ colors: { background: "white", text: "black", accent: "blue" } }) }));

beforeEach(() => jest.useFakeTimers());
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

test("4-7-8 skips the zero phase, stops and restarts at the first phase", () => {
  let tree!: renderer.ReactTestRenderer;
  act(() => { tree = renderer.create(<BreathingGuideScreen />); });
  const press = (label: string) => act(() => tree.root.findAllByType(Pressable).find(p => p.props.accessibilityLabel === label)!.props.onPress());
  const phase = () => tree.root.findAllByType(Text).find(t => t.props.accessibilityLiveRegion === "polite")!.props.children;
  press("Respiração Relaxante");
  press("Começar exercício");
  expect(phase()).toBe("Inspirar");
  act(() => jest.advanceTimersByTime(4000));
  expect(phase()).toBe("Segurar");
  act(() => jest.advanceTimersByTime(7000));
  expect(phase()).toBe("Expirar");
  act(() => jest.advanceTimersByTime(8000));
  expect(phase()).toBe("Inspirar");
  press("Parar exercício");
  act(() => jest.advanceTimersByTime(20000));
  expect(phase()).toBe("Pronto?");
  press("Começar exercício");
  expect(phase()).toBe("Inspirar");
  act(() => tree.unmount());
  expect(jest.getTimerCount()).toBe(0);
});

test("breathing geometry stays square and phase text is outside the scaled view", () => {
  let tree!: renderer.ReactTestRenderer;
  act(() => { tree = renderer.create(<BreathingGuideScreen />); });
  const circle = tree.root.findByProps({ testID: "breathing-circle" });
  const style = StyleSheet.flatten(circle.props.style);
  expect(style.width).toBe(style.height);
  expect(circle.findAllByType(Text)).toHaveLength(0);
  const phase = tree.root.findAllByType(Text).find(t => t.props.accessibilityLiveRegion === "polite")!;
  expect(phase.props.allowFontScaling).not.toBe(false);
  expect(phase.props.numberOfLines).toBeUndefined();
  act(() => tree.unmount());
});
