# Widget de Acesso Rápido ao Cartão de Crise

> **Status: não implementado.** Nenhum código nativo de widget existe neste
> repositório. Este documento descreve o que seria necessário implementar, não
> algo pronto para compilar ou instalar. As seções abaixo são um plano.
>
> Para acessar o Cartão de Crise hoje, use o botão flutuante de emergência
> (`EmergencyFab`) ou o card na Home. O app funciona 100% sem widget.

## O que falta para existir

Nenhum destes arquivos está no repositório (verificado em 2026-09-30):

| Plataforma | Arquivo previsto | Existe |
| --- | --- | --- |
| iOS | `ios/TEAWidget/TEAWidget.swift` | não |
| iOS | `ios/TEAWidget/Info.plist` | não |
| Android | `android/app/src/main/java/com/teamvp/app/CrisisWidgetProvider.kt` | não |
| Android | `android/app/src/main/res/layout/crisis_widget.xml` | não |
| Android | `android/app/src/main/res/drawable/widget_background.xml` | não |
| Android | `android/app/src/main/res/xml/crisis_widget_info.xml` | não |

## Pré-requisito: projeto nativo gerado

O projeto é **managed workflow** (Expo SDK 50, config em `app.json` com
`plugins: [expo-router]`). Não existe pasta `ios/` versionada, e `android/` está
no `.gitignore` — o único arquivo rastreado é `android/app/build.gradle`,
mantido apenas para o `versionCode` do F-Droid.

Antes de escrever qualquer código de widget é preciso gerar a pasta nativa:

```bash
npx expo prebuild -p android   # ou -p ios
```

Sem isso não há `AndroidManifest.xml`, receiver declarado ou target de widget
para build. O arquivo `ios/TEA-MVP.xcworkspace` citado em versões anteriores
deste documento nunca existiu neste repositório.

## Plano — iOS (WidgetKit)

1. Gerar a pasta nativa com `npx expo prebuild -p ios`.
2. Criar o target `TEAWidget` (WidgetKit extension) no Xcode.
3. Implementar a view estática do widget e seu `Info.plist`.
4. Cores e textos: derivar de `src/constants/theme.ts` em vez de valores fixos,
   para manter a paleta acessível.

## Plano — Android (AppWidgetProvider)

1. Gerar a pasta nativa com `npx expo prebuild -p android`.
2. Criar o `CrisisWidgetProvider` e registrar o receiver no `AndroidManifest.xml`.
3. Criar os recursos de layout, drawable e metadados do widget.
4. Abrir a rota do Cartão de Crise via o scheme `tea` (definido em `app.json`).

## Cuidados de implementação

- Manter o caminho de crise rápido e totalmente offline.
- O widget é acessória: se falhar, o app e o Cartão de Crise continuam
  funcionando sem ele.
- Não expor dados de contatos ou mensagens no widget — apenas um atalho para
  abrir a rota.
