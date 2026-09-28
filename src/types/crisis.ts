/**
 * Schema de dados — Cartão de Comunicação de Crise
 * 
 * Estrutura local-first para funcionamento 100% offline.
 */

export interface CrisisMessage {
  id: string;
  title: string;
  content: string;
  isDefault: boolean; // Mensagens pré-configuradas não podem ser excluídas
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface CrisisCardState {
  messages: CrisisMessage[];
  contacts: EmergencyContact[];
  activeMessageId: string | null;
  isLoading: boolean;
  /** Contato preferido para ação rápida no cartão de crise (null = usar o primeiro da lista) */
  primaryContactId: string | null;
}

// Mensagens pré-configuradas (padrão)
export const DEFAULT_MESSAGES: CrisisMessage[] = [
  {
    id: "default-1",
    title: "Sou autista",
    content:
      "Estou em sobrecarga sensorial e temporariamente não-verbal. Preciso de alguns minutos em um local calmo.",
    isDefault: true,
  },
  {
    id: "default-2",
    title: "Por favor, evite",
    content:
      "Evite tocar em mim ou fazer sons altos. Não estou em perigo, apenas me autorregulando.",
    isDefault: true,
  },
];
