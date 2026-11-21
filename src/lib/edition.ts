import Constants from "expo-constants";

export const isProEdition = Constants.expoConfig?.extra?.edition === "pro";
