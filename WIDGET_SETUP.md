# Widget de Acesso Rápido ao Cartão de Crise

> **Status: implementado no Android.** Um toque abre o app direto na rota
> `/crisis-card`, sem passar pela Home.
>
> **O iOS ainda não tem widget.** O projeto é managed workflow e a pasta `ios/`
> não é versionada; criar um target WidgetKit exige abrir o Xcode e configurar
> a extension manualmente (ver "iOS" abaixo).
>
> Sem o widget, o Cartão de Crise continua acessível pelo botão flutuante
> (`EmergencyFab`) e pelo card da Home. O widget é acessória, nunca obrigatório.

## Como o widget é entregue

O projeto usa managed workflow e `android/` está no `.gitignore`, então nada
do widget é escrito direto na pasta nativa — ela seria apagada no próximo
`expo prebuild`.

Em vez disso:

- **Fontes versionadas** em `widget/android/`
- **Config plugin** `plugins/withCrisisWidget.js`, registrado em `app.json`
  (`plugins`), que copia as fontes e registra o receiver a cada prebuild

Arquivos-fonte:

| Origem (versionado) | Destino no projeto gerado |
| --- | --- |
| `widget/android/CrisisWidgetProvider.kt` | `android/app/src/main/java/com/teamvp/app/CrisisWidgetProvider.kt` |
| `widget/android/crisis_widget.xml` | `android/app/src/main/res/layout/crisis_widget.xml` |
| `widget/android/crisis_widget_background.xml` | `android/app/src/main/res/drawable/crisis_widget_background.xml` |
| `widget/android/crisis_widget_info.xml` | `android/app/src/main/res/xml/crisis_widget_info.xml` |
| `widget/android/crisis_widget.xml` | `android/app/src/main/res/values/crisis_widget.xml` |

## Como testar

```bash
npx expo prebuild -p android

# JDK 17 é obrigatório: o AGP 8.1.1 do SDK 50 quebra com JDK 21
JAVA_HOME=/path/para/jdk17 ./android/gradlew assembleDebug

adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Depois, no launcher: segure em um espaço vazio da tela inicial → **Widgets** →
**TEA Autonomia** → arrastar para a tela.

## Decisões de implementação

- **Deep link** `tea://crisis-card`, com o scheme vindo de `app.json`. O
  Expo Router resolve para a rota `/crisis-card`.
- **Sem dados sensíveis.** O widget é estático e mostra apenas "Cartão de
  Crise / Toque para abrir". Nenhum contato ou mensagem é exposto.
- **Contraste.** As cores espelham os tokens de `src/constants/theme.ts`
  (tema escuro): fundo `#1A1D23` sobre texto `#E8E6E3` = 13.5:1, texto
  secundário `#B8B5B0` = 8.3:1. O widget é sempre escuro, independente do tema
  do app, porque o Cartão de Crise prioriza alto contraste e o launcher pode
  renderizá-lo sobre qualquer papel de parede. Se a paleta mudar, atualizar
  `widget/android/crisis_widget.xml`.
- **Tamanho 1x1.** O widget é um único botão; torná-lo maior apenas repetiria
  o texto.
- **`PendingIntent.FLAG_IMMUTABLE`** é obrigatório a partir do Android 12
  (API 31).
- **`R.id` resolvido por nome.** O AGP 8 usa `nonFinalResIds` por padrão, então
  os IDs do layout não existem como campos em `R`. O provider usa
  `resources.getIdentifier("crisis_widget_root", "id", packageName)`.

## iOS (não implementado)

Para criar o widget no iOS é preciso, no macOS:

1. `npx expo prebuild -p ios` e abrir o workspace no Xcode.
2. Criar um target **Widget Extension** (`TEAWidget`) no projeto.
3. Implementar a view estática e seu `Info.plist`.
4. Registrar a extension no scheme do app.
5. Reaproveitar as cores de `src/constants/theme.ts`.

Não há como validar isso por script, e o `ios/` não é versionado — cada pessoa
que quiser o widget no iOS precisa criar o target.
