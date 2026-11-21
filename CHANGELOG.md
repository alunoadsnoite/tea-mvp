# Histórico de versões

#### v1.0.19

- Francês na interface, no conteúdo padrão e no widget Android.
- Resumo sensorial dos últimos sete dias com a frequência dos gatilhos e a contagem de check-ins com carga sensorial de 4 ou 5.
- Gatilhos opcionais para cheiros fortes e toque ou textura. Atalho das sugestões do check-in para os cartões de regulação.

#### v1.0.14

- Interface e conteúdo padrão em português do Brasil, inglês e espanhol.
- O idioma fica salvo no aparelho. O widget Android usa o idioma do sistema no launcher.

#### v1.0.13 (2026-10-29)
- Círculo de respiração mantém largura e altura iguais; texto separado da animação para respeitar fontes ampliadas.
- Botão de emergência cresce com fontes ampliadas, evitando cortar o símbolo.
- Testes físicos no Motorola Edge 70 Fusion (Android 17): fonte 200%, rotação paisagem, respiração 4-7-8 completa, abertura pelo widget, abertura fria sem rede e TalkBack básico.

#### v1.0.12
- Concluir uma rotina volta à lista anterior sem acrescentar outra cópia ao histórico; abertura restaurada sem histórico mantém uma saída segura.
- Texto acompanha a escala nativa de fonte do sistema, sem controle separado no app.
- Restaura a tela de rotinas e as ações do cartão de crise após uma edição incompleta.
- Detalhes e limites em [docs/JUNKER_REVIEW_FIXES.md](docs/JUNKER_REVIEW_FIXES.md).

#### v1.0.11 (2026-10-21)
- Voltar à rotina salva preserva a pausa, o passo e os horários.
- Cartões de crise com rolagem vertical e seleção sincronizada pelo ID ativo.
- SOS separado do viewport das telas, sem sobrepor os controles.
- Widget recria a tarefa com a intenção de crise e aguarda o navegador montar.
- As correções relacionadas ao relatório do TEA Kids e os limites da validação estão em [docs/JYRI_SHARED_FIXES.md](docs/JYRI_SHARED_FIXES.md).


#### v1.0.10 (2026-10-10, candidata)
- Rotinas: avançar enquanto pausado mantém o tempo correto do próximo passo.
- Rotinas: adicionar minutos após o prazo acabar concede o tempo completo.
- Rotinas: ações não modificam execuções concluídas; reabrir a tela concluída volta à lista.
- Timer visual: restaura a fração correta durante uma pausa e atualiza extensões sem retomar.
- Cartão de crise: carrossel acompanha a mensagem ativa após hidratação do armazenamento.
- Respiração: progresso começa em 0% e não indica conclusão antes da última fase.
- Respiração: controles acessíveis por rolagem em telas baixas/paisagem e animação interrompida ao parar/sair.
- Receita candidata para F-Droid: gera o projeto nativo antes do build, usa release e preserva dependências necessárias. O build e a análise do APK passaram no F-Droid em 2026-10-11. As capturas já foram fornecidas; a inclusão no catálogo ainda depende de revisão funcional e aprovação dos mantenedores; veja [F_DROID_RELEASE.md](F_DROID_RELEASE.md).


#### v1.0.8 (2026-10-08)
- **Acessibilidade: controle de Bateria Social operável no TalkBack** — o container do check-in declarava `accessible` + `adjustable` sem `onAccessibilityAction`, agrupando os botões "-10"/"+10" num único elemento e tornando-os inoperáveis pelo leitor de tela; agora os botões são focáveis individualmente
- **Correção: descrições invisíveis no tema escuro** — os textos de descrição da tela de Configurações não definiam cor e renderizavam preto sobre `#22262E` (contraste 1.4:1)
- **Correção: carrossel do Cartão de Crise dessincronizado** — o índice persistido não era reposicionado no `ScrollView`, fazendo o indicador de página divergir da página visível, o SMS enviar o texto da mensagem errada e a rotação deixar o conteúdo desalinhado; háptico agora só dispara quando há contato, e `Linking.openURL` trata falha
- **Correção: EmergencyFab cobrindo a ação principal** — `paddingBottom: 80` em todas as telas com conteúdo final interativo (salvar, encerrar, registrar, limpar etc.)
- **Correção: "Limpar histórico" acessível com registros antigos** — o botão ficava preso no branch de lista vazia e sumia quando todos os check-ins tinham mais de 7 dias
- **Retenção de histórico implementada** — o `addEntry` agora descarta entradas com mais de 90 dias (o README prometia isso desde a v1.0.5)
- **Formulários com feedback de validação** — salvar com campo vazio exibia erro silencioso; agora há mensagem inline acessível nos 4 formulários
- **Formulários de edição ressincronizam com a store** — em deep link/abertura fria a hidratação assíncrona deixava o formulário vazio com o cabeçalho "Editar"
- **Error boundary registrado** — o `_error.tsx` não correspondia a nenhuma convenção do Expo Router e nunca era exibido; agora é exportado como `ErrorBoundary` pelo `_layout.tsx`
- **Respiração guiada** — barra de progresso inicia em 0% (antes nascia em 6-8%), a fase "0s" do 4-7-8 não é mais exibida, e as dependências do efeito ficaram completas
- **"Check-in de hoje" não fica defasado após a meia-noite**
- **Háptico sem unhandled rejection** — `Haptics.*` retorna Promise e o `try/catch` síncrono não capturava a falha
- **"Restaurar padrões" avisa que os contatos de emergência também serão apagados**
- **Removido `setInterval` inútil na execução de rotina** — re-render de 1 em 1 segundo sem nada dependente do tempo

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
- **Ícone atualizado**: Usa a imagem do puzzle (`assets/icon.png`) como ícone do app
- **Font scale nas telas principais**: Ajuste de fonte aplicado em home, check-in, configurações do cartão e configurações do app (não aplicado em respiração guiada, execução de rotina e cartão de crise)
- **Contato do desenvolvedor**: Seção com e-mail (valdenorsa@proton.me) nas configurações do app
- **Error boundary**: Tela de recuperação para erros inesperados (registro efetivo do `ErrorBoundary` adicionado na v1.0.8)
- **Retenção de histórico**: Check-ins mantêm apenas entradas dos últimos 90 dias (implementada na v1.0.8)
- **Acesso rápido a novos cartões**: Botão "Novo cartão personalizado" na tela de estratégias de calma
- **Feedback háptico**: Vibração suave em botões de emergência e seleções
- **Fonte ajustável**: Respeita o tamanho de fonte escolhido no sistema
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
- **Ícone do app**: A versão usava uma imagem de quebra-cabeça colorido
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
