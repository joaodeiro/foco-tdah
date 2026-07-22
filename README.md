# gestaovet 🐾

Sistema pessoal de atendimento veterinário a domicílio, para cães e gatos. Feito para uma rotina prática: cadastrar o paciente uma vez e, a cada atendimento, registrar a consulta, emitir a receita e imprimir na hora.

## O que ele faz

- **Pacientes** — cadastro de tutores (nome, CPF, RG, telefone, e-mail, endereço) e animais (cão/gato, raça, sexo, idade, peso). Busca por nome do animal, do tutor ou raça.
- **Ficha do paciente** — todo o histórico em um lugar: consultas e retornos, receitas, documentos e orçamentos.
- **Consultas** — queixa/anamnese, exame físico, diagnóstico, conduta. Tipo "consulta" ou "retorno".
- **Receitas** — simples ou **controlada** (impressa em 2 vias no modelo de receituário de controle especial). Salva no histórico e abre direto na tela de impressão.
- **Documentos** — encaminhamento para internação (com modelo pronto), atestado ou documento livre, todos imprimíveis.
- **Orçamentos** — lista de itens com quantidade e valor unitário, desconto e total automático. Itens podem vir da tabela de preços com um clique. Imprime a descrição dos valores para deixar com o tutor.
- **Serviços e preços** — tabela de valores dos seus serviços (consulta, fluidoterapia, medicação injetável...).
- **Configurações** — seus dados profissionais (nome, CRMV, contato, endereço) que saem no cabeçalho e na assinatura de todos os documentos.

A impressão usa a impressão do navegador (Ctrl+P automático pelo botão **Imprimir**) em formato A4 — funciona com qualquer impressora instalada no computador ou celular.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Supabase](https://supabase.com) — banco Postgres, autenticação por e-mail/senha e RLS (cada conta enxerga apenas os próprios dados)
- sonner (toasts) e lucide-react (ícones)

## Rodando localmente

```bash
npm install
npm run dev
```

As chaves públicas do Supabase ficam em `src/lib/supabase/config.ts` (constantes no código, de propósito — o projeto da Vercel herda variáveis de ambiente do app anterior que teriam prioridade sobre um `.env`).

Abra http://localhost:3000, crie sua conta (e-mail e senha) e comece pelo menu **Ajustes** preenchendo seu nome e CRMV.

O esquema do banco está em `supabase/migrations/001_init.sql` (já aplicado no projeto Supabase `gestaovet`, região São Paulo).

## Estrutura

```
src/
  app/
    login/                autenticação
    (app)/                telas internas (com menu)
      pacientes/          lista, novo cadastro, ficha, edição
      pacientes/[id]/     consultas/nova, receitas/nova, documentos/novo
      consultas/[id]/     edição de consulta
      orcamentos/         lista e novo orçamento
      servicos/           tabela de preços
      configuracoes/      perfil profissional
    (print)/              páginas de impressão (receitas, documentos, orçamentos)
  components/             UI, formulários e layout dos documentos impressos
  lib/                    tipos, formatação e clientes Supabase
  proxy.ts                proteção de rotas (sessão Supabase)
docs/messages.md          catálogo de todas as mensagens ao usuário
```
