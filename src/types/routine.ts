/**
 * Schema de dados — Rotinas Visuais Sequenciais
 * 
 * Estrutura para rotinas reutilizáveis e execução passo-a-passo.
 */

export interface RoutineStep {
  id: string;
  title: string;
  description?: string;
  estimatedMinutes: number; // Tempo estimado para o passo
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  steps: RoutineStep[];
  isDefault: boolean; // Rotinas pré-configuradas não podem ser excluídas
  createdAt: number;
}

export interface RoutineExecutionState {
  routineId: string;
  currentStepIndex: number;
  isRunning: boolean;
  isPaused: boolean;
  startedAt: number | null;
  completedAt: number | null;
  stepStartedAt: number | null;
  stepEndsAt: number | null; // Para o timer visual
  extendedMinutes: number; // Tempo extra adicionado
  /**
   * Momento em que a execução foi pausada. Usado para devolver ao relógio do
   * passo o tempo que passou enquanto pausado, evitando que a pausa consuma o
   * tempo que o usuário ganhou.
   */
  pausedAt: number | null;
}

// Rotinas pré-configuradas
export const DEFAULT_ROUTINES: Routine[] = [
  {
    id: "default-work",
    name: "Início de Expediente",
    description: "Preparação para começar o dia de trabalho",
    isDefault: true,
    createdAt: Date.now(),
    steps: [
      { id: "work-1", title: "Organizar mesa", description: "Limpar e organizar o espaço de trabalho", estimatedMinutes: 5 },
      { id: "work-2", title: "Ver lista de prioridades", description: "Revisar tarefas do dia", estimatedMinutes: 3 },
      { id: "work-3", title: "Checar e-mails", description: "Responder mensagens urgentes", estimatedMinutes: 15 },
    ],
  },
  {
    id: "default-debrief",
    name: "Descompressão Pós-Reunião",
    description: "Pausa para se recuperar após interações intensas",
    isDefault: true,
    createdAt: Date.now(),
    steps: [
      { id: "debrief-1", title: "Silenciar notificações", description: "Ativar modo não perturbe", estimatedMinutes: 1 },
      { id: "debrief-2", title: "Beber água", description: "Hidratar-se", estimatedMinutes: 2 },
      { id: "debrief-3", title: "Pausa silenciosa", description: "5 minutos em silêncio", estimatedMinutes: 5 },
    ],
  },
  {
    id: "default-leaving",
    name: "Preparação para Sair",
    description: "Verificação antes de sair de casa",
    isDefault: true,
    createdAt: Date.now(),
    steps: [
      { id: "leaving-1", title: "Checar chaves e carteira", description: "Verificar itens essenciais", estimatedMinutes: 2 },
      { id: "leaving-2", title: "Pegar fones de ouvido", description: "Para o trajeto", estimatedMinutes: 1 },
      { id: "leaving-3", title: "Verificar destino", description: "Confirmar rota e transporte", estimatedMinutes: 2 },
    ],
  },
];
