import type { Routine } from "@/types/routine";

export const EVENT_TEMPLATES = [
  { title: "Ir ao mercado", preparation: "Preparar a lista de compras\nEscolher um horário confortável\nDefinir como chegar e voltar", objects: "Lista de compras\nForma de pagamento\nSacola", alternatives: "Se estiver cheio, posso esperar em um local mais tranquilo ou voltar em outro horário." },
  { title: "Ir a uma consulta", preparation: "Confirmar horário e endereço\nAnotar o que quero perguntar\nPlanejar o deslocamento", objects: "Documento\nAnotações\nExames solicitados", alternatives: "Se houver atraso, posso perguntar sobre a espera e pedir um local mais tranquilo." },
  { title: "Começar a estudar", preparation: "Escolher um assunto\nSeparar o material\nAbrir a primeira atividade\nFazer uma pequena parte", objects: "Material de estudo\nÁgua", alternatives: "Se estiver difícil, posso escolher uma tarefa menor ou fazer uma pausa." },
  {"title": "Ir ao dentista", "preparation": "Confirmar horário e endereço\nAnotar dúvidas e sensibilidades que quero comunicar\nCombinar um sinal para pedir pausa", "objects": "Documento\nExames solicitados", "alternatives": "Se eu precisar de uma pausa, posso usar o sinal combinado e conversar sobre como continuar."},
  {"title": "Participar de uma entrevista", "preparation": "Revisar a vaga e preparar perguntas\nConfirmar local ou link da entrevista\nTestar o trajeto ou a conexão", "objects": "Currículo\nAnotações\nContato da pessoa responsável", "alternatives": "Se eu não entender uma pergunta, posso pedir que seja repetida ou reformulada."},
  {"title": "Resolver algo no banco ou serviço público", "preparation": "Confirmar os documentos necessários\nVerificar se preciso agendar\nAnotar o que preciso resolver", "objects": "Documentos solicitados\nComprovante de agendamento, se houver", "alternatives": "Se faltar um documento, posso pedir uma lista por escrito e planejar o retorno."},
  {"title": "Ir a um encontro de família", "preparation": "Combinar horário de chegada e saída\nIdentificar um lugar para fazer uma pausa\nPlanejar como voltar para casa", "objects": "Fones ou outro recurso de conforto\nÁgua", "alternatives": "Se o ambiente ficar intenso, posso fazer uma pausa ou sair conforme o combinado."},
  {"title": "Preparar uma viagem", "preparation": "Confirmar transporte e hospedagem\nConferir horários e documentos\nPreparar bagagem e itens de conforto", "objects": "Documento\nBilhetes ou reservas\nCarregador", "alternatives": "Se houver cancelamento ou atraso, posso buscar informações no atendimento e avisar meu contato de apoio."},
  {"title": "Usar transporte público", "preparation": "Conferir linha, destino e ponto de embarque\nSeparar passagem ou cartão de transporte\nIdentificar onde vou descer", "objects": "Cartão de transporte ou passagem\nRota salva para consultar offline", "alternatives": "Se eu perder a parada, posso consultar a rota em um lugar seguro e reorganizar o trajeto."},
  {"title": "Começar um curso presencial", "preparation": "Confirmar sala, horário e acesso ao local\nSeparar material para a primeira aula\nAnotar a quem posso pedir informações", "objects": "Material de estudo\nÁgua", "alternatives": "Se a sala ou o horário mudar, posso confirmar as informações com a equipe antes de continuar."},
  {"title": "Ir a um restaurante", "preparation": "Consultar o cardápio, se disponível\nEscolher um horário e um lugar confortável\nPlanejar como comunicar meu pedido", "objects": "Forma de pagamento\nFones ou outro recurso de conforto", "alternatives": "Se o ambiente estiver desconfortável, posso pedir outra mesa, levar a comida ou escolher outro local."},
] as const;

