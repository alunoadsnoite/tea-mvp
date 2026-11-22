import { isProEdition } from "./edition";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { exportBackup, InvalidBackupError, MAX_BACKUP_BYTES } from "./backup";

const MIME_TYPE = "application/json";
const { StorageAccessFramework } = FileSystem;

function removeTemporaryFile(uri: string) {
  return FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
}

export async function selectBackupFile(): Promise<string | null> {
  const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
  if (result.canceled) return null;
  const [file] = result.assets;
  try {
    const info = await FileSystem.getInfoAsync(file.uri);
    if (!info.exists || info.isDirectory || info.size > MAX_BACKUP_BYTES) {
      throw new InvalidBackupError();
    }
    return await FileSystem.readAsStringAsync(file.uri);
  } finally {
    await removeTemporaryFile(file.uri);
  }
}

export async function saveBackupFile(): Promise<"saved" | "shared" | "canceled"> {
  const contents = await exportBackup();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${isProEdition ? "tea-passos" : "tea-autonomia"}-${timestamp}`;

  if (Platform.OS === "android") {
    const folder = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!folder.granted) return "canceled";
    const uri = await StorageAccessFramework.createFileAsync(folder.directoryUri, fileName, MIME_TYPE);
    try {
      await StorageAccessFramework.writeAsStringAsync(uri, contents);
    } catch (error) {
      await removeTemporaryFile(uri);
      throw error;
    }
    return "saved";
  }

  if (!FileSystem.cacheDirectory || !await Sharing.isAvailableAsync()) {
    throw new Error("File sharing unavailable");
  }
  const uri = `${FileSystem.cacheDirectory}${fileName}.json`;
  try {
    await FileSystem.writeAsStringAsync(uri, contents);
    await Sharing.shareAsync(uri, { mimeType: MIME_TYPE, UTI: "public.json" });
    return "shared";
  } finally {
    await removeTemporaryFile(uri);
  }
}
