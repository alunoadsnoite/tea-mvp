import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

const mimeType = "application/pdf";
const { StorageAccessFramework } = FileSystem;

function discardFile(uri: string) {
  return FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
}

export async function shareReport(html: string): Promise<boolean> {
  const android = Platform.OS === "android";
  const folder = android ? await StorageAccessFramework.requestDirectoryPermissionsAsync() : null;
  if (folder && !folder.granted) return false;
  if (!android && !await Sharing.isAvailableAsync()) throw new Error("File sharing unavailable");

  const { uri } = await Print.printToFileAsync({ html });
  try {
    if (folder?.granted) {
      const base64 = { encoding: FileSystem.EncodingType.Base64 };
      const contents = await FileSystem.readAsStringAsync(uri, base64);
      const filename = `tea-autonomia-relatorio-${new Date().toISOString().replace(/[:.]/g, "-")}`;
      const target = await StorageAccessFramework.createFileAsync(folder.directoryUri, filename, mimeType);
      try {
        await StorageAccessFramework.writeAsStringAsync(target, contents, base64);
      } catch (error) {
        await discardFile(target);
        throw error;
      }
      return true;
    }
    await Sharing.shareAsync(uri, { mimeType, UTI: "com.adobe.pdf" });
    return false;
  } finally {
    await discardFile(uri);
  }
}
