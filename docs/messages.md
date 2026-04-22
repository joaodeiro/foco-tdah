# Mensagens do Kairos

Registro de **todos** os toasts, erros e notificações do usuário. Fonte única:
`src/lib/errors.ts`.

## Como encontrar rápido

Qualquer mensagem de toast nasce de uma destas 4 funções:

```
showError(err)                    // erro externo, passa por translateError
showValidation(message, hint?)    // validação client-side, texto já pronto em PT-BR
showSuccess(message, description?)
showInfo(message, description?)
```

Comando único pra listar tudo:

```bash
grep -rn "show\(Error\|Validation\|Success\|Info\)(" src/
```

Comando pra encontrar apenas traduções automáticas de erros externos:

```bash
grep -n "raw.includes\|e.status ===\|e.code ===" src/lib/errors.ts
```

---

## 1. Catálogo de traduções automáticas

Vive em `src/lib/errors.ts` na função `translateError`. Qualquer `Error` passado por `showError(err)` cai num desses cases.

| Gatilho (match) | Mensagem PT-BR | Dica |
|---|---|---|
| `invalid login credentials` | E-mail ou senha incorretos. | Confira se digitou certo. Se esqueceu, use "Esqueci". |
| `email not confirmed` | Seu e-mail ainda não foi confirmado. | Verifique sua caixa de entrada (e a pasta de spam) e clique no link. |
| `user already registered` / `already been registered` | Esse e-mail já tem uma conta. | Vá em "Entrar", ou use "Esqueci" se não lembra da senha. |
| `new password should be different` / `same as the old` | A nova senha precisa ser diferente da atual. | Escolha algo que você não usou antes. |
| `current password required` / `reauthentication` | Sua sessão de recuperação expirou. | Volte em "Esqueci minha senha" e peça um novo link. |
| `aud claim` / `session missing` | Sua sessão é inválida ou expirou. | Saia e entre de novo para renovar. |
| `password should be at least N` | A senha precisa ter pelo menos N caracteres. | Misture letras, números e um símbolo. |
| `password is known to be weak` / `weak password` | Essa senha é muito comum e fácil de adivinhar. | Evite palavras óbvias e sequências como 123456. |
| `invalid email` | E-mail inválido. | Confira se não faltou o @ ou o domínio. |
| `rate limit` / `too many` / status 429 | Muitas tentativas em pouco tempo. | Aguarde uns 2 minutos e tente de novo. |
| `token has expired` / `link is invalid` / `otp_expired` | Esse link expirou ou já foi usado. | Peça um novo em "Esqueci minha senha". |
| `user not allowed` / `user not found` | Não encontrei uma conta com esse e-mail. | Confira se digitou certo, ou crie uma conta nova. |
| `jwt` / `session invalid` | Sua sessão expirou. | Saia e entre de novo. |
| `network` / `fetch failed` / `failed to fetch` | Sem conexão com o servidor. | Verifique sua internet. |
| Postgres code `23505` / `duplicate key` | Esse registro já existe. | Talvez você tenha criado algo igual antes. |
| Postgres code `23503` / `foreign key` | Não consegui salvar por uma referência inválida. | Recarregue a página. |
| `row-level security` / `permission denied` | Você não tem permissão para fazer isso. | Saia e entre de novo. |
| status 401 | Você precisa estar logado. | Faça login e tente de novo. |
| status 403 | Você não tem permissão para isso. | Saia e entre de novo. |
| status ≥ 500 | O servidor teve um problema. | Não é culpa sua — aguarde um minuto. |
| fallback (qualquer outro) | Algo deu errado. | Tente de novo. Se persistir, saia e entre de novo. |

### Erros específicos da IA (`gemini.chat`)

Vivem em `src/lib/ai/gemini.ts` no método `chat`. Retornam como `reply` do chat (o usuário lê dentro da conversa, não como toast).

| Gatilho | Mensagem |
|---|---|
| `api key` / `api_key_invalid` / status 401/403 | A chave da IA está inválida ou expirada. Peça pra quem configurou atualizar no painel de deploy. |
| `quota` / `rate` / status 429 | Atingi o limite de requisições da IA agora. Espere um minuto e tente de novo. |
| `safety` / `blocked` / `filter` | A IA bloqueou essa mensagem por filtros internos. Tente formular de outra maneira. |
| `model not found` | O modelo configurado não existe mais. Atualize a variável AI_MODEL. |
| JSON inválido | A resposta da IA veio em formato inesperado. |
| JSON vazio | Não consegui entender. Tente reformular. |

---

## 2. Registro de todas as chamadas

### `showError(err)` — erros externos traduzidos

| Arquivo | Linha | Gatilho |
|---|---|---|
| `src/app/auth/login/page.tsx` | 41 | `signInWithPassword` retornou erro |
| `src/app/auth/signup/page.tsx` | 43 | `signUp` retornou erro |
| `src/app/auth/forgot/page.tsx` | 26 | `resetPasswordForEmail` retornou erro |
| `src/app/auth/reset/page.tsx` | 45 | `exchangeCodeForSession` retornou erro na verificação do link |
| `src/app/auth/reset/page.tsx` | 98 | `updateUser({ password })` retornou erro |
| `src/app/app/profile/page.tsx` | 45 | `profiles.update` retornou erro |
| `src/hooks/useTasks.ts` | 51 | `tasks.insert` (criar tarefa) retornou erro |
| `src/hooks/useTasks.ts` | 64 | `tasks.update` retornou erro |
| `src/hooks/useTasks.ts` | 80 | `tasks.delete` retornou erro |
| `src/hooks/useTasks.ts` | 97 | `task_steps.insert` (salvar passos) retornou erro |
| `src/hooks/useJournal.ts` | 58 | `journal_entries.upsert` retornou erro |
| `src/hooks/useDayPlan.ts` | 65 | `/api/ai/suggest` retornou não-OK |
| `src/hooks/useChat.ts` | 116 | `/api/ai/chat` retornou não-OK (mensagem vem do body) |
| `src/hooks/useChat.ts` | 135 | Exceção não tratada no envio do chat |
| `src/components/tasks/BreakdownSheet.tsx` | 41 | `/api/ai/breakdown` retornou não-OK |

