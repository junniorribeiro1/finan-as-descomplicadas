<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Diretrizes de Git e Versionamento

> [!CAUTION]
> **NÃO FAZER COMMIT OU SYNC/PUSH AUTOMATICAMENTE:**
> - O assistente **NUNCA** deve executar comandos `git commit`, `git push`, `git merge` ou sincronização automática.
> - O processo de `git add`, `git commit` e `git push` será feito **manualmente e exclusivamente pelo USUÁRIO**.
> - Ao concluir as tarefas ou alterações de código, o assistente deve apenas validar a compilação (`build`) se necessário, e apresentar ao usuário os arquivos modificados para que ele próprio decida quando e como comitar.
