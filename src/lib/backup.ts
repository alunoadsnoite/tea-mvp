import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCheckInStore } from "@/stores/checkInStore";
import { useCopingCardsStore } from "@/stores/copingCardsStore";
import { useCrisisStore } from "@/stores/crisisStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useRoutineStore } from "@/stores/routineStore";
import { useThemeStore } from "@/stores/themeStore";
import { backupFields, isRecord, matches } from "./backupSchema";

const stores = {
  checkIn: useCheckInStore,
  copingCards: useCopingCardsStore,
  crisis: useCrisisStore,
  routines: useRoutineStore,
  preferences: usePreferencesStore,
  theme: useThemeStore,
};
type Section = keyof typeof stores;
const sections = Object.keys(stores) as Section[];

type StoredState = { version: number; state: Record<string, unknown> };
type StorageEntry = [key: string, value: string];

const FORMAT = "tea-autonomia-backup";
const FORMAT_VERSION = 1;
export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
// Android AsyncStorage reads each value through a SQLite CursorWindow.
const MAX_ENTRY_BYTES = 1536 * 1024;
let restoring = false;

export class InvalidBackupError extends Error {}

function byteLength(text: string): number {
  let bytes = 0;
  for (const character of text) {
    const code = character.codePointAt(0)!;
    bytes += code <= 0x7f ? 1 : code <= 0x7ff ? 2 : code <= 0xffff ? 3 : 4;
  }
  return bytes;
}

function requireSize(text: string, maximum: number) {
  // Count UTF-8 bytes without a native Blob allocation or reliance on TextEncoder.
  if (text.length > maximum || byteLength(text) > maximum) throw new InvalidBackupError();
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new InvalidBackupError();
  }
}

function normalize(section: Section, value: unknown): StoredState {
  const store = stores[section];
  const options = store.persist.getOptions();
  const version = options.version ?? 0;
  if (!isRecord(value) || !isRecord(value.state)) throw new InvalidBackupError();
  const sourceVersion = value.version === undefined ? 0 : value.version;
  if (typeof sourceVersion !== "number" || !Number.isSafeInteger(sourceVersion) ||
    sourceVersion < 0 || sourceVersion > version) throw new InvalidBackupError();

  let migrated = value.state;
  if (sourceVersion < version && options.migrate) {
    try {
      const result = options.migrate(migrated, sourceVersion);
      if (!isRecord(result)) throw new InvalidBackupError();
      migrated = result;
    } catch {
      throw new InvalidBackupError();
    }
  }

  // Preferences v1 predates the language selector.
  if (section === "preferences" && migrated.language === undefined) {
    migrated = { ...migrated, language: "pt-BR" };
  }

  // Pick data fields so the backup cannot replace store methods.
  const fields = backupFields[section];
  const state = Object.fromEntries(Object.keys(fields).map((key) => [key, migrated[key]]));
  if (!matches(state, fields)) throw new InvalidBackupError();
  return { version, state };
}

export async function exportBackup(): Promise<string> {
  const keys = sections.map((section) => stores[section].persist.getOptions().name!);
  const saved = new Map(await AsyncStorage.multiGet(keys));
  const data = Object.fromEntries(sections.map((section, index) => {
    const store = stores[section];
    const raw = saved.get(keys[index]);
    const value = raw === null
      ? { version: store.persist.getOptions().version, state: store.getInitialState() }
      : parseJson(raw!);
    const normalized = normalize(section, value);
    requireSize(JSON.stringify(normalized), MAX_ENTRY_BYTES);
    return [section, normalized];
  }));
  const text = JSON.stringify({ format: FORMAT, version: FORMAT_VERSION, data });
  requireSize(text, MAX_BACKUP_BYTES);
  return text;
}

export function validateBackup(text: string): void {
  readBackup(text);
}

function readBackup(text: string): StorageEntry[] {
  requireSize(text, MAX_BACKUP_BYTES);
  const backup = parseJson(text);
  if (!isRecord(backup) || backup.format !== FORMAT || backup.version !== FORMAT_VERSION ||
    !isRecord(backup.data)) throw new InvalidBackupError();
  const data = backup.data;
  return sections.map((section) => {
    const serialized = JSON.stringify(normalize(section, data[section]));
    requireSize(serialized, MAX_ENTRY_BYTES);
    return [stores[section].persist.getOptions().name!, serialized];
  });
}

export async function restoreBackup(text: string): Promise<void> {
  if (restoring) throw new Error("Restore already in progress");
  const entries = readBackup(text);
  restoring = true;
  try {
    const previous = await AsyncStorage.multiGet(entries.map(([key]) => key));
    try {
      await AsyncStorage.multiSet(entries);
    } catch (error) {
      // Some platforms can report an error after applying part of a batch.
      const available: StorageEntry[] = [];
      const absent: string[] = [];
      for (const [key, value] of previous) {
        if (value === null) absent.push(key);
        else available.push([key, value]);
      }
      if (available.length) await AsyncStorage.multiSet(available);
      if (absent.length) await AsyncStorage.multiRemove(absent);
      throw error;
    }

    await Promise.all(sections.map(async (section) => {
      const { persist } = stores[section];
      await persist.rehydrate();
      if (!persist.hasHydrated()) throw new Error("Could not reload restored data");
    }));
  } finally {
    restoring = false;
  }
}
