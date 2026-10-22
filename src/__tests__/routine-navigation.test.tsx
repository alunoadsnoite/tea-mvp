import React from "react";
import renderer, { act } from "react-test-renderer";
import { Pressable } from "react-native";
import RoutineExecutionScreen from "../app/routine-execution";
import { useRoutineStore } from "../stores/routineStore";

let mockHistory: string[];
const mockBack = jest.fn(() => { mockHistory.pop(); });
const mockReplace = jest.fn((route: string) => {
  mockHistory[mockHistory.length - 1] = route;
});
const mockRouter = {
  back: mockBack,
  replace: mockReplace,
  canGoBack: () => mockHistory.length > 1,
};
jest.mock("expo-router", () => ({
  Stack: { Screen: () => null },
  useRouter: () => mockRouter,
}));
jest.mock("../hooks/useThemeMode", () => ({
  useThemeMode: () => ({ colors: {
    background: "white", surface: "white", surfaceAlt: "gray",
    text: "black", textSecondary: "gray", accent: "blue",
  } }),
}));
jest.mock("../hooks/useFontScale", () => ({
  useFontScale: () => ({ fontSize: (size: number) => size }),
}));
jest.mock("../components/VisualTimerBar", () => ({ VisualTimerBar: () => null }));
jest.mock("react-native-safe-area-context", () => ({ SafeAreaView: "SafeAreaView" }));

beforeEach(() => {
  jest.useFakeTimers();
  mockHistory = ["/", "/routines"];
  mockBack.mockClear();
  mockReplace.mockClear();
  useRoutineStore.getState().resetToDefaults();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

function readyToFinish() {
  const routine = useRoutineStore.getState().routines[0];
  useRoutineStore.getState().startExecution(routine.id);
  for (let i = 1; i < routine.steps.length; i++) {
    useRoutineStore.getState().completeStep();
  }
}

function renderExecution() {
  let tree!: renderer.ReactTestRenderer;
  act(() => { tree = renderer.create(<RoutineExecutionScreen />); });
  return tree;
}

function finish(tree: renderer.ReactTestRenderer) {
  const button = tree.root.findAllByType(Pressable).find(
    p => p.props.accessibilityLabel === "Concluir Rotina"
  )!;
  act(() => button.props.onPress());
}

test("repeated completions return to the original list without accumulating copies", () => {
  for (let run = 0; run < 3; run++) {
    readyToFinish();
    mockHistory.push("/routine-execution");
    const tree = renderExecution();
    finish(tree);
    act(() => jest.advanceTimersByTime(1499));
    expect(mockHistory).toEqual(["/", "/routines", "/routine-execution"]);
    act(() => jest.advanceTimersByTime(1));
    expect(mockHistory).toEqual(["/", "/routines"]);
    expect(useRoutineStore.getState().execution).toBeNull();
    act(() => tree.unmount());
  }
  expect(mockReplace).not.toHaveBeenCalled();
  expect(mockBack).toHaveBeenCalledTimes(3);
  mockRouter.back();
  expect(mockHistory).toEqual(["/"]);
});

test("a restored completed run without history replaces itself with the list", () => {
  readyToFinish();
  useRoutineStore.getState().completeStep();
  mockHistory = ["/routine-execution"];
  const tree = renderExecution();
  act(() => jest.advanceTimersByTime(1500));
  expect(mockHistory).toEqual(["/routines"]);
  expect(mockReplace).toHaveBeenCalledWith("/routines");
  expect(mockBack).not.toHaveBeenCalled();
  expect(useRoutineStore.getState().execution).toBeNull();
  act(() => tree.unmount());
});

test("leaving the completion screen cancels its delayed navigation", () => {
  readyToFinish();
  const tree = renderExecution();
  finish(tree);
  act(() => tree.unmount());
  act(() => jest.advanceTimersByTime(2000));
  expect(mockBack).not.toHaveBeenCalled();
  expect(mockReplace).not.toHaveBeenCalled();
});

test("an empty restored execution has a safe route back without history", () => {
  mockHistory = ["/routine-execution"];
  const tree = renderExecution();
  const button = tree.root.findAllByType(Pressable).find(
    p => p.props.accessibilityLabel === "Voltar para Minhas Rotinas"
  )!;
  act(() => button.props.onPress());
  expect(mockHistory).toEqual(["/routines"]);
  expect(mockBack).not.toHaveBeenCalled();
  act(() => tree.unmount());
});
