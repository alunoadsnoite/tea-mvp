jest.mock("@/hooks/useReducedMotion", () => ({ useReducedMotion: () => false }));
import React from "react";
import renderer, { act } from "react-test-renderer";
import { Linking, View } from "react-native";
import RootLayout from "../app/_layout";
const mockReplace = jest.fn();
let mockReady = false;
const mockRouter = { replace: mockReplace };
jest.mock("expo-router", () => ({ Stack: "Stack", useRouter: () => mockRouter,
  usePathname: () => "/routines", useRootNavigationState: () => mockReady ? { key: "ready" } : undefined }));
jest.mock("expo-splash-screen", () => ({ preventAutoHideAsync: jest.fn(), hideAsync: jest.fn() }));
jest.mock("expo-status-bar", () => ({ StatusBar: () => null }));
jest.mock("../hooks/useThemeMode", () => ({ useThemeMode: () => ({ colors: { background: "white" } }) }));
jest.mock("../components/EmergencyFab", () => ({ EmergencyFab: "EmergencyFab" }));
jest.mock("react-native-safe-area-context", () => ({ SafeAreaProvider: "SafeAreaProvider", SafeAreaView: "SafeAreaView" }));
afterEach(() => { jest.restoreAllMocks(); mockReplace.mockClear(); mockReady = false; });

test("cold help intent waits for navigation readiness and opens Help", async () => {
  const initial = jest.spyOn(Linking, "getInitialURL").mockResolvedValue("tea://crisis-card");
  let tree!: renderer.ReactTestRenderer;
  await act(async () => { tree = renderer.create(<RootLayout />); });
  expect(initial).not.toHaveBeenCalled();
  mockReady = true;
  await act(async () => { tree.update(<RootLayout />); });
  expect(mockReplace).toHaveBeenCalledWith("/crisis-card");
  act(() => tree.unmount());
});

test("ordinary launcher start does not redirect to Help", async () => {
  mockReady = true;
  jest.spyOn(Linking, "getInitialURL").mockResolvedValue(null);
  let tree!: renderer.ReactTestRenderer;
  await act(async () => { tree = renderer.create(<RootLayout />); });
  expect(mockReplace).not.toHaveBeenCalled();
  // SOS is a sibling of the stack in a safe-area footer, never an overlay.
  const footer = tree.root.findByType("SafeAreaView" as unknown as typeof View);
  expect(footer.props.edges).toEqual(["bottom"]);
  expect(footer.findByType("EmergencyFab" as unknown as typeof View)).toBeTruthy();
  act(() => tree.unmount());
});
