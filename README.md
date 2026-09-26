# TEA Autonomia — MVP

Aplicativo móvel para adultos no Espectro Autista (TEA) focado em **autonomia, previsibilidade e gerenciamento de sobrecarga sensorial e crises**.

## Principais Funcionalidades

### 1. Cartão de Comunicação de Crise
- Acesso instantâneo em 1 toque na Home ou pelo botão flutuante
- Mensagens pré-configuradas personalizáveis
- Contatos de emergência (ligar/mensagem)
- Funcionalidade 100% offline
- Modo cheio e alto contraste

### 2. Check-in de Bateria Social & Interocepção
- Registro rápido (menos de 10 segundos)
- Bateria Social (0-100%)
- Carga Sensorial (0-5)
- Energia Física (0-5)
- Gatilhos rápidos selecionáveis
- Sugestões automáticas de regulação
- Histórico dos últimos 7 dias

### 3. Rotinas Visuais Sequenciais
- Execução passo-a-passo (uma tarefa por vez)
- Timer visual suave (sem números estressantes)
- Rotinas pré-configuráveis e personalizáveis
- Pausa e extensão de tempo sem penalidade

### 4. Central de Cartões de Regulação (Coping Cards)
- Exercício de Ancoragem 5-4-3-2-1
- Respiração Guiada (4-4-4-4 e 4-7-8)
- Cartões personalizados
- Favoritos e categorias

## Stack Tecnológica

- **Frontend**: React Native + Expo + TypeScript
- **Estilização**: Tailwind CSS (NativeWind)
- **Estado**: Zustand + AsyncStorage (offline-first)
- **Navegação**: Expo Router
- **Build**: EAS Build / Gradle

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npx expo start

# Build Android (APK)
npx eas build -p android --profile preview

# Build local
cd android && ./gradlew assembleDebug
```

## Estrutura do Projeto

```
src/
├── app/                    # Telas (Expo Router)
│   ├── _layout.tsx         # Layout raiz + FAB
│   ├── index.tsx           # Home
│   ├── crisis-card.tsx     # Cartão de Crise
│   ├── crisis-settings.tsx # Configurações do Cartão
│   ├── interception.tsx    # Check-in
│   ├── checkin-history.tsx # Histórico
│   ├── routines.tsx        # Lista de Rotinas
│   ├── routine-execution.tsx # Execução
│   ├── regulation.tsx      # Cartões de Regulação
│   ├── breathing-guide.tsx # Respiração Guiada
│   └── coping-card/        # Detalhe do Cartão
├── components/             # Componentes reutilizáveis
├── features/               # Features modulares
├── hooks/                  # Custom hooks
├── lib/                    # Utilitários
├── services/               # Serviços (API, etc)
├── stores/                 # Stores Zustand
├── types/                  # Schemas TypeScript
└── constants/              # Constantes
```

## Princípios de UX Neurodivergente

- **Dark mode por padrão**: Reduz fadiga visual
- **Baixa carga cognitiva**: Uma ação principal por tela
- **Sem cores agressivas**: Paleta pastel suave
- **Sem animações piscantes**: Apenas transições suaves
- **Sem alertas vermelhos**: Notificações discretas
- **Tipografia legível**: Contraste WCAG AA
- **Espaçamento generoso**: Respiro visual

## Widgets

- **iOS**: WidgetKit (pasta `ios/TEAWidget/`)
- **Android**: AppWidgetProvider (pasta `android/`)

## Licença

MIT
