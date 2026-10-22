# TEA Autonomia 1.0.11 — correções compartilhadas

A comparação com o [relatório do TEA Kids](https://github.com/alunoadsnoite/tea-mvp-childs/issues/4) revelou que a lista do adulto também reiniciava uma execução salva ao selecionar Iniciar. O widget usava o mesmo padrão de tarefa e o SOS era absoluto. O cartão do adulto já possuía proteções para seleção e exclusão, mas não oferecia rolagem vertical para texto que excedesse a tela.

## Alterações

- A lista oferece Voltar à rotina para a execução salva; não chama startExecution nessa ação e conserva os horários, o passo e a pausa. Retomar continua sendo uma ação explícita na tela de execução.
- O ID ativo persistido determina a página, o conteúdo e o contador do cartão. Montagem, rotação, mudanças de conteúdo e exclusão mantêm o deslocamento sincronizado.
- Cada página tem rolagem vertical; o corpo não encolhe com flexShrink.
- O SOS ocupa uma faixa própria com safe area fora do Stack; o cartão de crise continua sem esse botão duplicado.
- O widget usa MainActivity explícita e NEW_TASK/CLEAR_TASK, e o layout aplica o URI de crise quando a navegação está pronta. Isso pode reiniciar a navegação anterior; os dados persistidos não são apagados.

## Verificação

42 testes Jest/Expo, lint e TypeScript passaram, incluindo seis regressões de cartão, seleção/exclusão, execução salva, intenção inicial e início comum sem redirecionamento. A compilação Android é registrada na resposta do PR.

Os emuladores deste computador falharam com SIGSEGV antes de instalar o app. Não se afirma que os seis problemas do Kids tenham sido todos reproduzidos no adulto, nem que houve repetição visual em fonte 200%, toque real no widget ou teste humano de usabilidade. As alterações de código e os testes automatizados precisam de conferência independente em aparelho/emulador funcional.
