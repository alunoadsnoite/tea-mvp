# Candidata 1.0.13

O círculo de respiração usa dimensões iguais e reserva espaço para a expansão. O rótulo fica fora da transformação e acompanha a fonte do sistema. O botão de emergência usa tamanho mínimo e padding para não cortar o símbolo com fonte ampliada. O botão Próximo Passo já avançava corretamente: foram adicionados testes da tela para execução e pausa, sem alterar sua regra de domínio.

Versões sincronizadas: package.json/package-lock.json/app.json/Gradle 1.0.13, versionCode 13. Fastlane pt-BR e en-US com changelogs 13 e 131–134.

Validação: lint, TypeScript, 58 testes, exportação Android e assembleRelease com Java 17 aprovados. APK de teste instalado no Motorola Edge 70 Fusion Android 17. Assinado com chave Android Debug, não é referência de assinatura de produção. Resultados físicos e limites estão em TESTE_MOTOROLA_EDGE.md.

## Publicação após revisão

1. Conferir os checks do PR e integrar as alterações em main.
2. Criar v1.0.13 no commit que contém a versão integrada, sem mover tags existentes.
3. Acompanhar o mecanismo de atualização por tags já configurado no fdroiddata. Códigos esperados: 131/132/133/134. Validar os quatro builds e relatórios; o build local não substitui esse processo.
4. Confirmar a disponibilidade no catálogo F-Droid. MR inicial !50479 já está integrada, não criar outra.

A cópia com.teamvp.app.yml representa a receita já integrada da 1.0.12 e fixa sua fonte real. Atualizá-la somente após existir uma nova receita efetivamente integrada. Nenhuma tag da candidata foi publicada durante a preparação.
