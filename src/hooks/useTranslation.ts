import { usePreferencesStore } from "@/stores/preferencesStore";
import { translate } from "@/lib/i18n";

export function useTranslation() {
  const language = usePreferencesStore((state) => state.language);
  return { language, t: translate[language] };
}
