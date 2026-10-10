import { getBreathingProgress } from "../breathingProgress";

describe("getBreathingProgress", () => {
  it("conta apenas as fases com duração na respiração 4-7-8", () => {
    expect(getBreathingProgress([4, 7, 8, 0], 0, 0, 3)).toBe(0);
    expect(getBreathingProgress([4, 7, 8, 0], 2, 0, 3)).toBeCloseTo(200 / 9);
  });

  it("não marca 100% antes de concluir a última fase", () => {
    expect(getBreathingProgress([4, 7, 8, 0], 2, 2, 3)).toBeCloseTo(800 / 9);
    expect(getBreathingProgress([4, 7, 8, 0], 0, 3, 3)).toBe(100);
  });

  it("preserva o progresso da respiração em caixa", () => {
    expect(getBreathingProgress([4, 4, 4, 4], 0, 0, 4)).toBe(0);
    expect(getBreathingProgress([4, 4, 4, 4], 3, 3, 4)).toBe(93.75);
  });

  it("retorna zero para exercícios sem fases ativas ou ciclos", () => {
    expect(getBreathingProgress([0, 0], 0, 0, 3)).toBe(0);
    expect(getBreathingProgress([4, 7, 8, 0], 0, 0, 0)).toBe(0);
  });
});
