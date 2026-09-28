# Instruções para agentes

## Contexto do projeto

- Este é um app móvel Expo/React Native com TypeScript para autonomia, previsibilidade e regulação de adultos no Espectro Autista.
- O app é offline-first: o estado de usuário deve continuar funcionando sem rede e é persistido localmente com Zustand + AsyncStorage.
- Preserve a baixa carga cognitiva: uma ação principal por tela, transições suaves, contraste legível e ausência de alertas visuais agressivos.
- Consulte [README.md](README.md) para o panorama funcional e [WIDGET_SETUP.md](WIDGET_SETUP.md) antes de alterar integrações de widgets.

## Comandos

```bash
npm install
npm run lint
npx tsc --noEmit
npx expo start
npm run android
npm run ios
npx eas build -p android --profile preview
cd android && ./gradlew assembleDebug
```

Não há runner de testes configurado atualmente. Para qualquer alteração, execute pelo menos `npm run lint` e `npx tsc --noEmit`; para mudanças nativas, valide também o build correspondente.

## Organização e limites

- `src/app/`: telas e rotas Expo Router. Cada arquivo `.tsx` é uma rota; `_layout.tsx` define o Stack, o SafeAreaProvider, o StatusBar e o `EmergencyFab` global.
- `src/components/`: componentes de UI reutilizáveis e interações compartilhadas.
- `src/stores/`: estado de domínio e persistência local. Stores atuais cobrem check-ins, crise, rotinas e cartões de regulação.
- `src/types/`: tipos e dados padrão do domínio.
- `src/hooks/`, `src/lib/`, `src/services/`, `src/features/` e `src/constants/`: extensões da arquitetura; mantenha a lógica fora das telas quando ela deixar de ser específica da apresentação.
- O fluxo existente é predominantemente `app -> components -> stores -> types`; não introduza uma camada de rede ou repositório sem necessidade concreta.

## Convenções de implementação

- Use os aliases `@/...` definidos em `tsconfig.json` para imports dentro de `src`.
- Siga Expo Router: use `useRouter` para navegação imperativa e `useLocalSearchParams` em rotas dinâmicas como `src/app/coping-card/[id].tsx`.
- Prefira `StyleSheet` e os padrões visuais já presentes nas telas. NativeWind está instalado e configurado, mas não substitua estilos existentes em massa.
- Para estado persistido, siga o padrão dos stores existentes: `create`, `persist`, `createJSONStorage` e `AsyncStorage`, com um nome de storage estável.
- Não mutile o estado dos stores. Mantenha ações de domínio no store e trate regras como mensagens padrão não excluíveis no próprio store.
- Adicione `accessibilityLabel`, `accessibilityHint` e estado semântico a controles interativos, especialmente ações de crise, seleção de níveis e favoritos.
- Evite animações piscantes, contagens que aumentem ansiedade e cores agressivas. Mudanças no fluxo de crise devem manter acesso rápido e funcionar offline.

## Android e arquivos nativos

- Alterações em `android/` exigem validação com Gradle e podem depender de `android/local.properties` e do ambiente local.
- Não trate `WIDGET_SETUP.md` como prova de que os arquivos do widget existem: confirme os arquivos nativos antes de editar ou documentar a integração.
- Preserve configurações existentes de Hermes, New Architecture e SDK salvo quando a tarefa exigir mudança explícita.
- Não exponha dados sensíveis de contatos ou mensagens em logs, fixtures ou mensagens de erro.

## Processo de mudança

1. Leia a tela, componente, store e tipo diretamente envolvidos antes de editar.
2. Mantenha a mudança pequena e preserve APIs públicas e comportamento offline.
3. Atualize documentação somente quando o comportamento ou o setup realmente mudar.
4. Execute lint e typecheck após a alteração; inclua a limitação de testes automatizados no relatório quando relevante.