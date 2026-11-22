import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createId } from "@/lib/id";

export interface PlanItem {
  id: string;
  text: string;
  done: boolean;
}

export interface EventPlan {
  id: string;
  title: string;
  date: string;
  preparation: PlanItem[];
  objects: PlanItem[];
  alternatives: string;
}

export type PlanList = "preparation" | "objects";
export type PlanDraft = Omit<EventPlan, "id">;

export function editPlanItems(lines: string, previous: PlanItem[]): PlanItem[] {
  const remaining = [...previous];
  return lines.split("\n").map((line) => line.trim()).filter(Boolean).map((text) => {
    const index = remaining.findIndex((item) => item.text === text);
    if (index >= 0) return remaining.splice(index, 1)[0];
    return { id: createId("item"), text, done: false };
  });
}

interface EventPlanStore {
  plans: EventPlan[];
  save: (draft: PlanDraft, id?: string) => string | undefined;
  remove: (id: string) => void;
  toggle: (id: string, list: PlanList, itemId: string) => void;
}

export const useEventPlanStore = create<EventPlanStore>()(
  persist(
    (set) => ({
      plans: [],
      save: (draft, id) => {
        const title = draft.title.trim();
        if (!title) return undefined;
        const plan = { ...draft, title, id: id ?? createId("event") };
        set(({ plans }) => ({
          plans: id ? plans.map((existing) => existing.id === id ? plan : existing) : [plan, ...plans],
        }));
        return plan.id;
      },
      remove: (id) => set(({ plans }) => ({ plans: plans.filter((plan) => plan.id !== id) })),
      toggle: (id, list, itemId) => set(({ plans }) => ({
        plans: plans.map((plan) => plan.id !== id ? plan : {
          ...plan,
          [list]: plan[list].map((item) => item.id !== itemId ? item : { ...item, done: !item.done }),
        }),
      })),
    }),
    {
      name: "event-plans-storage",
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ plans }) => ({ plans }),
    }
  )
);

let loading: Promise<void> | undefined;
export function loadEventPlans(): Promise<void> {
  loading ??= Promise.resolve(useEventPlanStore.persist.rehydrate()).then(() => {
    if (!useEventPlanStore.persist.hasHydrated()) throw new Error("Could not load event plans");
  }).finally(() => { loading = undefined; });
  return loading;
}
