import React from "react";
import renderer, { act } from "react-test-renderer";
import Settings from "@/app/settings";

jest.mock("@/lib/edition", () => ({ isProEdition: false }));
jest.mock("expo-router", () => ({
  Stack: { Screen: () => null },
  Link: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("react-native-safe-area-context", () => ({ SafeAreaView: "View" }));

test.each([false, true])("donation controls are available only in the free edition (PRO=%s)", (pro) => {
  jest.requireMock("@/lib/edition").isProEdition = pro;
  let screen!: renderer.ReactTestRenderer;
  act(() => { screen = renderer.create(<Settings />); });
  const output = JSON.stringify(screen.toJSON());
  for (const label of ["Apoie o desenvolvedor", "Copiar chave Pix", "GitHub Sponsors"]) {
    expect(output.includes(label)).toBe(!pro);
  }
  expect(output).toContain("Enviar e-mail");
  act(() => screen.unmount());
});
