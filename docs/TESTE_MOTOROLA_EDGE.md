# Testar no Motorola Edge — 29/10/2026

## Estado da revisão

Base: main 9348b1b (1.0.12); versão candidata preparada: 1.0.13, versionCode 13. Próximo Passo passou em teste da tela, tanto em execução quanto em pausa. Círculo alterado para largura e altura iguais, espaço reservado à expansão e texto separado da transformação: fontes ampliadas não alteram sua geometria. Escala nativa de texto preservada. Os testes de fases 4-7-8, parar/reiniciar e limpeza dos temporizadores passaram. Isso não comprova renderização nem usabilidade em aparelho.

Validação automatizada: lint, TypeScript, 58 testes, exportação do bundle Android e build release final aprovados. APK de teste assinado com chave Android Debug, JavaScript embutido, pacote com.teamvp.app, versão final de teste 1.0.13/código 13. As bibliotecas no APK incluem as quatro ABIs, apesar do parâmetro arm64 no build; não é um APK dividido como os do F-Droid.

Após trocar o cabo, o Motorola Edge 70 Fusion com Android 17 foi reconhecido e o APK final instalado com `adb install -r` (Success), sem desinstalação/limpeza de dados.

Teste físico realizado com escala do sistema 2.0:
- Home e círculo com rótulo externo inspecionados em retrato; círculo circular, texto separado.
- Botão de emergência inicialmente cortava o símbolo. Corrigido para dimensões mínimas e padding; captura após reinstalação confirmou o símbolo completo.
- Rotina padrão Início de Expediente: iniciada, pausada e avançada pelo botão Próximo Passo. Confirmado “Passo 2 de 3” com estado “Pausado”.
- Rotação para paisagem preservou o passo 2 e a pausa. Após rolagem, Próximo Passo, Continuar, +5 min e Encerrar ficaram completos e alcançáveis. Encerrar acionado ao final do teste.
- Fonte original 1.0, rotação automática 1 e user_rotation 0 restaurados e relidos. Nenhum contato/mensagem/rotina foi apagado; a execução de teste foi encerrada.

Verificações adicionais da 1.0.13:
- APK release compilado e instalado com atualização preservando dados (Success).
- Respiração Relaxante observada por três ciclos completos (aproximadamente 57 segundos). Capturas em 1s, 5s, 12s, 20s, 56s e 59s mostraram a expansão, Segurar, Expirar e o retorno a Pronto/Começar ao final; sem fase de 0s. Respiração em paisagem permitiu alcançar Começar pela rolagem.
- Widget existente na tela inicial abriu diretamente o Cartão de Crise. O teste não estabelece comportamento após force-stop explícito do Android; o app foi reativado antes do toque.
- Abertura fria pela activity principal passou em modo avião com Wi-Fi desligado; a Home apareceu sem rede. Modo avião desligado e Wi-Fi ligado novamente ao fim.
- TalkBack ativado temporariamente; o usuário confirmou “Ouvi a leitura do app”. Isso é uma conferência auditiva básica, não uma auditoria completa de ordem de foco/gestos em todas as telas. TalkBack foi removido da lista de serviços ativos e sem serviço vinculado, mantendo os serviços anteriores.
- Tempo de tela original 60000 ms, fonte 1.0, rotação automática 1/user_rotation 0 e rede restaurados e conferidos. Celular liberado para desconexão.

Limites: teste completo de todos os fluxos no TalkBack, respiração em Caixa completa em aparelho e teste de todas as funcionalidades offline não foram realizados. Os testes automatizados cobrem fases 4-7-8, parar/reiniciar e cancelamento de temporizadores. A candidata 1.0.13 é proposta em branch/PR, ainda sem tag pública de release; a receita integrada ao F-Droid continua na 1.0.12.


## Preparar no notebook

Use esta cópia revisada do repositório (não um novo clone de main, que ainda não contém o ajuste). No terminal aberto na pasta do projeto:

