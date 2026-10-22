# Retorno do Junker — TEA Autonomia 1.0.11

Referência: https://gitlab.com/fdroid/fdroiddata/-/merge_requests/50479#note_4064134306

## Navegação após concluir uma rotina

O fluxo normal é Home → Minhas Rotinas → Execução. Substituir Execução por outra
Minhas Rotinas mantinha a lista anterior no histórico e criava uma cópia a cada
conclusão. A saída agora volta à rota anterior com `router.back()` quando
`router.canGoBack()` é verdadeiro. Uma execução restaurada diretamente, sem
histórico, usa `router.replace("/routines")` como alternativa segura.

O mesmo retorno é usado ao encerrar uma execução e na tela vazia. O atraso de
1,5 segundo da confirmação continua igual. Desmontar a tela cancela o retorno
agendado, evitando navegação tardia depois que o usuário saiu.

Quatro testes da tela cobrem três conclusões consecutivas sem acúmulo de
listas, conclusão restaurada sem histórico, cancelamento ao desmontar e saída
segura de uma execução vazia. São testes Jest/Expo com roteador modelado em
memória; não são teste de navegação em aparelho Android.

## Descrição do tamanho de texto

As descrições Fastlane em `pt-BR` e `en-US` agora informam que o texto nas telas
principais acompanha a fonte do sistema no intervalo 85%-130%, sem controle
separado dentro do aplicativo. Isso corresponde ao limite existente de
`useFontScale`; a escala máxima não foi ampliada nesta alteração.

## Validação e limites

A suíte local passou com 46 testes. ESLint, TypeScript e a exportação do bundle
Android também passaram. O teste de conclusões repetidas falha no código
anterior e passa com a correção. Esses resultados não substituem o reteste
em fonte ampliada, widget ou aparelho físico. Não se afirma que este patch já
esteja no APK 1.0.11 testado pelo Junker; ele requer integração e um novo APK.

Os resultados de widget, cartão de crise, intents de telefone/mensagem,
check-in, temporizador e respiração citados no comentário original pertencem
ao teste do Junker. Histórico detalhado, rotinas/cartões personalizados,
regulação e paisagem permanecem fora daquele teste.
