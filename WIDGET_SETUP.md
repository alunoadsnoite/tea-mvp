# Widget de Acesso Rápido ao Cartão de Crise

Este widget permite abrir o Cartão de Comunicação de Crise diretamente da tela inicial do dispositivo, sem precisar navegar pelo app.

## iOS (WidgetKit)

### Arquivos criados:
- `ios/TEAWidget/TEAWidget.swift` — Widget principal
- `ios/TEAWidget/Info.plist` — Configuração do extension

### Como usar:
1. Abra o projeto no Xcode (`ios/TEA-MVP.xcworkspace`)
2. Adicione o target "TEAWidget" ao projeto
3. O widget aparecerá na galeria de widgets do iOS
4. Adicione-o à tela inicial

### Personalização:
- Cores: Edite `Color(red: 0.1, green: 0.11, blue: 0.14)` no Swift
- Textos: Edite as strings no `TEAWidgetEntryView`

## Android (AppWidgetProvider)

### Arquivos criados:
- `android/app/src/main/java/com/teamvp/app/CrisisWidgetProvider.kt` — Provider do widget
- `android/app/src/main/res/layout/crisis_widget.xml` — Layout do widget
- `android/app/src/main/res/drawable/widget_background.xml` — Fundo arredondado
- `android/app/src/main/res/xml/crisis_widget_info.xml` — Metadados do widget

### Como usar:
1. O widget aparecerá automaticamente na galeria de widgets após build
2. Adicione-o à tela inicial do Android
3. Ao tocar, o app abre diretamente no Cartão de Crise

### Personalização:
- Cores: Edite `@drawable/widget_background.xml`
- Textos: Edite `crisis_widget.xml`
- Tamanho: Edite `minWidth` e `minHeight` em `crisis_widget_info.xml`

## Funcionalidade

- **iOS**: Widget estático com texto informativo (requer app aberto para interagir)
- **Android**: Widget interativo que abre o app no Cartão de Crise

## Estado

- O widget é **planejado mas não implementado**.
- Os arquivos descritos neste documento não existem no codebase atual.
- O app funciona 100% sem o widget instalado.
