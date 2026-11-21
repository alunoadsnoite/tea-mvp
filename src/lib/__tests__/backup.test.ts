import AsyncStorage from "@react-native-async-storage/async-storage";
import { exportBackup, InvalidBackupError, restoreBackup, validateBackup } from "@/lib/backup";
import { useCheckInStore } from "@/stores/checkInStore";
import { useCopingCardsStore } from "@/stores/copingCardsStore";
import { useCrisisStore } from "@/stores/crisisStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useRoutineStore } from "@/stores/routineStore";
import { useThemeStore } from "@/stores/themeStore";

const stores = [
  useCheckInStore, useCopingCardsStore, useCrisisStore,
  usePreferencesStore, useRoutineStore, useThemeStore,
];

beforeEach(async () => {
  for (const store of stores) store.setState(store.getInitialState());
  await AsyncStorage.clear();
});

afterEach(() => jest.restoreAllMocks());

it("round-trips all six sections and reloads the running stores", async () => {
  useCheckInStore.getState().addEntry({
    socialBattery: 50, sensoryLoad: 2, physicalEnergy: 4, triggers: ["Som"],
  });
  const cardId = useCopingCardsStore.getState().cards[0].id;
  useCopingCardsStore.getState().toggleFavorite(cardId);
  useCrisisStore.getState().addContact({ name: "Contato de teste", phone: "0000", relationship: "Amigo" });
  useRoutineStore.getState().startExecution(useRoutineStore.getState().routines[0].id);
  useRoutineStore.getState().pauseExecution();
  usePreferencesStore.getState().setLanguage("fr-FR");
  usePreferencesStore.getState().setReduceMotion(true);
  useThemeStore.getState().setMode("light");

  const text = await exportBackup();
  for (const store of stores) store.setState(store.getInitialState());
  await AsyncStorage.clear();

  await restoreBackup(text);
  expect(await exportBackup()).toBe(text);
  expect(useCheckInStore.getState().entries).toHaveLength(1);
  expect(useCopingCardsStore.getState().getCardById(cardId)?.isFavorite).toBe(true);
  expect(useCrisisStore.getState().primaryContactId).toBe(useCrisisStore.getState().contacts[0].id);
  expect(useRoutineStore.getState().execution?.isPaused).toBe(true);
  expect(usePreferencesStore.getState()).toMatchObject({ language: "fr-FR", reduceMotion: true });
  expect(useThemeStore.getState().mode).toBe("light");
});

it("exports an older installation and applies the existing migrations to legacy sections", async () => {
  await AsyncStorage.setItem("preferences-storage", JSON.stringify({
    version: 1, state: { hapticsEnabled: true, reduceMotion: false, showNextStep: true },
  }));
  const text = await exportBackup();
  const backup = JSON.parse(text);
  backup.data.crisis.version = 1;
  backup.data.crisis.state.contacts = [{ id: "old", name: "Teste", phone: "0000", relationship: "" }];
  delete backup.data.crisis.state.primaryContactId;
  backup.data.routines.version = 1;
  backup.data.routines.state.execution = { isPaused: true };

  await restoreBackup(JSON.stringify(backup));
  expect(usePreferencesStore.getState()).toMatchObject({ language: "pt-BR", hapticsEnabled: true });
  expect(useCrisisStore.getState().primaryContactId).toBe("old");
  expect(useRoutineStore.getState().execution).toBeNull();
});

it("rejects malformed, future, and incomplete backups before touching current data", async () => {
  useThemeStore.getState().setMode("light");
  const text = await exportBackup();
  const future = JSON.parse(text);
  future.data.crisis.version = 99;
  const malformed = JSON.parse(text);
  malformed.data.routines.state.routines[0].steps[0].estimatedMinutes = "5";
  const incomplete = JSON.parse(text);
  delete incomplete.data.checkIn;
  const futureFormat = JSON.parse(text);
  futureFormat.version = 2;
  const write = jest.spyOn(AsyncStorage, "multiSet").mockClear();

  for (const value of [future, malformed, incomplete, futureFormat]) {
    await expect(restoreBackup(JSON.stringify(value))).rejects.toBeInstanceOf(InvalidBackupError);
  }
  expect(() => validateBackup("{")).toThrow(InvalidBackupError);
  expect(write).not.toHaveBeenCalled();
  expect(useThemeStore.getState().mode).toBe("light");
});

it("does not import properties that shadow store methods", async () => {
  const backup = JSON.parse(await exportBackup());
  backup.data.theme.state.setMode = "malformed";
  await restoreBackup(JSON.stringify(backup));
  useThemeStore.getState().setMode("light");
  expect(useThemeStore.getState().mode).toBe("light");
});

it("recovers the previous values after a partial storage failure", async () => {
  const text = await exportBackup();
  useCheckInStore.getState().addEntry({
    socialBattery: 40, sensoryLoad: 1, physicalEnergy: 2, triggers: [],
  });
  const before = await exportBackup();
  const write = AsyncStorage.multiSet.bind(AsyncStorage);
  jest.spyOn(AsyncStorage, "multiSet").mockImplementationOnce(async (entries) => {
    await write(entries.slice(0, 2));
    throw new Error("Storage full");
  });

  await expect(restoreBackup(text)).rejects.toThrow("Storage full");
  expect(await exportBackup()).toBe(before);
  expect(await AsyncStorage.getItem("coping-cards-storage")).toBeNull();
  expect(useCheckInStore.getState().entries).toHaveLength(1);
});
