import english from "./en-US.json";
import spanish from "./es-ES.json";

export const LANGUAGES = [
  { code: "pt-BR", label: "Português (Brasil)" },
  { code: "en-US", label: "English" },
  { code: "es-ES", label: "Español" },
] as const;

export type Language = typeof LANGUAGES[number]["code"];
export type Translate = (message: string, ...values: (string | number)[]) => string;

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some(({ code }) => code === value);
}

function interpolate(message: string, ...values: (string | number)[]) {
  if (!values.length) return message;
  return message.replace(/\{(\d+)\}/g, (token, index) => String(values[Number(index)] ?? token));
}

function fromCatalog(catalog: Readonly<Partial<Record<string, string>>>): Translate {
  return (message, ...values) => {
    const localized = Object.prototype.hasOwnProperty.call(catalog, message) ? catalog[message] : undefined;
    return interpolate(localized ?? message, ...values);
  };
}

export const translate: Record<Language, Translate> = {
  "pt-BR": interpolate,
  "en-US": fromCatalog(english),
  "es-ES": fromCatalog(spanish),
};
