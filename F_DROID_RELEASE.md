# Publicação no F-Droid

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
