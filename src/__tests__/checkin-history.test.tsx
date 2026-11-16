import React from "react";
import renderer, { act } from "react-test-renderer";
import { Text } from "react-native";
import CheckInHistoryScreen from "../app/checkin-history";
import { useCheckInStore } from "../stores/checkInStore";
import type { CheckInEntry } from "../types/checkin";

jest.mock("expo-router", () => ({ Stack: { Screen: () => null } }));
jest.mock("react-native-safe-area-context", () => ({ SafeAreaView: "SafeAreaView" }));

function entry(id: string, daysAgo: number, sensoryLoad: number, triggers: string[]): CheckInEntry {
  return {
    id,
    timestamp: Date.now() - daysAgo * 24 * 60 * 60 * 1000,
    socialBattery: 50,
    physicalEnergy: 3,
    sensoryLoad,
    triggers,
  };
}

test("summarizes the same seven days shown in the history and updates after clearing", () => {
  useCheckInStore.setState({
    entries: [
      entry("old", 8, 5, ["Pouco sono"]),
      entry("previous", 2, 3, ["Cheiros fortes", "Conflito interpessoal", "Reunião longa"]),
      entry("today", 0, 4, ["Cheiros fortes", "Cheiros fortes", "Toque ou textura"]),
    ],
  });

  let screen!: renderer.ReactTestRenderer;
  act(() => { screen = renderer.create(<CheckInHistoryScreen />); });
  const text = () => screen.root.findAllByType(Text).map((node) => node.props.children);

  expect(text()).toContain("Carga sensorial de 4 ou 5 em 1 de 2 registros.");
  expect(text().filter((line) => typeof line === "string" && line.endsWith("registros.")).slice(1))
    .toEqual([
      "Cheiros fortes em 2 de 2 registros.",
      "Toque ou textura em 1 de 2 registros.",
      "Conflito interpessoal em 1 de 2 registros.",
    ]);
  expect(text()).not.toContain("Pouco sono");

  act(() => useCheckInStore.setState({ entries: [entry("no-trigger", 0, 0, [])] }));
  expect(text()).toContain("Nenhum gatilho registrado no período.");

  act(() => useCheckInStore.getState().clearHistory());
  expect(text()).toContain("Nenhum check-in nos últimos 7 dias");
  expect(text()).not.toContain("Resumo sensorial dos últimos 7 dias");
  act(() => screen.unmount());
});
