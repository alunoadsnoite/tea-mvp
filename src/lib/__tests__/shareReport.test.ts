import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { Platform } from "react-native";
import { shareReport } from "@/lib/shareReport";

jest.mock("expo-print", () => ({ printToFileAsync: jest.fn() }));
jest.mock("expo-file-system", () => ({
  EncodingType: { Base64: "base64" },
  deleteAsync: jest.fn().mockResolvedValue(undefined),
  readAsStringAsync: jest.fn(),
  StorageAccessFramework: {
    requestDirectoryPermissionsAsync: jest.fn(),
    createFileAsync: jest.fn(),
    writeAsStringAsync: jest.fn(),
  },
}));

const folder = FileSystem.StorageAccessFramework;
const generated = "file:///cache/output.pdf";
const target = "content://files/output.pdf";

beforeEach(() => {
  jest.clearAllMocks();
  jest.replaceProperty(Platform, "OS", "android");
  jest.mocked(Print.printToFileAsync).mockResolvedValue({ uri: generated, numberOfPages: 1 });
  jest.mocked(folder.requestDirectoryPermissionsAsync).mockResolvedValue({ granted: true, directoryUri: "content://files" });
  jest.mocked(folder.createFileAsync).mockResolvedValue(target);
  jest.mocked(FileSystem.readAsStringAsync).mockResolvedValue("cGRm");
});

afterEach(() => jest.restoreAllMocks());

it("exports the generated PDF into the user-selected Android folder", async () => {
  await expect(shareReport("<h1>Relatório</h1>")).resolves.toBe(true);
  expect(folder.createFileAsync).toHaveBeenCalledWith("content://files", expect.stringMatching(/^tea-autonomia-relatorio-/), "application/pdf");
  expect(folder.writeAsStringAsync).toHaveBeenCalledWith(target, "cGRm", { encoding: "base64" });
  expect(FileSystem.deleteAsync).toHaveBeenCalledWith(generated, { idempotent: true });
  expect(FileSystem.deleteAsync).not.toHaveBeenCalledWith(target, expect.anything());
});

it("does not generate a PDF when the Android picker is canceled", async () => {
  jest.mocked(folder.requestDirectoryPermissionsAsync).mockResolvedValue({ granted: false });
  await expect(shareReport("<h1>Relatório</h1>")).resolves.toBe(false);
  expect(Print.printToFileAsync).not.toHaveBeenCalled();
});
