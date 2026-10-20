import type { ReactNode } from "react";

describe("abertura após leitura do tema", () => {
  beforeEach(() => jest.resetModules());

  async function readTheme(stored: string | null, rejects = false, mountAfter = false) {
    const storage = jest.requireMock("@react-native-async-storage/async-storage");
    if (rejects) storage.getItem.mockRejectedValueOnce(new Error("storage unavailable"));
    else storage.getItem.mockResolvedValueOnce(stored);
    const React = jest.requireActual("react");
    const { create, act } = jest.requireActual("react-test-renderer");
    const { useThemeStore, useThemeHydrated } = jest.requireActual("@/stores/themeStore");
    const values: boolean[] = [];
    function Probe(): ReactNode {
      values.push(useThemeHydrated());
      return null;
    }
    let screen: ReturnType<typeof create>;
    if (mountAfter) await act(async () => {});
    await act(async () => { screen = create(React.createElement(Probe)); });
    const mode = useThemeStore.getState().mode;
    act(() => screen.unmount());
    return { mode, values };
  }

  it("libera o layout com tema escuro quando o JSON está corrompido", async () => {
    const { mode, values } = await readTheme("{");
    expect(mode).toBe("dark");
    expect(values[values.length - 1]).toBe(true);
  });

  it("libera o layout se a leitura falha antes da montagem", async () => {
    const { mode, values } = await readTheme(null, true, true);
    expect(mode).toBe("dark");
    expect(values).toEqual([true]);
  });

  it("mantém o tema salvo quando a leitura funciona", async () => {
    const { mode, values } = await readTheme(JSON.stringify({ state: { mode: "light" }, version: 1 }));
    expect(mode).toBe("light");
    expect(values[values.length - 1]).toBe(true);
  });
});
