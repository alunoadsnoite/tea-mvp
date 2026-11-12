import { DEFAULT_MESSAGES, type CrisisMessage } from "@/types/crisis";
import { DEFAULT_COPING_CARDS, type CopingCard } from "@/types/coping";
import { DEFAULT_ROUTINES, type Routine } from "@/types/routine";
import type { Translate } from "./i18n";

// Compare each field with its original value. Older installations may already
// have edits to built-in content, and those edits must be shown verbatim.
function builtInText(t: Translate, saved: string, original: string | undefined) {
  return saved === original ? t(saved) : saved;
}

export function localizeCrisisMessage(message: CrisisMessage, t: Translate): CrisisMessage {
  const original = message.isDefault && DEFAULT_MESSAGES.find(({ id }) => id === message.id);
  if (!original) return message;
  return {
    ...message,
    title: builtInText(t, message.title, original.title),
    content: builtInText(t, message.content, original.content),
  };
}

export function localizeCopingCard(card: CopingCard, t: Translate): CopingCard {
  const original = card.isDefault && DEFAULT_COPING_CARDS.find(({ id }) => id === card.id);
  if (!original) return card;
  return {
    ...card,
    title: builtInText(t, card.title, original.title),
    description: builtInText(t, card.description, original.description),
    steps: card.steps.map((step, index) => builtInText(t, step, original.steps[index])),
  };
}

export function localizeRoutine(routine: Routine, t: Translate): Routine {
  const original = routine.isDefault && DEFAULT_ROUTINES.find(({ id }) => id === routine.id);
  if (!original) return routine;
  return {
    ...routine,
    name: builtInText(t, routine.name, original.name),
    description: routine.description && builtInText(t, routine.description, original.description),
    steps: routine.steps.map((step) => {
      const originalStep = original.steps.find(({ id }) => id === step.id);
      return {
        ...step,
        title: builtInText(t, step.title, originalStep?.title),
        description: step.description && builtInText(t, step.description, originalStep?.description),
      };
    }),
  };
}
