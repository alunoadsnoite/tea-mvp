import { useRoutineStore } from "@/stores/routineStore";

describe("routineStore", () => {
  beforeEach(() => {
    useRoutineStore.getState().resetToDefaults();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("startExecution inicia no primeiro passo e retorna true", () => {
    const ok = useRoutineStore.getState().startExecution("default-work");
    expect(ok).toBe(true);

    const execution = useRoutineStore.getState().execution;
    expect(execution).not.toBeNull();
    expect(execution?.routineId).toBe("default-work");
    expect(execution?.currentStepIndex).toBe(0);
    expect(execution?.isPaused).toBe(false);
    expect(execution?.completedAt).toBeNull();
    expect(execution?.stepEndsAt).toBeGreaterThan(Date.now());
  });

  it("startExecution retorna false para rotina inexistente", () => {
    expect(useRoutineStore.getState().startExecution("nope")).toBe(false);
    expect(useRoutineStore.getState().execution).toBeNull();
  });

  it("startExecution retorna false para rotina sem passos", () => {
    useRoutineStore.getState().addRoutine({
      name: "Vazia",
      steps: [],
      isDefault: false,
    });
    const empty = useRoutineStore
      .getState()
      .routines.find((r) => r.name === "Vazia");
    expect(empty).toBeDefined();

    expect(useRoutineStore.getState().startExecution(empty!.id)).toBe(false);
    expect(useRoutineStore.getState().execution).toBeNull();
  });

  it("completeStep avança os passos e conclui no último", () => {
    useRoutineStore.getState().startExecution("default-work"); // 3 passos

    useRoutineStore.getState().completeStep();
    expect(useRoutineStore.getState().execution?.currentStepIndex).toBe(1);

    useRoutineStore.getState().completeStep();
    expect(useRoutineStore.getState().execution?.currentStepIndex).toBe(2);

    useRoutineStore.getState().completeStep();
    const execution = useRoutineStore.getState().execution;
    expect(execution?.currentStepIndex).toBe(2);
    expect(execution?.completedAt).not.toBeNull();
  });

  it("pausa congela e retoma devolve ao passo o tempo pausado", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-01T10:00:00.000Z"));
    useRoutineStore.getState().startExecution("default-work");
    const before = useRoutineStore.getState().execution!.stepEndsAt!;

    useRoutineStore.getState().pauseExecution();
    expect(useRoutineStore.getState().execution?.isPaused).toBe(true);

    jest.setSystemTime(new Date("2026-01-01T10:05:00.000Z")); // 5 min pausado
    useRoutineStore.getState().resumeExecution();

    const execution = useRoutineStore.getState().execution!;
    expect(execution.isPaused).toBe(false);
    expect(execution.pausedAt).toBeNull();
    expect(execution.stepEndsAt).toBe(before + 5 * 60 * 1000);
  });

  it("deleteRoutine encerra a execução da rotina excluída", () => {
    useRoutineStore.getState().addRoutine({
      name: "Personalizada",
      steps: [{ id: "s1", title: "Passo", estimatedMinutes: 1 }],
      isDefault: false,
    });
    const custom = useRoutineStore
      .getState()
      .routines.find((r) => r.name === "Personalizada");

    useRoutineStore.getState().startExecution(custom!.id);
    expect(useRoutineStore.getState().execution).not.toBeNull();

    useRoutineStore.getState().deleteRoutine(custom!.id);
    expect(useRoutineStore.getState().execution).toBeNull();
    expect(
      useRoutineStore.getState().routines.find((r) => r.id === custom!.id)
    ).toBeUndefined();
  });

  it("rotinas padrão não podem ser excluídas", () => {
    useRoutineStore.getState().deleteRoutine("default-work");
    expect(
      useRoutineStore.getState().routines.find((r) => r.id === "default-work")
    ).toBeDefined();
  });
});
