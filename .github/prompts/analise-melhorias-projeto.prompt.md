---
name: "Analisar projeto e propor melhorias"
description: "Revise este projeto, identifique oportunidades de melhoria e proponha próximos passos priorizados com evidências no código."
argument-hint: "Foco opcional da análise (ex.: acessibilidade, arquitetura, segurança)"
agent: "ask"
---

Analise este projeto e proponha melhorias concretas, priorizadas e sustentadas por evidências. Use o foco informado pelo usuário, se houver: ${input:foco:Foco opcional; deixe em branco para uma revisão geral}.

Comece lendo as instruções aplicáveis do repositório e identificando a stack, os comandos de validação e a estrutura relevante. Inspecione código, configurações, documentação e testes existentes conforme necessário. Baseie cada conclusão no estado atual do workspace; não presuma que funcionalidades descritas na documentação estejam implementadas. Ignore dependências instaladas e artefatos gerados, como `node_modules/`, `dist/` e diretórios de build.

Para este app, verifique sempre estes eixos: experiência de adultos autistas, baixa carga cognitiva e acessibilidade; arquitetura, manutenção e qualidade; privacidade de dados sensíveis, funcionamento offline, persistência local e resiliência em situações de crise. Confira também a consistência entre documentação e implementação. Trate esses pontos como critérios para investigar, não como motivos para inventar problemas nem para forçar recomendações.

Não altere arquivos nem implemente as sugestões. Não execute comandos destrutivos ou que modifiquem o projeto. Se uma conclusão depender de comportamento que não possa ser confirmado apenas pela inspeção, identifique essa incerteza e proponha uma verificação segura.

Apresente a resposta em português, neste formato:

1. **Resumo**: estado geral em poucas linhas e os principais riscos ou oportunidades.
2. **Melhorias priorizadas**: ordene por impacto e urgência. Para cada item, informe:
   - **O que melhorar** e qual problema ou oportunidade isso representa.
   - **Evidência**: referências a arquivos e símbolos relevantes; diferencie fatos observados de inferências.
   - **Benefício e risco de não agir**.
   - **Esforço estimado**: pequeno, médio ou grande, com uma justificativa breve.
   - **Próximo passo** verificável e específico.
3. **Pontos fortes**: decisões ou comportamentos existentes que vale preservar.
4. **Cobertura dos eixos**: uma síntese breve do que foi verificado em UX/acessibilidade, arquitetura/qualidade e privacidade/resiliência; sinalize quando não encontrou problemas relevantes.
5. **Verificações sugeridas**: comandos ou testes existentes adequados para investigar os itens, sem afirmar que foram executados se não foram.

Evite recomendações genéricas, duplicadas ou sem evidência. Não proponha reescritas amplas quando uma mudança localizada resolver o problema. Se não encontrar evidência suficiente para uma recomendação, omita-a ou marque claramente como hipótese.
