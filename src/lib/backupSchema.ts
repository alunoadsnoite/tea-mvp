import { isLanguage } from "@/lib/i18n";

type Validator = (value: unknown) => boolean;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const string: Validator = (value) => typeof value === "string";
const boolean: Validator = (value) => typeof value === "boolean";
const number: Validator = (value) => typeof value === "number" && Number.isFinite(value);
const optional = (validate: Validator): Validator => (value) => value === undefined || validate(value);
const nullable = (validate: Validator): Validator => (value) => value === null || validate(value);
const oneOf = (...choices: string[]): Validator => (value) =>
  typeof value === "string" && choices.includes(value);
const array = (validate: Validator): Validator => (value) => Array.isArray(value) && value.every(validate);
const range = (max: number): Validator => (value) =>
  typeof value === "number" && value >= 0 && value <= max;

export function matches(value: unknown, fields: Record<string, Validator>): value is Record<string, unknown> {
  return isRecord(value) && Object.entries(fields).every(([key, validate]) => validate(value[key]));
}

const step: Validator = (value) => matches(value, {
  id: string,
  title: string,
  description: optional(string),
  estimatedMinutes: (minutes) => typeof minutes === "number" && Number.isFinite(minutes) && minutes >= 0,
});

const routine: Validator = (value) => matches(value, {
  id: string,
  name: string,
  description: optional(string),
  steps: array(step),
  isDefault: boolean,
  createdAt: number,
});

const execution: Validator = (value) => matches(value, {
  routineId: string,
  currentStepIndex: (index) => typeof index === "number" && Number.isSafeInteger(index) && index >= 0,
  isPaused: boolean,
  completedAt: nullable(number),
  stepStartedAt: nullable(number),
  stepEndsAt: nullable(number),
  pausedAt: nullable(number),
});

const checkIn: Validator = (value) => matches(value, {
  id: string,
  timestamp: number,
  socialBattery: range(100),
  sensoryLoad: range(5),
  physicalEnergy: range(5),
  triggers: array(string),
});

const card: Validator = (value) => matches(value, {
  id: string,
  title: string,
  description: string,
  category: oneOf("grounding", "breathing", "custom"),
  steps: array(string),
  isDefault: boolean,
  isFavorite: boolean,
  createdAt: number,
});

const message: Validator = (value) => matches(value, {
  id: string,
  title: string,
  content: string,
  hidden: optional(boolean),
  isDefault: boolean,
});

const contact: Validator = (value) => matches(value, {
  id: string,
  name: string,
  phone: string,
  relationship: string,
});

export const backupFields = {
  checkIn: { entries: array(checkIn) },
  copingCards: { cards: array(card) },
  crisis: {
    messages: array(message),
    contacts: array(contact),
    activeMessageId: nullable(string),
    primaryContactId: nullable(string),
  },
  routines: { routines: array(routine), execution: nullable(execution) },
  preferences: {
    language: isLanguage,
    hapticsEnabled: boolean,
    reduceMotion: boolean,
    showNextStep: boolean,
    largerText: boolean,
    favoritesFirstView: boolean,
  },
  theme: { mode: oneOf("auto", "dark", "light") },
};

const planItem: Validator = (value) => matches(value, {
  id: string,
  text: string,
  done: boolean,
});

export const eventPlanFields = {
  plans: array((value) => matches(value, {
    id: string,
    title: string,
    date: string,
    preparation: array(planItem),
    objects: array(planItem),
    alternatives: string,
  })),
};
