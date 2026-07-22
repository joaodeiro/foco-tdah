# Catálogo de mensagens ao usuário

Toasts, erros e textos exibidos pelo gestaovet. **Atualizar sempre que adicionar ou mudar uma mensagem.**

## Convenção de erros (obrigatória)

Toda mensagem de erro segue as convenções de usabilidade (Nielsen #9 — ajudar a pessoa a reconhecer, diagnosticar e se recuperar do erro):

1. **Título** — o que falhou, em linguagem simples ("E-mail ou senha incorretos", "Não deu para salvar a consulta").
2. **Descrição** — por que (quando se sabe) e **o que fazer** ("Confira os dados digitados...", "Verifique o Wi‑Fi e tente de novo").
3. Sem código técnico no título; detalhe técnico só como último recurso, na descrição do erro genérico.
4. Nunca culpar a pessoa; tom calmo e direto.

A tradução central fica em `src/lib/errors.ts`:

- `traduzirErroAuth(erro, contexto)` — erros de login/cadastro (Supabase Auth)
- `traduzirErroBanco(erro, acao)` — erros de leitura/gravação (PostgREST)
- `avisarErro(erro, acao)` — toast padronizado (título + descrição, 6 s)

**Nunca** usar `toast.error("Não foi possível X.")` sem descrição.

## Erros de autenticação (`traduzirErroAuth`) — exibidos em caixa na própria tela de login

| Causa (código Supabase) | Título | Descrição |
| --- | --- | --- |
| Sem rede | Sem conexão com o servidor | Verifique o Wi‑Fi ou os dados móveis do aparelho e tente de novo. |
| `invalid_credentials` | E-mail ou senha incorretos | Confira os dados digitados e tente de novo. Se ainda não tem conta, toque em "Primeira vez? Criar conta". |
| `email_not_confirmed` | Falta confirmar seu e-mail | Quando a conta foi criada, enviamos um link de confirmação para o seu e-mail. Abra o link (vale olhar o spam) e depois tente entrar de novo. |
| `user_already_exists` / `email_exists` / signup com identities vazio | Esse e-mail já tem conta | Toque em "Já tenho conta — entrar" e use a senha que você criou. |
| `weak_password` | Senha muito curta | Use uma senha com pelo menos 6 caracteres. |
| `email_address_invalid` / `validation_failed` | E-mail inválido | Confira se o e-mail foi digitado certinho, no formato nome@exemplo.com. |
| `over_email_send_rate_limit` / `over_request_rate_limit` | Muitas tentativas seguidas | Por segurança, aguarde uns 5 minutos antes de tentar de novo. |
| Qualquer outro | Não foi possível entrar / criar a conta | Aconteceu um erro inesperado ("{mensagem}"). Tente de novo em instantes; se continuar, mostre esta mensagem para quem cuida do sistema. |

## Fluxo de confirmação de e-mail (tela de login)

- Painel "Falta só confirmar seu e-mail": "Enviamos um link de confirmação para **{email}**. Abra o e-mail e toque no link para ativar a conta — se não encontrar, olhe também o spam e a aba Promoções." + "Depois é só voltar aqui e entrar."
- Botões: "Já confirmei — entrar" e "Não chegou? Reenviar e-mail".
- Toast após reenvio (sucesso): "E-mail reenviado!" / "Confira a caixa de entrada (e o spam) de {email}."

## Erros de banco (`traduzirErroBanco` via `avisarErro`)

| Causa | Título | Descrição |
| --- | --- | --- |
| Sem rede | Não deu para {ação} | O aparelho parece estar sem internet. Verifique o Wi‑Fi ou os dados móveis e tente de novo — o que você digitou continua na tela. |
| `PGRST301` / JWT | Sua sessão expirou | Por segurança, saia e entre de novo na conta. Depois repita a ação. |
| `42501` / RLS | Não deu para {ação} | Sua conta não tem permissão para esse registro. Saia e entre de novo; se continuar, mostre esta mensagem para quem cuida do sistema. |
| `23505` (duplicado) | Registro duplicado | Já existe um registro igual a esse. Confira a lista antes de salvar de novo. |
| Qualquer outro | Não deu para {ação} | Tente de novo em instantes. Se continuar acontecendo, mostre este detalhe para quem cuida do sistema: "{mensagem}". |

Ações usadas hoje: carregar os pacientes • salvar o tutor • salvar o animal • salvar as alterações • excluir {esta consulta/esta receita/este documento/este orçamento} • salvar a consulta • salvar a receita • salvar o documento • carregar os orçamentos • salvar o orçamento • excluir o orçamento • carregar os serviços • adicionar o serviço • criar a lista de exemplos • salvar a alteração • excluir o serviço • salvar o perfil.

## Validações (antes de enviar)

| Situação | Título | Descrição |
| --- | --- | --- |
| Cadastro sem nome do tutor | Falta o nome do tutor | Preencha o nome completo do tutor para salvar o cadastro. |
| Receita sem medicamento | Receita sem medicamentos | Preencha pelo menos o nome do primeiro medicamento antes de salvar. |
| Documento sem texto | Documento sem conteúdo | Escreva o texto do documento antes de salvar. |
| Orçamento sem itens | Orçamento sem itens | Adicione pelo menos um item com descrição antes de salvar. |

## Registro não encontrado (toast + volta para a lista)

| Situação | Título | Descrição |
| --- | --- | --- |
| Paciente inexistente | Paciente não encontrado | Ele pode ter sido excluído. Voltamos para a lista de pacientes. |
| Consulta inexistente | Consulta não encontrada | Ela pode ter sido excluída. Voltamos para a lista de pacientes. |

## Confirmações e sucessos

| Situação | Mensagem |
| --- | --- |
| Confirmação de exclusão (confirm) | Excluir {item}? Essa ação não tem volta. |
| Exclusão concluída | Excluído. |
| Paciente cadastrado | Paciente cadastrado! |
| Edição salva | Dados atualizados! |
| Consulta criada / editada | Consulta registrada! / Consulta atualizada! |
| Receita criada | Receita salva! Abrindo para impressão. |
| Documento criado | Documento salvo! Abrindo para impressão. |
| Orçamento criado | Orçamento salvo! Abrindo para impressão. |
| Serviço adicionado / editado | Serviço adicionado! / Serviço atualizado! |
| Lista de exemplos criada | Lista criada! Agora é só ajustar os valores. |
| Perfil salvo | Perfil salvo! |

## Avisos em tela (não são toasts)

- Impressão sem perfil preenchido: "Dica: preencha seu nome e CRMV em Configurações para eles saírem no cabeçalho."
- Orçamento sem tabela de preços: "Dica: cadastre seus serviços em Preços para adicioná-los aqui com um clique, sem digitar valores toda vez."
- Campo senha ao criar conta: "Pelo menos 6 caracteres."
