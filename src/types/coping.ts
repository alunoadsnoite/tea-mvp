/**
 * Schema de dados — Central de Cartões de Regulação
 * 
 * Estrutura para coping cards e exercícios de respiração.
 */

export type CopingCardCategory = "grounding" | "breathing" | "custom";

export interface CopingCard {
  id: string;
  title: string;
  description: string;
  category: CopingCardCategory;
  steps: string[];
  isDefault: boolean; // Cartões pré-configurados não podem ser excluídos
  isFavorite: boolean;
  createdAt: number;
}

export interface BreathingExerciseConfig {
  id: string;
  name: string;
  description: string;
  // Padrão de respiração em segundos: [inspirar, segurar, expirar, segurar]
  // Exercícios com 3 fases repetem o último valor para manter o ciclo
  pattern: [number, number, number, number];
  cycles: number;
}

// Exercícios de respiração pré-configurados
export const BREATHING_EXERCISES: BreathingExerciseConfig[] = [
  {
    id: "box-4-4-4-4",
    name: "Respiração em Caixa",
    description: "Técnica 4-4-4-4 para equilíbrio e foco",
    pattern: [4, 4, 4, 4],
    cycles: 4,
  },
  {
    id: "relaxing-4-7-8",
    name: "Respiração Relaxante",
    description: "Técnica 4-7-8 para acalmar o sistema nervoso",
    pattern: [4, 7, 8, 0],
    cycles: 3,
  },
];

// Cartões de coping pré-configurados
export const DEFAULT_COPING_CARDS: CopingCard[] = [
  {
    id: "default-grounding-5-4-3-2-1",
    title: "Ancoragem 5-4-3-2-1",
    description: "Exercício de grounding para retornar ao momento presente",
    category: "grounding",
    isDefault: true,
    isFavorite: false,
    createdAt: Date.now(),
    steps: [
      "Observe 5 coisas que você pode ver ao redor",
      "Toque 4 coisas e sinta sua textura",
      "Identifique 3 sons que você pode ouvir",
      "Perceba 2 cheiros no ambiente",
      "Sinta 1 sabor ou toque algo com a boca",
    ],
  },
  {
    id: "default-grounding-cold-water",
    title: "Água Fria",
    description: "Estímulo físico rápido para interromper a sobrecarga",
    category: "grounding",
    isDefault: true,
    isFavorite: false,
    createdAt: Date.now(),
    steps: [
      "Vá até o banheiro",
      "Lave o rosto com água fria",
      "Segure as mãos sob a água por 30 segundos",
      "Respire enquanto sente a temperatura",
      "Observe como seu corpo responde",
    ],
  },
  {
    id: "default-custom-headphones",
    title: "Fones com Cancelamento",
    description: "Bloqueio sensorial imediato",
    category: "custom",
    isDefault: true,
    isFavorite: false,
    createdAt: Date.now(),
    steps: [
      "Pegue seus fones de ouvido com cancelamento de ruído",
      "Coloque-os confortavelmente",
      "Ative o cancelamento de ruído",
      "Respire fundo 3 vezes",
      "Permaneça em silêncio por 5 minutos",
    ],
  },
  {
    id: "default-custom-water",
    title: "Beber Água em Silêncio",
    description: "Pausa sensorial simples e hidratação",
    category: "custom",
    isDefault: true,
    isFavorite: false,
    createdAt: Date.now(),
    steps: [
      "Pegue um copo de água",
      "Sente-se em um lugar tranquilo",
      "Beba devagar, sem pressa",
      "Foque na temperatura e no sabor",
      "Não faça nada mais durante esse tempo",
    ],
  },
];
