# Publicação no F-Droid

## Estado verificado em 29/10/2026

A MR [!50479](https://gitlab.com/fdroid/fdroiddata/-/merge_requests/50479) está **merged**, com versão 1.0.12. Consulta direta à API GitLab confirmou pipeline [2991084844](https://gitlab.com/alunoadsnoite/fdroiddata/-/pipelines/2991084844) aprovado. A receita integrada fixa `9348b1bce2b489043874222f9422d9a56d4df8c5`, códigos 121/122/123/124 e atualização por tags. A cópia `com.teamvp.app.yml` foi sincronizada com essa receita.

A API `https://f-droid.org/api/v1/packages/com.teamvp.app` respondeu HTTP 404 nesta consulta: disponibilidade no catálogo não confirmada. Aguardar/verificar processamento e indexação; não abrir submissão duplicada. As notas abaixo são históricas e não representam o estado atual da MR.

A candidata **1.0.13 / versionCode 13** prepara os ajustes do círculo de respiração e do botão de emergência. `package.json`, lockfile, `app.json` e Gradle estão sincronizados; changelogs pt-BR/en-US incluem códigos 13 e 131–134. Lint, TypeScript, 58 testes, exportação Android e build release passaram. A receita espelhada da 1.0.12 passou em `fdroid lint -f com.teamvp.app` com fdroidserver 2.4.5 e a lista oficial de categorias obtida de `fdroiddata/config/categories.yml`; os primeiros testes isolados falharam por ausência dessa configuração. Não foram repetidos os quatro builds F-Droid da candidata.

No Motorola Edge 70 Fusion (Android 17), foram conferidos fonte 200%, avanço de rotina pausada, rolagem em paisagem, respiração 4-7-8 completa, abertura pelo widget e abertura fria da Home sem rede. O usuário confirmou leitura do app pelo TalkBack; não se declara auditoria completa de acessibilidade. Todos os ajustes temporários do aparelho foram restaurados. Ver [registro de teste](docs/TESTE_MOTOROLA_EDGE.md).

Próxima etapa de publicação: revisar/integrar a candidata, criar a tag `v1.0.13` no commit integrado e acompanhar a atualização automática e os builds F-Droid (códigos previstos 131/132/133/134). A receita `com.teamvp.app.yml` permanece como espelho da 1.0.12 realmente integrada; não contém um hash fictício da candidata. Não abrir outra submissão inicial.


## Estado em 22/10/2026 — versão 1.0.12

A submissão ativa permanece [!50479](https://gitlab.com/fdroid/fdroiddata/-/merge_requests/50479), aberta. O PR #4 foi integrado. A versão 1.0.12 inclui o retorno à lista anterior após concluir rotinas e repara uma alteração posterior que havia truncado a tela de rotinas e removido as ações do cartão de crise. Mensagens ocultas são respeitadas, ligação continua disponível com todas ocultas e SMS vazio fica desabilitado. O texto segue a escala nativa do sistema; a descrição antiga de limite em 130% foi removida.

Lint, TypeScript e 54 testes passaram na preparação desta versão. Reteste físico Android continua pendente. Códigos previstos na receita F-Droid: 121/122/123/124. Os APKs locais de teste e os APKs assinados pelo F-Droid têm assinaturas distintas. A aprovação no CI não confirma inclusão no catálogo.

## Referência anterior (20/10/2026; superada)


## Estado em 20/10/2026

A submissão ativa é [!50479](https://gitlab.com/fdroid/fdroiddata/-/merge_requests/50479). A versão 1.0.10 está marcada pela tag `v1.0.10`; a receita fixa a fonte `7b1edde61b412b2f2700ff35a137a28b198489d6` e habilita atualização por tags.

O [pipeline #2967748507](https://gitlab.com/alunoadsnoite/fdroiddata/-/pipelines/2967748507) tem as nove etapas aprovadas segundo a atualização da MR, incluindo as quatro compilações e verificações de APK. A submissão registra lint, TypeScript, 36 testes unitários e exportação JS Android aprovados para essa fonte. Estes são resultados publicados, não novas execuções desta atualização documental.

**A revisão funcional dos mantenedores e a aprovação de inclusão continuam pendentes.** CI aprovado não equivale a publicação no catálogo.

## Receita atual

- Pacote: `com.teamvp.app`.
- Versão upstream: 1.0.10, versionCode base 10.
- APKs separados ARMv7/ARM64/x86/x86_64: códigos 101/102/103/104.
- R8 e remoção de recursos ativos; APKs de aproximadamente 17–22 MB.
- A receita remove permissões desnecessárias de rede, armazenamento compartilhado e overlay antes do prebuild.
- As permissões restantes reportadas são VIBRATE, para hápticos, e a permissão interna de assinatura gerada pelo AndroidX.
- O projeto nativo é gerado por Expo prebuild. A receita aplica os ajustes de compatibilidade com JDK 21 do template React Native; o fluxo local original do Expo SDK 50 continua documentado com JDK 17.
- As exceções do scanner cobrem declarações Maven locais verificadas, o compilador Hermes Linux e o falso positivo de nome da fonte Fontisto. Binários JSC e compiladores Hermes de outros sistemas são removidos.

O relatório da MR registra 22 achados informativos e nenhum achado minor/major/critical/blocker. O antigo APK universal de aproximadamente 63 MB e os antigos avisos de R8/permissões não descrevem mais a receita atual.

## Assinatura e metadados

O F-Droid fará a assinatura. Não existe APK upstream de produção fornecido para verificação de assinatura reproduzível; não se declara equivalência bit a bit. APKs assinados para testes do CI não são referências de assinatura de produção.

Resumos, descrições, changelog, ícone e quatro capturas reais fornecidas pelo autor estão em `fastlane/metadata/android/pt-BR/` e `en-US/`. A interface permanece em português. A captura antiga de configurações, com versão 1.0.8, foi omitida.

## Validação local

```sh
npm ci
npm run lint
npm run typecheck
npm test
npx expo export --platform android
npx expo prebuild -p android --no-install
```

Com Android SDK e JDK 17 configurados, o build local original usa:

```sh
./android/gradlew -p android assembleRelease
```

A receita F-Droid deve ser validada separadamente com fdroid lint, rewritemeta e os builds por arquitetura. O código-base não deve receber as permissões ou opções geradas pela receita como se fossem requisitos do aplicativo.

Teste funcional em aparelho: abertura offline, widget, cartão de crise e sua rotação, falha de leitura das preferências, pausa/retomada/extensão das rotinas e edição de rotina em andamento. Os resultados automatizados não substituem esses testes.

## Histórico de empacotamento

As submissões fechadas !50489 e !50572 foram substituídas pela !50479. Falhas antigas de coleta do APK e formatação foram corrigidas. Preservar a MR ativa e não criar duplicatas.

A MR contém somente `metadata/com.teamvp.app.yml`. As referências antigas a fonte `76885f40...`, atualização automática desativada e divisão por ABI pendente foram superadas pela receita e pelo pipeline acima.

Referências: [guia de envio](https://f-droid.org/en/docs/Submitting_to_F-Droid_Quick_Start_Guide/) e [metadados de build](https://f-droid.org/en/docs/Build_Metadata_Reference/).
