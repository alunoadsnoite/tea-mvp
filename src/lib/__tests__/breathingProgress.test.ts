import { getBreathingProgress } from "../breathingProgress";

describe("getBreathingProgress", () => {
  it("conta apenas as fases com duração na respiração 4-7-8", () => {
    expect(getBreathingProgress([4, 7, 8, 0], 0, 0, 3)).toBeCloseTo(100 / 9);
    expect(getBreathingProgress([4, 7, 8, 0], 2, 0, 3)).toBeCloseTo(100 / 3);
  });

  it("alcança 100% na última fase ativa do último ciclo", () => {
    expect(getBreathingProgress([4, 7, 8, 0], 2, 2, 3)).toBe(100);
  });

  it("preserva o progresso da respiração em caixa", () => {
    expect(getBreathingProgress([4, 4, 4, 4], 0, 0, 4)).toBe(6.25);
    expect(getBreathingProgress([4, 4, 4, 4], 3, 3, 4)).toBe(100);
  });

  it("retorna zero para exercícios sem fases ativas ou ciclos", () => {
    expect(getBreathingProgress([0, 0], 0, 0, 3)).toBe(0);
    expect(getBreathingProgress([4, 7, 8, 0], 0, 0, 0)).toBe(0);
  });
});
