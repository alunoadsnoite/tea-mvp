/**
 * Schema de dados — Check-in de Bateria Social & Interocepção
 * 
 * Registro rápido com mínimo de esforço cognitivo.
 */

export interface CheckInEntry {
  id: string;
  timestamp: number;
  
  // Níveis (0-5 para sensorial/energia, 0-100 para bateria social)
  socialBattery: number;      // 0% a 100% — disposição para interação
  sensoryLoad: number;        // 0 a 5 — desconforto sensorial
  physicalEnergy: number;     // 0 a 5 — disposição física
  
  // Gatilhos selecionados
  triggers: string[];
}

// Gatilhos pré-definidos
export const COMMON_TRIGGERS = [
  "Reunião longa",
  "Barulho de trânsito",
  "Luz fluorescente",
  "Pouco sono",
  "Socialização",
  "Mudança de rotina",
  "Ambiente cheio",
  "Conflito interpessoal",
] as const;

// Sugestões de autorregulação baseadas nos níveis
export interface RegulationSuggestion {
  condition: (entry: Omit<CheckInEntry, "id" | "timestamp">) => boolean;
  message: string;
}

export const REGULATION_SUGGESTIONS: RegulationSuggestion[] = [
  {
    condition: (entry) => entry.sensoryLoad >= 4,
    message:
      "Sua carga sensorial está alta. Considere fones com cancelamento de ruído ou um momento em ambiente mais silencioso.",
  },
  {
    condition: (entry) => entry.socialBattery <= 20,
    message:
      "Sua bateria social está baixa. É okay adiar conversas ou pedir um tempo sozinho.",
  },
  {
    condition: (entry) => entry.physicalEnergy <= 1,
    message:
      "Sua energia física está muito baixa. Hidratar-se e fazer uma pausa curta podem ajudar.",
  },
  {
    condition: (entry) => entry.sensoryLoad >= 3 && entry.socialBattery <= 30,
    message:
      "Você parece estar em sobrecarga combinada. Um ambiente calmo e previsível pode ajudar na regulação.",
  },
];