### `showValidation(msg, hint?)` — validações client-side (texto PT-BR já pronto)

| Arquivo | Linha | Mensagem | Dica |
|---|---|---|---|
| `src/app/auth/login/page.tsx` | 17 | Seu link expirou ou já foi usado. | Peça um novo em "Esqueci minha senha". |
| `src/app/auth/login/page.tsx` | 19 | Não consegui validar esse link. | Peça um novo link e tente de novo. |
| `src/app/auth/signup/page.tsx` | 23 | Senha muito curta. | Precisa ter pelo menos 8 caracteres. |
| `src/app/auth/signup/page.tsx` | 27 | As senhas não coincidem. | Digite a mesma senha nos dois campos. |
| `src/app/auth/reset/page.tsx` | 71 | Link de recuperação expirado. | Peça um novo em "Esqueci minha senha". |
| `src/app/auth/reset/page.tsx` | 84 | Senha muito curta. | Precisa ter pelo menos 8 caracteres. |
| `src/app/auth/reset/page.tsx` | 88 | As senhas não coincidem. | Digite a mesma senha nos dois campos. |

### `showSuccess(msg, description?)` — confirmações positivas

| Arquivo | Linha | Mensagem | Descrição |
|---|---|---|---|
| `src/app/auth/reset/page.tsx` | 102 | Senha atualizada. | Já pode entrar com ela. |
| `src/app/app/profile/page.tsx` | 46 | Perfil atualizado. | — |
| `src/app/app/page.tsx` | 42 | Top 3 sugerido. | Começar por uma delas já vale o dia. |
| `src/hooks/useTasks.ts` | 75 | Tarefa concluída. | Mais uma conquista para o diário. |
| `src/hooks/useTasks.ts` | 132 | Contexto salvo. | Pode pausar sem perder de onde parou. |
| `src/hooks/useJournal.ts` | 62 | Diário salvo. | — |
| `src/hooks/useJournal.ts` | 91 | `{N} dias seguidos` (interpolado) | Você tá construindo um hábito. |

### `showInfo(msg, description?)` — avisos neutros

| Arquivo | Linha | Mensagem | Descrição |
|---|---|---|---|
| `src/app/app/page.tsx` | 36 | Defina sua energia primeiro. | A IA usa ela para escolher tarefas do seu tamanho agora. |
| `src/hooks/useDayPlan.ts` | 74 | A IA não sugeriu nenhuma tarefa válida. | Adicione mais tarefas e tente de novo. |

---

## 3. Convenções para adicionar uma nova mensagem

### Regra 1 · nunca chame `toast.*` diretamente
Use os helpers. Se precisar de um comportamento novo (ex.: toast persistente), adicione helper em `src/lib/errors.ts`, não um `toast.warning` solto.

### Regra 2 · qual helper usar

- **Erro de API, Supabase, rede, qualquer erro externo** → `showError(err)`. Ele traduz.
- **Falha de validação que você mesmo detectou** (senha curta, campos vazios) → `showValidation('msg', 'hint')`. Já em PT-BR.
- **Ação deu certo** → `showSuccess('msg', 'descrição opcional')`.
- **Aviso sem erro e sem sucesso** (estado não ideal mas não problema) → `showInfo(...)`.

### Regra 3 · estrutura da mensagem (Norman)

Toda mensagem responde 3 perguntas:
1. **O quê** aconteceu — a mensagem principal.
2. **Por quê** — implícito ou explícito na mensagem.
3. **Como resolver** — hint/description.

Se a mensagem não carrega (1) e (3), está incompleta. Revisar.

### Regra 4 · se for erro externo novo que caiu no fallback genérico

Adicione um novo `if (raw.includes(...))` em `translateError` (`src/lib/errors.ts`). Atualize este `.md` na seção **Catálogo de traduções automáticas**.

### Regra 5 · atualizar este documento

Quando mexer em toast, rodar:

```bash
grep -rn "show\(Error\|Validation\|Success\|Info\)(" src/
```

e verificar se esta tabela ainda bate. Se crescer muito, considerar gerar automaticamente.

---

## 4. Fora do escopo deste registro

Estes existem mas **não** são toasts:

- Empty states (`<p>Tela em branco? Ótimo.</p>` etc.) — vivem embutidos nos componentes de página.
- Erros inline em forms — usamos `required` / `minLength` nativos do HTML.
- Tela cheia `/auth/reset` quando link inválido — custom UI, não toast.
- Mensagens da IA dentro do chat (`ChatSheet`) — vêm como `reply` de `gemini.chat()`, não como toast. Ver seção "Erros específicos da IA" acima.

Se algum dia virarem toast ou precisarem de registro, mover pra cá.
