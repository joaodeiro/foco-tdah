# Release · Kairos Palace + Groq

Sistema de memória de longo prazo para Kairos, inspirado em **MemPalace** (MIT, milla-jovovich/mempalace) portado para nossa stack Next.js + Supabase + TypeScript. Em paralelo, migração do provider de LLM de Gemini para Groq.

**Status atual**: migração 002_palace.sql entregue, aguardando rodar no Supabase antes de qualquer alteração em código.

---

## Decisões fechadas

### LLM provider: Groq

- **Por quê**: Gemini free tier estoura com volume de chat + extração de memória. Groq tem free tier largo (~14.400 req/dia), latência sub-200ms, hospeda Llama 3.3 70B e Qwen 2.5.
- **Modelo default**: `llama-3.3-70b-versatile` (128k context, excelente em JSON estruturado, PT-BR robusto). Alternativa: `qwen-2.5-32b`.
- **Endpoint**: `https://api.groq.com/openai/v1/chat/completions` (OpenAI-compatible, não precisa instalar SDK novo; pode usar `fetch` direto).
- **Env vars necessárias no Vercel**:
  - `GROQ_API_KEY` (a gerada em console.groq.com)
  - `AI_PROVIDER=groq` (opcional — code default será groq)
  - `AI_MODEL=llama-3.3-70b-versatile` (opcional)
- **Deletar** `GEMINI_API_KEY` do Vercel depois que o swap for validado.

### Memória: Kairos Palace (nativo, não MemPalace externo)

MemPalace é Python. Portar pra TS preserva a filosofia (método dos loci, validade temporal, wake-up barato) sem depender de serviço Python externo.

**Hierarquia adaptada**:
- **Wings** (asas) → grandes temas da vida: "Trabalho", "Saúde mental", "Relacionamentos", "Projeto X".
- **Rooms** (salas) → sub-temas dentro de uma asa: "Relatório Q4", "Terapia", "Marina".
- **Memories** (gavetas) → entradas verbatim tipadas (fact/preference/event/decision/context/pattern), com validade temporal (`valid_from`, `valid_until`, `invalidated_by`).

**Armazenamento**: Supabase Postgres (sem serviço externo, sem custo extra).
**Busca**: Full-text search em português via `tsvector` gerado automaticamente (GIN index).
**Futuro**: pgvector + embeddings locais via transformers.js quando escalar.

**Camadas de acesso**:
| Camada | Custo | O que carrega |
|---|---|---|
| L0 | ~40 tokens | Identidade do usuário (nome, TDAH, dias de uso) |
| L1 | ~120 tokens | Asas ativas (top 5) com resumo curto |
| L2 | Sob demanda | `recall(query)` via FTS retorna N memórias relevantes |
| L3 | Sob demanda | Timeline completo de uma sala/asa |

Total wake-up: ~170 tokens, mesmo alvo do MemPalace original.

---

## Fila de trabalho (Fluxo Unificado, WIP=1)

Ordem de execução após migração rodar:

| ID | Item | Tamanho | Depende de |
|---|---|---|---|
| **AI-01** | Swap Gemini → Groq no provider | S | GROQ_API_KEY no Vercel |
| **M-01** | Migração schema (wings, rooms, memories) com RLS | XS | (já pronto em 002_palace.sql) |
| **M-02** | Palace service TS (`wakeUp`, `recall`, `remember`, `invalidate`) | S | M-01 |
| **M-04** | Integrar Palace em `/api/ai/chat` (context injection) | S | M-02, AI-01 |
| **M-03** | Extração de memória do chat (LLM extrai fatos após cada turno) | M | M-04 |
| **M-05** | Auto-categorização (`placeMemory` via LLM) | M | M-02 |
| **M-06** | Invalidação por contradição | M | M-03 |
| **M-07** | UI `/app/palace` para inspecionar memórias | S | M-02 |
| **M-08** | Retenção/limite (auto-expira memórias antigas) | XS | M-02 |

---

## Schema (resumo — detalhes em `002_palace.sql`)

```
memory_wings (id, user_id, name, summary, timestamps)
  ↑ 1:N
memory_rooms (id, wing_id, name, summary, timestamps)
  ↑ 1:N
memories (
  id, user_id, wing_id?, room_id?,
  content, kind,
  valid_from, valid_until, invalidated_by, invalidated_reason,
  source_type, source_id, confidence,
  tsv (FTS pt gerado),
  timestamps
)
```

RLS aplicada: usuário só vê suas próprias wings/rooms/memories.

---

## API TypeScript planejada (`src/lib/memory/palace.ts`)

```typescript
export class Palace {
  async wakeUp(userId: string): Promise<WakeUpContext>
  async recall(userId: string, query: string, limit?: number): Promise<Memory[]>
  async timeline(userId: string, scopeId: string): Promise<Memory[]>

  async remember(userId: string, params: {
    content: string
    kind: MemoryKind
    wing?: string   // cria se não existir
    room?: string   // cria se não existir
    source_type: MemorySource
    source_id?: string
    confidence?: number
  }): Promise<Memory>

  async invalidate(
    memoryId: string,
    reason: string,
    replacementId?: string
  ): Promise<void>

  async placeMemory(
    userId: string,
    content: string
  ): Promise<{ wingId: string; roomId: string }>
}
```

---

## Próximos passos do usuário (antes de eu continuar)

1. **Rodar `supabase/migrations/002_palace.sql`** no SQL Editor do Supabase (copiar e colar, Run).
2. **Gerar nova GROQ_API_KEY** em `console.groq.com/keys` (a compartilhada em chat deve ser revogada depois por segurança).
3. **Adicionar no Vercel** (`Settings → Environment Variables`): `GROQ_API_KEY=gsk_...`.
4. **Confirmar comigo** que os três passos estão feitos.

Após confirmação, eu puxo **AI-01** → **M-02** → **M-04** em sequência, cada um em commit separado.

---

## Referências

- [MemPalace no GitHub](https://github.com/milla-jovovich/mempalace) — inspiração conceitual (MIT)
- [Groq docs](https://console.groq.com/docs) — provider de LLM
- [Método dos loci](https://pt.wikipedia.org/wiki/M%C3%A9todo_dos_loci) — técnica mnemônica antiga
- `docs/releases/kairos-focus.md` — release anterior (concluída)
- `docs/messages.md` — catálogo de mensagens ao usuário (atualizar quando chegarmos no M-04)
