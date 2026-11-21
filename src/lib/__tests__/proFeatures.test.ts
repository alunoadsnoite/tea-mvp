import AsyncStorage from "@react-native-async-storage/async-storage";
import { editPlanItems, loadEventPlans, useEventPlanStore } from "@/stores/eventPlanStore";
import { exportBackup, restoreBackup } from "@/lib/backup";
import { reportHtml, reportRows, reportSummary } from "@/lib/checkInReport";
import { translate } from "@/lib/i18n";
import type { CheckInEntry } from "@/types/checkin";

beforeEach(async () => {
  useEventPlanStore.setState({ plans: [] });
  await AsyncStorage.clear();
});

it("preserves checklist progress when editing and starts new templates unchecked", () => {
  const first = editPlanItems("Bilhete\n\nÁgua", []);
  first[0].done = true;
  const edited = editPlanItems("Água\nBilhete\nFones", first);
  expect(edited.map(({ text, done }) => [text, done])).toEqual([
    ["Água", false], ["Bilhete", true], ["Fones", false],
  ]);
  const copied = editPlanItems(edited.map(({ text }) => text).join("\n"), []);
  expect(copied.every(({ done }) => !done)).toBe(true);
  expect(copied.map(({ id }) => id)).not.toEqual(edited.map(({ id }) => id));
});

it("carries event plans through backup and applies checklist changes after reopening", async () => {
  useEventPlanStore.getState().save({
    title: "Consulta", date: "2026-12-18", preparation: editPlanItems("Confirmar horário", []),
    objects: editPlanItems("Fones", []), alternatives: "Solicitar uma pausa.",
  });
  const before = useEventPlanStore.getState().plans[0];
  useEventPlanStore.getState().toggle(before.id, "objects", before.objects[0].id);
  const backup = await exportBackup();
  useEventPlanStore.setState({ plans: [] });
  await AsyncStorage.clear();
  await restoreBackup(backup);
  await loadEventPlans();

  const restored = useEventPlanStore.getState().plans[0];
  expect(restored).toMatchObject({ ...before, objects: [{ ...before.objects[0], done: true }] });
  expect(await exportBackup()).toBe(backup);
});

it("groups the selected check-ins by civil day and escapes user-provided triggers in PDF markup", () => {
  const timestamp = new Date(2026, 10, 21, 12).getTime();
  const entry: CheckInEntry = {
    id: "one", timestamp, socialBattery: 40, sensoryLoad: 4, physicalEnergy: 2,
    triggers: ["<img src=x>&"],
  };
  const entries = [entry, { ...entry, id: "two", socialBattery: 60, sensoryLoad: 1 }];
  const rows = reportRows(entries, "en-US");
  expect(rows).toEqual([[new Date(timestamp).toLocaleDateString("en-US"), "50%", "2.5/5", "2/5"]]);
  const summary = reportSummary(entries, translate["en-US"]);
  const html = reportHtml("Report", "Last 7 days", summary, ["Date"], rows, "en-US");
  expect(html).toContain("&lt;img src=x&gt;&amp;");
  expect(html).not.toContain("<img");
});