export const PRO_ROUTINE_TEMPLATES: Routine[] = [
  {
    "id": "pro-example-morning",
    "name": "Começar a manhã",
    "description": "Uma preparação simples para o início do dia.",
    "isDefault": false,
    "createdAt": 0,
    "steps": [
      {
        "id": "morning-0",
        "title": "Beber água",
        "estimatedMinutes": 2
      },
      {
        "id": "morning-1",
        "title": "Cuidar da higiene",
        "estimatedMinutes": 10
      },
      {
        "id": "morning-2",
        "title": "Escolher uma roupa confortável",
        "estimatedMinutes": 5
      },
      {
        "id": "morning-3",
        "title": "Ver o primeiro compromisso",
        "estimatedMinutes": 2
      }
    ]
  },
  {
    "id": "pro-example-meal",
    "name": "Preparar uma refeição simples",
    "description": "Organizar o preparo de uma refeição que você já sabe fazer.",
    "isDefault": false,
    "createdAt": 0,
    "steps": [
      {
        "id": "meal-0",
        "title": "Escolher o que vou preparar",
        "estimatedMinutes": 3
      },
      {
        "id": "meal-1",
        "title": "Separar ingredientes e utensílios",
        "estimatedMinutes": 5
      },
      {
        "id": "meal-2",
        "title": "Preparar seguindo a receita",
        "estimatedMinutes": 20
      },
      {
        "id": "meal-3",
        "title": "Conferir se fogão e aparelhos estão desligados",
        "estimatedMinutes": 2
      }
    ]
  },
  {
    "id": "pro-example-tidy",
    "name": "Organizar um espaço da casa",
    "description": "Escolha apenas um espaço pequeno para começar.",
    "isDefault": false,
    "createdAt": 0,
    "steps": [
      {
        "id": "tidy-0",
        "title": "Escolher uma superfície",
        "estimatedMinutes": 1
      },
      {
        "id": "tidy-1",
        "title": "Separar o que é lixo",
        "estimatedMinutes": 3
      },
      {
        "id": "tidy-2",
        "title": "Guardar os objetos no lugar",
        "estimatedMinutes": 5
      },
      {
        "id": "tidy-3",
        "title": "Limpar a superfície",
        "estimatedMinutes": 3
      }
    ]
  },
  {
    "id": "pro-example-laundry",
    "name": "Lavar roupas",
    "description": "Dividir a lavagem de roupas em etapas.",
    "isDefault": false,
    "createdAt": 0,
    "steps": [
      {
        "id": "laundry-0",
        "title": "Separar roupas conforme as etiquetas",
        "estimatedMinutes": 5
      },
      {
        "id": "laundry-1",
        "title": "Colocar roupas e produto na máquina",
        "estimatedMinutes": 3
      },
      {
        "id": "laundry-2",
        "title": "Escolher o ciclo e iniciar",
        "estimatedMinutes": 1
      },
      {
        "id": "laundry-3",
        "title": "Ao terminar, retirar e estender as roupas",
        "estimatedMinutes": 10
      }
    ]
  },
  {
    "id": "pro-example-study",
    "name": "Preparar uma sessão de estudo",
    "description": "Um começo pequeno, com uma tarefa de cada vez.",
    "isDefault": false,
    "createdAt": 0,
    "steps": [
      {
        "id": "study-0",
        "title": "Escolher uma tarefa pequena",
        "estimatedMinutes": 2
      },
      {
        "id": "study-1",
        "title": "Separar o material",
        "estimatedMinutes": 3
      },
      {
        "id": "study-2",
        "title": "Fazer a primeira parte",
        "estimatedMinutes": 10
      },
      {
        "id": "study-3",
        "title": "Anotar de onde continuar",
        "estimatedMinutes": 2
      }
    ]
  },
  {
    "id": "pro-example-sleep",
    "name": "Preparar o sono",
    "description": "Adapte os passos e os tempos à sua noite.",
    "isDefault": false,
    "createdAt": 0,
    "steps": [
      {
        "id": "sleep-0",
        "title": "Diminuir estímulos do ambiente",
        "estimatedMinutes": 2
      },
      {
        "id": "sleep-1",
        "title": "Fazer a higiene da noite",
        "estimatedMinutes": 10
      },
      {
        "id": "sleep-2",
        "title": "Separar o necessário para amanhã",
        "estimatedMinutes": 5
      },
      {
        "id": "sleep-3",
        "title": "Escolher uma atividade tranquila",
        "estimatedMinutes": 10
      }
    ]
  },
  {
    "id": "pro-example-exercise",
    "name": "Preparar uma atividade física",
    "description": "Organizar o necessário para uma atividade que você já pratica.",
    "isDefault": false,
    "createdAt": 0,
    "steps": [
      {
        "id": "exercise-0",
        "title": "Escolher a atividade e o local",
        "estimatedMinutes": 2
      },
      {
        "id": "exercise-1",
        "title": "Separar roupa e calçado",
        "estimatedMinutes": 5
      },
      {
        "id": "exercise-2",
        "title": "Preparar água e itens pessoais",
        "estimatedMinutes": 3
      },
      {
        "id": "exercise-3",
        "title": "Conferir trajeto e horário",
        "estimatedMinutes": 2
      }
    ]
  },
  {
    "id": "pro-example-home",
    "name": "Chegar em casa e fazer uma pausa",
    "description": "Uma transição após trabalho, estudo ou deslocamento.",
    "isDefault": false,
    "createdAt": 0,
    "steps": [
      {
        "id": "home-0",
        "title": "Guardar os itens que trouxe",
        "estimatedMinutes": 3
      },
      {
        "id": "home-1",
        "title": "Beber água",
        "estimatedMinutes": 2
      },
      {
        "id": "home-2",
        "title": "Buscar um ambiente confortável",
        "estimatedMinutes": 2
      },
      {
        "id": "home-3",
        "title": "Escolher se quero silêncio ou outra forma de descanso",
        "estimatedMinutes": 10
      }
    ]
  }
];
