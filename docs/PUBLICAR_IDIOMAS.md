# Publicação da atualização com português, inglês e espanhol

O seletor fica em **Configurações → Idioma** em português, **Settings → Language** em inglês e **Configuración → Idioma** em espanhol. O idioma inicial é português do Brasil. A escolha é salva no aparelho e funciona offline. Textos padrão aparecem no idioma escolhido e textos personalizados continuam como foram escritos. O widget Android usa o idioma do sistema para o texto no launcher. Ao abrir o cartão, o app aplica a preferência escolhida nele.

## Validação antes de publicar

```sh
npm ci
npm run lint
npm run typecheck
npm test -- --runInBand
npx expo export --platform android
npx expo prebuild --platform android --no-install
# Configure JAVA_HOME com o JDK 17 e ANDROID_HOME com o SDK do Android.
./android/gradlew -p android assembleRelease
```

A exportação do Expo valida o bundle. Use o APK gerado pelo Gradle para testar a instalação e executar os fluxos abaixo. O APK local de teste usa a chave de debug definida pelo projeto. Para testar a atualização com dados existentes, instale primeiro a versão anterior compilada com a mesma chave e atualize por cima, sem desinstalar. Para cada canal público, valide a atualização com a assinatura correspondente.

- Na versão anterior, salve um check-in com gatilhos, uma rotina, um cartão favorito, um contato e uma edição em uma mensagem de crise padrão. Pause uma rotina em execução.
- Atualize o app e confira os dados. Com a rede desligada, mude para **English** e **Español**. Em cada idioma, feche e reabra o app e confira a preferência. Volte para **Português (Brasil)**.
- Nos três idiomas, confira a Home, o histórico, a rotina pausada, os cartões e o cartão de crise. Abra o discador e o rascunho de SMS sem enviar. O texto padrão deve acompanhar o idioma e a mensagem personalizada deve continuar igual.
- Com TalkBack e fonte ampliada, confirme o foco e o anúncio da opção selecionada, a leitura dos botões de crise, a rolagem das telas e os avisos de fase da respiração. Teste o atalho do widget no Android com o sistema em português, inglês e espanhol.

## GitHub

1. Defina a próxima versão no commit de publicação. Sincronize `expo.version`, `expo.android.versionCode`, `package.json`, `package-lock.json` e o Gradle versionado. Mantenha o pacote `com.teamvp.app` e escolha um código crescente para cada variante distribuída.
2. Adicione as notas da versão em pt-BR, en-US e es-ES em `fastlane/metadata/android/*/changelogs/`. Inclua os códigos distribuídos pelo F-Droid. Use capturas reais se atualizar as imagens da loja.
3. Valide o build Android e a atualização sobre a versão anterior. Depois de integrar o PR, valide o commit final que será marcado. Se distribuir um APK no GitHub, use a chave de produção do canal e verifique a assinatura com `apksigner verify --print-certs APK`.
4. Crie a tag `v<versão>` no commit validado. Prepare a release do GitHub com as notas nos três idiomas e anexe o APK validado, se houver distribuição direta. Publique depois de conferir a tag, o código da versão e o artefato. [Documentação de releases do GitHub](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)

## F-Droid

1. O pacote [já está no catálogo](https://f-droid.org/packages/com.teamvp.app/). Confira a [receita oficial](https://gitlab.com/fdroid/fdroiddata/-/blob/master/metadata/com.teamvp.app.yml) antes de liberar a tag. A receita espelhada neste projeto usa tags `vX.Y.Z` e códigos de ABI `10 × código base + 1…4` para ARMv7, ARM64, x86 e x86_64, respectivamente.
2. Valide o candidato em uma cópia de `fdroiddata` com a receita vigente. Rode `fdroid lint -f com.teamvp.app` e `fdroid build com.teamvp.app:<código>` para cada ABI. Use o commit candidato real ao testar a receita.
3. Inicie o fluxo do F-Droid após o teste e a aprovação do responsável pelo app. Após a tag validada, acompanhe a detecção da nova versão e os builds. Se a automação não atualizar a receita, prepare uma MR de atualização em `fdroiddata` para o pacote existente com a referência validada, os códigos e os resultados. Confira a nova versão no cliente quando for indexada. A assinatura do F-Droid é gerenciada pelo F-Droid. [Referência de metadados de build](https://f-droid.org/docs/Build_Metadata_Reference/)
