import english from "./en-US.json";

export const LANGUAGES = [
  { code: "pt-BR", label: "Português (Brasil)" },
  { code: "en-US", label: "English" },
] as const;

export type Language = typeof LANGUAGES[number]["code"];
export type Translate = (message: string, ...values: (string | number)[]) => string;

const messages: Readonly<Partial<Record<string, string>>> = english;

function interpolate(message: string, values: (string | number)[]) {
  if (!values.length) return message;
  return message.replace(/\{(\d+)\}/g, (token, index) => String(values[Number(index)] ?? token));
}

export const translate: Record<Language, Translate> = {
  "pt-BR": (message, ...values) => interpolate(message, values),
  "en-US": (message, ...values) => interpolate(
    Object.prototype.hasOwnProperty.call(messages, message) ? messages[message] ?? message : message,
    values
  ),
};