```sh
npm ci
npx --no-install expo prebuild -p android --no-install
```

Configure Java 17 e o Android SDK. Neste notebook os caminhos encontrados foram:

```sh
export JAVA_HOME=/home/valdenor/development/jdks/temurin-17
export ANDROID_HOME=/home/valdenor/Android/Sdk
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
./android/gradlew -p android assembleRelease -PreactNativeArchitectures=arm64-v8a
```

O APK esperado é `android/app/build/outputs/apk/release/app-release.apk`. Release inclui o JavaScript e deve abrir sem Metro ou notebook. Não use um APK debug sozinho para este teste.

## Conectar e instalar

1. Desbloqueie o Motorola. Em Configurações → Sobre o telefone, toque sete vezes em Número da versão para habilitar as Opções do desenvolvedor (se ainda não estiverem habilitadas).
2. Ative Depuração USB nas Opções do desenvolvedor. Conecte com cabo que transmita dados e autorize a impressão digital deste notebook no celular. A localização exata varia com a versão do Android.
3. Execute no terminal do notebook:

```sh
adb devices -l
```

Deve aparecer um aparelho com estado `device`. Se aparecer `unauthorized`, desbloqueie e aceite a autorização. Se a lista ficar vazia, confira cabo, porta e conexão de dados. Se continuar vazia, experimente outro cabo de dados e outra porta USB. A lista USB do sistema também precisa reconhecer o Motorola.

4. Para instalar (com apenas um aparelho conectado):

```sh
adb install -r android/app/build/outputs/apk/release/app-release.apk
adb shell monkey -p com.teamvp.app -c android.intent.category.LAUNCHER 1
```

Se houver erro de assinatura ou versão inferior, pare e preserve os dados. Não desinstale automaticamente: isso apaga mensagens, contatos e rotinas. APK local de teste e F-Droid podem ter assinaturas diferentes. Use um aparelho/perfil de teste se necessário.

## Roteiro de teste físico

- Rotinas: abra uma rotina, toque em Próximo Passo e confirme o próximo título e contador. Pause, avance e confirme que continua pausada. Continue, adicione 5 minutos e conclua. Após a mensagem de conclusão, deve voltar à lista; Voltar deve chegar à Home sem listas duplicadas.
- Fonte: em Configurações do Android, procure Tamanho da fonte e coloque no máximo disponível; amplie também Tamanho da exibição. Repita em retrato e paisagem. Role até o fim: Próximo Passo, Pausar/Continuar, Encerrar e SOS devem estar legíveis e acionáveis. Registre qualquer corte, sobreposição ou controle inalcançável. Restaure depois a preferência desejada.
- Respiração: abra Estratégias de Calma → Respiração Guiada. Teste Caixa e Relaxante. O desenho deve continuar circular ao expandir/contrair; o texto abaixo deve ficar legível sem crescer junto da animação. 4-7-8 segue Inspirar 4s → Segurar 7s → Expirar 8s, sem fase de 0s. Parar interrompe; Começar reinicia. Aumente a fonte e gire o aparelho; controles devem continuar alcançáveis pela rolagem.
- Redução de movimento: habilite no app e confirme círculo estático com fases ainda avançando. Desabilite no app e sistema para observar a animação.
- Offline: feche, ative modo avião e reabra. Confirme rotinas e cartão de crise; teste também o widget Android. Não efetue ligação/SMS real durante a conferência.

Anote versão/Android, tamanho da fonte, orientação, passos para reproduzir e resultado. Capturas ajudam a confirmar falhas visuais. Aprovação automatizada não substitui esse registro.

## F-Droid

MR !50479 integrada, pipeline 2991084844 aprovado, fonte 9348b1b e códigos 121–124. API do catálogo retornou 404 em 29/10: download não confirmado. A candidata 1.0.13, incluindo os ajustes de respiração e emergência, precisa de revisão/integração e tag antes da atualização pelo F-Droid. Não criar outra submissão inicial.
