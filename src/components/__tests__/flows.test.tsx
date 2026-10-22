import React from "react";
import { Alert } from "react-native";
import RoutinesListScreen from "@/app/routines";
import { CrisisCardModal } from "@/components/CrisisCardModal";
import { useRoutineStore } from "@/stores/routineStore";
import { useCrisisStore } from "@/stores/crisisStore";

const { create, act } = jest.requireActual("react-test-renderer");
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
  Stack: { Screen: () => null },
  Link: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("react-native-safe-area-context", () => ({ SafeAreaView: "View" }));
jest.mock("@/hooks/useThemeMode", () => ({
  useThemeMode: () => ({ colors: jest.requireActual("@/constants/theme").darkTheme }),
}));
jest.mock("@/hooks/useHapticFeedback", () => ({ useHapticFeedback: () => ({ trigger: jest.fn() }) }));

describe("fluxos de rotina e comunicação", () => {
  beforeEach(() => {
    useRoutineStore.getState().resetToDefaults();
    useCrisisStore.getState().resetToDefaults();
    mockPush.mockClear();
  });

  it("Continuar abre a execução existente sem reiniciar nem retirar a pausa", () => {
    useRoutineStore.getState().startExecution("default-work");
    useRoutineStore.getState().completeStep();
    useRoutineStore.getState().pauseExecution();
    const execution = useRoutineStore.getState().execution;
    let screen: ReturnType<typeof create>;
    act(() => { screen = create(<RoutinesListScreen />); });
    act(() => { screen.root.findAllByProps({ accessibilityLabel: "Continuar rotina Início de Expediente" })[0].props.onPress(); });
    expect(useRoutineStore.getState().execution).toBe(execution);
    expect(mockPush).toHaveBeenCalledWith("/routine-execution");
    act(() => screen.unmount());
  });

  it("outra rotina só substitui a atual ao confirmar o diálogo", () => {
    useRoutineStore.getState().startExecution("default-work");
    const execution = useRoutineStore.getState().execution;
    const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    let screen: ReturnType<typeof create>;
    act(() => { screen = create(<RoutinesListScreen />); });
    act(() => { screen.root.findAllByProps({ accessibilityLabel: "Iniciar rotina Preparação para Sair" })[0].props.onPress(); });
    expect(useRoutineStore.getState().execution).toBe(execution);
    expect(mockPush).not.toHaveBeenCalled();
    const buttons = alert.mock.calls[0][2]!;
    expect(buttons[0].text).toBe("Cancelar");
    act(() => buttons.find((button) => button.text === "Substituir")!.onPress!());
    expect(useRoutineStore.getState().execution?.routineId).toBe("default-leaving");
    expect(mockPush).toHaveBeenCalledWith("/routine-execution");
    act(() => screen.unmount());
    alert.mockRestore();
  });

  it("ocultar todas as mensagens mantém ligação disponível e impede SMS vazio", () => {
    const store = useCrisisStore.getState();
    store.addContact({ name: "Apoio", phone: "123", relationship: "" });
    store.messages.forEach((message) => store.setMessageHidden(message.id, true));
    let screen: ReturnType<typeof create>;
    act(() => { screen = create(<CrisisCardModal />); });
    expect(screen.root.findAllByProps({ accessibilityLabel: "Ligar para Apoio" }).length).toBeGreaterThan(0);
    expect(screen.root.findAllByProps({ accessibilityLabel: "Escolher mensagens do cartão" }).length).toBeGreaterThan(0);
    expect(screen.root.findAllByProps({ accessibilityLabel: "Enviar mensagem para Apoio" })[0].props.disabled).toBe(true);
    act(() => screen.unmount());
  });
});
