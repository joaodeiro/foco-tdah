# gestaovet — guia para agentes

Sistema pessoal de atendimento veterinário a domicílio (cães e gatos): cadastro de tutores/pacientes, consultas, receitas (inclusive controladas em 2 vias), encaminhamentos, orçamentos e tabela de preços. Usuária final não é técnica — priorize simplicidade e telas práticas.

## Regras do projeto

- **Idioma**: toda a interface, mensagens e commits em português do Brasil.
- **Next.js 16**: há mudanças em relação a versões antigas (ex.: `proxy.ts` no lugar de `middleware.ts`; `params`/`cookies()` sempre assíncronos). Em caso de dúvida, leia os guias em `node_modules/next/dist/docs/` antes de escrever código.
- `docs/messages.md` — catálogo completo de toasts, erros e mensagens ao usuário. **Atualizar sempre que adicionar ou mudar uma mensagem.**
- Banco: Supabase (projeto `gestaovet`, org João Deiró, região sa-east-1). Esquema espelhado em `supabase/migrations/`. Toda tabela tem `user_id` com RLS — nunca remova as políticas.
- Impressão: documentos são páginas do grupo de rotas `(print)`, em A4 via impressão do navegador. Componentes compartilhados em `src/components/doc.tsx`.

## Comandos

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção (use para validar tipos antes de commitar)
