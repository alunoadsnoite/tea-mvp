import { useCheckInStore } from "@/stores/checkInStore";
import { CheckInEntry } from "@/types/checkin";

const DAY_MS = 24 * 60 * 60 * 1000;

function makeEntry(id: string, timestamp: number): CheckInEntry {
  return {
    id,
    timestamp,
    socialBattery: 50,
    sensoryLoad: 2,
    physicalEnergy: 2,
    triggers: [],
  };
}

function entryInput(overrides: Partial<Omit<CheckInEntry, "id" | "timestamp">> = {}) {
  return {
    socialBattery: 60,
    sensoryLoad: 2,
    physicalEnergy: 3,
    triggers: ["Barulho de trânsito"],
    ...overrides,
  };
}

describe("checkInStore", () => {
  beforeEach(() => {
    useCheckInStore.setState({ entries: [] });
  });

  it("adiciona um check-in com id e timestamp", () => {
    const before = Date.now();
    useCheckInStore.getState().addEntry(entryInput());

    const entries = useCheckInStore.getState().entries;
    expect(entries).toHaveLength(1);
    expect(entries[0].id).toMatch(/^checkin-/);
    expect(entries[0].timestamp).toBeGreaterThanOrEqual(before);
    expect(entries[0].socialBattery).toBe(60);
    expect(entries[0].triggers).toEqual(["Barulho de trânsito"]);
  });

  it("descarta entradas com mais de 90 dias na gravação", () => {
    const now = Date.now();
    useCheckInStore.setState({
      entries: [makeEntry("old", now - 91 * DAY_MS), makeEntry("recent", now - 2 * DAY_MS)],
    });

    useCheckInStore.getState().addEntry(entryInput());

    const ids = useCheckInStore.getState().entries.map((e) => e.id);
    expect(ids).not.toContain("old");
    expect(ids).toContain("recent");
    expect(ids).toHaveLength(2);
  });

  it("getRecentEntries filtra pela janela e ordena do mais recente", () => {
    const now = Date.now();
    useCheckInStore.setState({
      entries: [
        makeEntry("e1", now - 1 * DAY_MS),
        makeEntry("e2", now - 10 * DAY_MS),
        makeEntry("e3", now - 2 * 60 * 60 * 1000),
      ],
    });

    const recent = useCheckInStore.getState().getRecentEntries(7);
    expect(recent.map((e) => e.id)).toEqual(["e3", "e1"]);
  });

  it("clearHistory apaga o histórico inteiro", () => {
    useCheckInStore.setState({ entries: [makeEntry("e1", Date.now())] });
    useCheckInStore.getState().clearHistory();
    expect(useCheckInStore.getState().entries).toHaveLength(0);
  });
});
