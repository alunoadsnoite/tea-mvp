import type { Language, Translate } from "@/lib/i18n";
import { summarizeSensoryHistory } from "@/lib/sensoryHistory";
import type { CheckInEntry } from "@/types/checkin";

export function reportSummary(entries: CheckInEntry[], t: Translate) {
  const { highLoadCount, topTriggers } = summarizeSensoryHistory(entries);
  return [
    t("Carga sensorial de 4 ou 5 em {0} de {1} registros.", highLoadCount, entries.length),
    ...topTriggers.map(({ trigger, count }) => t("{0} em {1} de {2} registros.", t(trigger), count, entries.length)),
  ];
}

export function reportRows(entries: CheckInEntry[], language: Language) {
  const days = new Map<string, CheckInEntry[]>();
  for (const entry of entries) {
    const day = new Date(entry.timestamp).toLocaleDateString(language);
    const grouped = days.get(day) ?? [];
    grouped.push(entry);
    days.set(day, grouped);
  }

  return Array.from(days, ([day, grouped]) => {
    const average = (metric: "socialBattery" | "sensoryLoad" | "physicalEnergy") =>
      (grouped.reduce((sum, entry) => sum + entry[metric], 0) / grouped.length)
        .toLocaleString(language, { maximumFractionDigits: 1 });
    return [day, `${average("socialBattery")}%`, `${average("sensoryLoad")}/5`, `${average("physicalEnergy")}/5`];
  });
}

function escapeHtml(text: string) {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return text.replace(/[&<>"']/g, (character) => entities[character]);
}

export function reportHtml(title: string, period: string, summary: string[], headers: string[], rows: string[][], language: Language) {
  const cells = (row: string[], tag: "td" | "th") =>
    row.map((value) => `<${tag}>${escapeHtml(value)}</${tag}>`).join("");
  return `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><style>
body { font: 16px sans-serif; color: #171717; padding: 24px; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #777; text-align: left; padding: 8px; }
tr { break-inside: avoid; }
</style></head><body>
<h1>${escapeHtml(title)}</h1><p>${escapeHtml(period)}</p>
${summary.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
<table><thead><tr>${cells(headers, "th")}</tr></thead><tbody>
${rows.map((row) => `<tr>${cells(row, "td")}</tr>`).join("")}
</tbody></table></body></html>`;
}
