# Instruções para agentes

## Contexto do projeto

- Este é um app móvel Expo/React Native com TypeScript para autonomia, previsibilidade e regulação de adultos no Espectro Autista.
- O app é offline-first: o estado de usuário deve continuar funcionando sem rede e é persistido localmente com Zustand + AsyncStorage.
- Preserve a baixa carga cognitiva: uma ação principal por tela, transições suaves, contraste legível e ausência de alertas visuais agressivos.
- Consulte [README.md](README.md) para o panorama funcional e [WIDGET_SETUP.md](WIDGET_SETUP.md) antes de alterar o widget. O widget **existe no Android** (fontes em `widget/android/`, injetadas por `plugins/withCrisisWidget.js`) e **não existe no iOS**.

## Comandos

```bash
npm install
npm run lint
npm run typecheck
npm test
npx expo start
npx expo export --platform android   # valida o bundle de todas as rotas
npm run android
npm run ios
npx eas build -p android --profile preview
```

Para qualquer alteração, execute `npm run lint`, `npm run typecheck` e `npm test`. Os testes (jest-expo) cobrem os stores em `src/stores/__tests__/`; quando mudar regra de domínio num store, estenda o teste correspondente.

O projeto é **managed workflow**: não existe pasta `ios/` versionada e `android/` está no `.gitignore` (só `android/app/build.gradle` é rastreado, para o `versionCode` do F-Droid). Portanto `npm run android`, `npm run ios` e qualquer comando Gradle exigem gerar a pasta nativa antes:

```bash
npx expo prebuild -p android   # ou -p ios; cria android/ ou ios/

# JDK 17 é obrigatório: o AGP 8.1.1 do SDK 50 falha com JDK 21 (jlink)
JAVA_HOME=/caminho/para/jdk17 ./android/gradlew assembleRelease
```

Para instalar no aparelho, use `assembleRelease`. O APK `debug` não embute o
bundle JS e depende do Metro em `localhost:8081`.

Só faça isso quando a tarefa realmente exigir build nativo — `expo prebuild` gera dezenas de arquivos e `npx expo export` já valida o bundle JS sem esse custo.

## Organização e limites

- `src/app/`: telas e rotas Expo Router. Cada arquivo `.tsx` é uma rota; `_layout.tsx` define o Stack, o SafeAreaProvider, o StatusBar e o `EmergencyFab` global.
- `src/components/`: componentes de UI reutilizáveis e interações compartilhadas.
- `src/stores/`: estado de domínio e persistência local. Stores atuais cobrem check-ins, crise, rotinas e cartões de regulação.
- `src/types/`: tipos e dados padrão do domínio.
- `src/hooks/`, `src/lib/` e `src/constants/`: extensões da arquitetura; mantenha a lógica fora das telas quando ela deixar de ser específica da apresentação.
- O fluxo existente é predominantemente `app -> components -> stores -> types`; não introduza uma camada de rede ou repositório sem necessidade concreta.

## Convenções de implementação

- Use os aliases `@/...` definidos em `tsconfig.json` para imports dentro de `src`.
- Siga Expo Router: use `useRouter` para navegação imperativa e `useLocalSearchParams` em rotas dinâmicas como `src/app/coping-card/[id].tsx`.
- Prefira `StyleSheet` e os padrões visuais já presentes nas telas (o projeto não usa CSS-in-JS nem utilitários de estilo).
- Para estado persistido, siga o padrão dos stores existentes: `create`, `persist`, `createJSONStorage` e `AsyncStorage`, com um nome de storage estável.
- Não mutile o estado dos stores. Mantenha ações de domínio no store e trate regras como mensagens padrão não excluíveis no próprio store.
- Adicione `accessibilityLabel`, `accessibilityHint` e estado semântico a controles interativos, especialmente ações de crise, seleção de níveis e favoritos.
- Evite animações piscantes, contagens que aumentem ansiedade e cores agressivas. Mudanças no fluxo de crise devem manter acesso rápido e funcionar offline.

## Android e arquivos nativos

- Alterações em código nativo exigem `npx expo prebuild` antes e validação com Gradle depois. `android/local.properties` é gerado localmente e não deve ser commitado.
- O widget do Android é entregue por config plugin: os fontes versionados ficam em `widget/android/` e são copiados para `android/` a cada `expo prebuild`. **Nunca edite os arquivos gerados em `android/`** — a mudança seria perdida no próximo prebuild. Altere o fonte em `widget/android/` ou o plugin.
- `WIDGET_SETUP.md` afirma que o widget iOS não está implementado. Confirme os arquivos antes de documentar qualquer integração de widget.
- Antes de documentar um recurso, verifique que ele existe no código. Prefira um "não implementado" explícito a instruções de setup que não funcionam.
- Preserve configurações existentes de Hermes, New Architecture e SDK salvo quando a tarefa exigir mudança explícita.
- Não exponha dados sensíveis de contatos ou mensagens em logs, fixtures ou mensagens de erro.

## Processo de mudança

1. Leia a tela, componente, store e tipo diretamente envolvidos antes de editar.
2. Mantenha a mudança pequena e preserve APIs públicas e comportamento offline.
3. Atualize documentação somente quando o comportamento ou o setup realmente mudar.
4. Execute lint, typecheck e testes após a alteração.