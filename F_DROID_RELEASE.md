# Publicação no F-Droid

A versão 1.0.10 / versionCode 10 é candidata. O arquivo
`com.teamvp.app.yml` é uma receita para submissão, não uma publicação no
catálogo. O arquivo foi validado com `fdroid lint`, usando as categorias
atuais do repositório oficial.

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
5. Crie e publique a tag `v1.0.10` no commit validado. A receita usa essa tag;
   enquanto ela não existir remotamente, o build do F-Droid não poderá buscar
   a versão candidata.

O release gerado pelo Expo usa a configuração de assinatura debug do template.
Ele serve para teste local e não é a assinatura do catálogo oficial: o F-Droid
faz seu próprio build e assinatura.

## Submissão ao catálogo oficial

O pacote é `com.teamvp.app`. A consulta a
`fdroid/fdroiddata/metadata/com.teamvp.app.yml` retornou 404 em 2026-10-10;
isso não exclui uma solicitação pendente em outra branch/merge request.

Com uma conta autenticada no GitLab:

1. Verifique se já existe submissão para esse pacote em `fdroid/fdroiddata`.
2. Faça um fork desse repositório e coloque a receita em
   `metadata/com.teamvp.app.yml`.
3. Execute `fdroid lint com.teamvp.app` e `fdroid build com.teamvp.app:10` no
   ambiente de build do F-Droid. O scanner de dependências e o build completo
   ainda precisam passar. A receita não ignora o scanner e não apaga
   `node_modules` inteiro, pois isso removeria dependências de build.
4. Abra ou atualize a merge request no GitLab e acompanhe a revisão da equipe.

Os textos do aplicativo e changelog estão em
`fastlane/metadata/android/pt-BR/` para importação pelo F-Droid.

Referências oficiais:
- https://f-droid.org/en/docs/Submitting_to_F-Droid_Quick_Start_Guide/
- https://f-droid.org/en/docs/Build_Metadata_Reference/
