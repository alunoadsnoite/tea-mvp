import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";
import { usePreferencesStore } from "@/stores/preferencesStore";

export function useReducedMotion() {
  // Sem movimento até conhecer a preferência do sistema e a preferência salva.
  const [systemReduced, setSystemReduced] = useState(true);
  const [hydrated, setHydrated] = useState(usePreferencesStore.persist.hasHydrated());
  const reduceMotion = usePreferencesStore((state) => state.reduceMotion);
  useEffect(() => {
    let active = true;
    let changed = false;
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", (value) => {
      changed = true;
      setSystemReduced(value);
    });
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active && !changed) setSystemReduced(value);
    }).catch(() => {});
    const unsubscribe = usePreferencesStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(usePreferencesStore.persist.hasHydrated());
    return () => { active = false; subscription.remove(); unsubscribe(); };
  }, []);
  return !hydrated || systemReduced || reduceMotion;
}
