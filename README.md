# TEA Autonomia — MVP

Aplicativo móvel para adultos no Espectro Autista (TEA) focado em **autonomia, previsibilidade e gerenciamento de sobrecarga sensorial e crises**.

## Versão Atual: 1.0.7

### Changelog

#### v1.0.7 (2026-10-02)
- **Widget do Cartão de Crise no Android** — as fontes do widget (`widget/android/`), que o config plugin `plugins/withCrisisWidget.js` copia a cada `expo prebuild`, estavam ausentes do repositório: o plugin era registrado em `app.json` mas quebrava o prebuild com `ENOENT`. Agora o `CrisisWidgetProvider.kt`, o layout, o drawable de fundo, o `appwidget-provider` e as cores/strings existem versionados, e um toque no widget abre `/crisis-card` pelo deep link `tea://crisis-card`
- **Acessibilidade do widget** — `contentDescription` no elemento raiz e cores com contraste de 13.5:1 (título) e 8.3:1 (legenda), espelhando `src/constants/theme.ts`. O widget é estático e não expõe contatos nem mensagens
- **`versionCode` 7** — `android/app/build.gradle` e `app.json` volta a ter o mesmo `versionCode`, corrigindo o dessincronismo introduzido na v1.0.6 (5 no `app.json`, 6 no Gradle)

#### v1.0.6 (2026-10-01)
- **Acessibilidade: botão SOS centralizado** — o botão flutuante sai do canto direito e passa ao centro da tela, facilitando o alcance para destros e canhotos
- **Cartão de crise: instrução de deslize acima das mensagens** — "Deslize para ver mais mensagens" aparece antes das mensagens, e não depois dos botões de emergência
- **Correção: Cartão de crise** — as mensagens eram exibidas deslocadas para a direita e cortadas na borda. As páginas do carrossel usavam a largura total da tela em vez da área visível (o container tem `paddingHorizontal: 24`); agora a largura real da viewport é medida via `onLayout` e usada tanto nas páginas quanto no cálculo da paginação, que também estava dessincronizada
- **Cartão de crise: bloco de texto centralizado** — a coluna ficou centralizada na tela, com margens laterais simétricas e `maxWidth: 560` para não esticar em paisagem/tablet. O texto em si permanece alinhado à esquerda dentro do bloco
- **Cartão de crise: grupo posicionado mais alto** — `paddingTop` reduzido de 60 para 24 e `ScrollView` com `flex: 1`, alinhando o layout ao do app infantil

#### v1.0.5 (2026-09-28)
- **Contato primário de emergência**: Permite escolher qual contato usar no cartão de crise
- **Criação de rotinas personalizadas**: Nova tela para criar rotinas com passos e tempo estimado
- **Criação de cartões de coping personalizados**: Nova tela para criar cartões com título, descrição, categoria e passos
- **Ícone atualizado**: Usa a imagem peca.png como ícone do app
- **Font scale em todas as telas**: Ajuste de fonte aplicado em home, check-in, configurações do cartão e configurações do app
- **Respiração guiada reage à rotação**: Agora usa useWindowDimensions para se adaptar à orientação
- **Contato do desenvolvedor**: Seção com e-mail (valdenorsa@proton.me) nas configurações do app e nas configurações do cartão de crise
- **Error boundary**: Tela de recuperação para erros inesperados
- **Retenção de histórico**: Check-ins mantêm apenas entradas dos últimos dias (limite configurável)
- **Acesso rápido a novos cartões**: Botão "Novo cartão personalizado" na tela de estratégias de calma
- **Feedback háptico**: Vibração suave em botões de emergência e seleções
- **Fonte ajustável**: Respeita configurações de acessibilidade do sistema (0.85x–1.3x)
- **Tema claro/escuro**: Tema persistente com seleção de escuro, claro ou automático
- **Tela de configurações**: Seleção de tema com descrições claras
- **Botão na Home**: Acesso rápido às configurações
- **Haptic no cartão de crise**: Feedback sutil nos botões de ligar/mensagem

#### v1.0.3 (2026-09-27)
- **Texto alinhado à esquerda**: Cartão de crise com texto alinhado à esquerda
- **Splash screen**: Adicionado splash.png com a imagem do puzzle
- **Ícone do puzzle**: Imagem original do puzzle (1024x1024)

