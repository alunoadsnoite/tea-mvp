# Publicação no F-Droid

A versão 1.0.10 / versionCode 10 é candidata. O arquivo
`com.teamvp.app.yml` é uma receita para submissão, não uma publicação no
catálogo. O arquivo foi validado com `fdroid lint`, usando as categorias
atuais do repositório oficial. A receita passou no scanner de fontes numa
cópia temporária do código e dependências. A receita também foi normalizada com `fdroid rewritemeta`. O APK release local foi gerado e sua versão foi conferida com `aapt`.
No CI do F-Droid, o Gradle compilou, mas a coleta do APK falhou; a receita
agora informa explicitamente o caminho do APK não assinado. O pipeline corrigido concluiu todas as nove tarefas com sucesso, incluindo
`fdroid build` e `check apk`. A revisão da equipe ainda é necessária.

## Validação e release

1. Execute `npm ci`, `npm run lint`, `npm run typecheck`, `npm test` e
   `npx expo export --platform android`.
2. Gere o projeto com `npx expo prebuild -p android --no-install`.
3. Com JDK 17 e o Android SDK instalado, execute:

   ```bash
   JAVA_HOME=/caminho/para/jdk17 ./android/gradlew -p android assembleRelease
   ```

4. Valide o APK em aparelho Android, incluindo abertura offline, widget,
   rotação do cartão de crise, pausa/retomada e extensão das rotinas.
5. Opcionalmente, crie e publique a tag `v1.0.10` após validar o release.
   A receita atual fixa o commit `9186ad298a279b44577e6bc8e88993d204bbff33`,
   que contém o código corrigido e já está publicado no GitHub.

O release gerado pelo Expo usa a configuração de assinatura debug do template.
Ele serve para teste local e não é a assinatura do catálogo oficial: o F-Droid
faz seu próprio build e assinatura.

## Submissão ao catálogo oficial

O pacote é `com.teamvp.app`. A consulta a
`fdroid/fdroiddata/metadata/com.teamvp.app.yml` retornou 404 em 2026-10-10;
A submissão [!50479](https://gitlab.com/fdroid/fdroiddata/-/merge_requests/50479)
foi atualizada para a versão 1.0.10 e reaberta em 2026-10-10. Ela havia sido
fechada pelo autor em 2026-09-28. A branch de origem é `add-tea-mvp` no fork
`alunoadsnoite/fdroiddata`. A branch foi atualizada por rebase autorizado e a receita do TEA Kids, que
estava misturada à submissão anterior, foi retirada desta merge request;
ela continua recuperável no histórico do fork. Em 2026-10-11, um mantenedor encerrou a submissão por falta do modelo de
descrição exigido. A descrição foi atualizada com o template oficial e a submissão foi reaberta
em 2026-10-11. A receita corrigida está no commit `0c7cae4f` do fork, com
[novo pipeline](https://gitlab.com/alunoadsnoite/fdroiddata/-/pipelines/2935472676).
As capturas reais da tela inicial, estratégias de calma, rotinas e check-in foram recebidas
do autor em 2026-10-11 e publicadas nos metadados Fastlane, junto ao ícone
existente do aplicativo. A captura de configurações foi omitida por mostrar
a versão 1.0.8.
A inclusão no catálogo depende
do build e da revisão dos mantenedores; a submissão não significa publicação concluída.

Com uma conta autenticada no GitLab:

1. Verifique se já existe submissão para esse pacote em `fdroid/fdroiddata`.
2. Faça um fork desse repositório e coloque a receita em
   `metadata/com.teamvp.app.yml`.
3. Execute `fdroid lint com.teamvp.app` e `fdroid build com.teamvp.app:10` no
   ambiente de build do F-Droid. O pipeline #2935472676 passou no build completo e na análise do APK.
   As exceções do scanner cobrem arquivos Gradle com repositórios locais
   verificados e o compilador Hermes Linux, seguindo receitas Expo existentes
   no catálogo. `scandelete: node_modules` remove os arquivos apontados pelo
   scanner, preservando os fontes e o compilador necessário ao build.
   Distribuições Windows/macOS não usadas são removidas no prebuild.
   O init muda de `android/` para a raiz antes de gerar o projeto Expo.
   O JDK 17 vem do repositório Debian Bookworm, seguindo receitas oficiais,
   pois a imagem atual do F-Droid usa Debian Trixie.
4. Abra ou atualize a merge request no GitLab e acompanhe a revisão da equipe.

Os textos do aplicativo e changelog estão em
`fastlane/metadata/android/pt-BR/` e `fastlane/metadata/android/en-US/`
para importação pelo F-Droid. A interface continua em português.

A atualização automática está desativada durante esta primeira submissão,
pois ainda não há release Android de produção com assinatura estável e
reprodutibilidade verificada. O F-Droid fará sua própria assinatura.

Referências oficiais:
- https://f-droid.org/en/docs/Submitting_to_F-Droid_Quick_Start_Guide/
- https://f-droid.org/en/docs/Build_Metadata_Reference/

## Resultado da validação em 2026-10-11

O [pipeline #2935472676](https://gitlab.com/alunoadsnoite/fdroiddata/-/pipelines/2935472676)
aprovou todas as nove tarefas. A receita gerou o APK não assinado a partir
do commit publicado `9186ad298a279b44577e6bc8e88993d204bbff33`.
A merge request permanece aberta para revisão; o aplicativo ainda não está
publicado no catálogo.

O relatório do APK contém avisos de permissões herdadas dos manifests do
Expo/React Native, tamanho do pacote universal (~63 MB) e R8 desativado.
As explicações foram registradas na descrição da submissão. A revisão de divisão por ABI continua pendente.

A receita agora fixa `76885f40ec8134971d5eb2987742a366b318153b`, que inclui
as quatro capturas reais e o ícone em pt-BR e en-US. Essa alteração apenas
acrescenta imagens e documentação ao código já validado; o novo pipeline
da submissão deverá confirmar o build desse commit.

## Otimização de release

O plugin `plugins/withReleaseOptimization.js` ativa R8 e a remoção de recursos
não utilizados em cada `expo prebuild`. As propriedades geradas são
`android.enableProguardInReleaseBuilds=true` e
`android.enableShrinkResourcesInReleaseBuilds=true`. O APK universal ainda inclui
bibliotecas nativas de várias arquiteturas, que não são reduzidas pelo R8.