#### v1.0.2 (2026-09-27)
- **Rotação corrigida**: AndroidManifest alterado de portrait para sensor
- **Texto reage à rotação**: useWindowDimensions em vez de Dimensions.get
- **Texto cortado corrigido**: flexShrink no texto
- **Rotação na tela**: orientation default no Stack.Screen

#### v1.0.1 (2026-09-27)
- **Ícone do app**: Nova imagem do puzzle colorido (símbolo universal do autismo)
- **Cartão de Crise**: Texto com destaque visual aprimorado (título maior, divisor, sombra)
- **Rotação automática**: App agora gira automaticamente quando o celular é rotacionado para horizontal
- **Correções de dependências**: Atualizado para Expo SDK 50 com todas as dependências compatíveis
- **Bugs corrigidos**: 
  - `metro.config.js` corrigido para CommonJS
  - `babel.config.js` atualizado (removido `expo-router/babel` deprecado)
  - Adicionado `babel-plugin-module-resolver` como dependência
  - Corrigido problema de tela preta
  - Corrigido problema de conexão com o Metro

#### v1.0.0 (2026-09-26)
- Lançamento inicial do MVP
- Cartão de Comunicação de Crise
- Check-in de Bateria Social & Interocepção
- Rotinas Visuais Sequenciais
- Central de Cartões de Regulação (Coping Cards)
- Respiração Guiada (4-4-4-4 e 4-7-8)

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
- Pausa real (o timer congela) e extensão de tempo sem penalidade

### 4. Central de Cartões de Regulação (Coping Cards)
- Exercício de Ancoragem 5-4-3-2-1
- Respiração Guiada (4-4-4-4 e 4-7-8)
- Cartões personalizados com criação e edição
- Exclusão de cartões personalizados
- Favoritos e categorias

## Stack Tecnológica

- **Frontend**: React Native + Expo SDK 50 + TypeScript
- **Estilização**: `StyleSheet` do React Native (NativeWind instalado, mas não usado em massa)
- **Estado**: Zustand + AsyncStorage (offline-first)
- **Navegação**: Expo Router
- **Build**: EAS Build / Gradle

## Instalação

```bash
# Instalar dependências
npm install

# Validar código
npm run lint
npm run typecheck

# Iniciar em modo desenvolvimento
npx expo start

# Build Android (APK)
npx eas build -p android --profile preview

# Validar o bundle de todas as rotas (sem precisar de pasta nativa)
npx expo export --platform android

# Build local — exige gerar a pasta nativa primeiro
npx expo prebuild -p android

# Atenção: JDK 17 é obrigatório. O AGP 8.1.1 do SDK 50 falha com JDK 21.
JAVA_HOME=/caminho/para/jdk17 ./android/gradlew assembleRelease
```

Use `assembleRelease` para instalar no celular. O APK **debug** não embute o
bundle JS e depende do Metro rodando em `localhost:8081` — instalado sozinho,
abre uma tela de erro.

O projeto usa **managed workflow**: a pasta nativa (`ios/`, `android/`) não é
versionada. O build com EAS gera a pasta na nuvem; para build local, rode
`npx expo prebuild` antes dos comandos Gradle.

O widget de acesso rápido ao Cartão de Crise está **implementado no Android**
(um toque abre `/crisis-card`) e **não implementado no iOS** — ver
[WIDGET_SETUP.md](WIDGET_SETUP.md). Sem o widget, o Cartão de Crise continua
acessível pelo botão flutuante e pelo card da Home.

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
│   ├── routines/new.tsx    # Criação/edição de Rotina
│   ├── routine-execution.tsx # Execução
│   ├── regulation.tsx      # Cartões de Regulação
│   ├── breathing-guide.tsx # Respiração Guiada
│   ├── settings.tsx        # Configurações do App
│   ├── _error.tsx          # Tela de recuperação de erros
│   └── coping-card/        # Detalhe e criação/edição do Cartão
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

- **Tema claro/escuro persistente**: Escolha entre escuro, claro e automático; reduz fadiga visual no escuro
- **Baixa carga cognitiva**: Uma ação principal por tela
- **Sem cores agressivas**: Paleta pastel suave
- **Sem animações piscantes**: Apenas transições suaves
- **Sem alertas vermelhos**: Notificações discretas
- **Tipografia legível**: Contraste WCAG AA
- **Espaçamento generoso**: Respiro visual
- **Rotação automática**: App gira quando o celular gira

## Licença

GPL-3.0 — ver [LICENSE](LICENSE).
