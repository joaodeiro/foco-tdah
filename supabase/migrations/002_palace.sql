-- ═══════════════════════════════════════════════════════════════════
-- Kairos Palace — sistema de memória de longo prazo
-- Inspirado em MemPalace (MIT, milla-jovovich/mempalace) portado pra TS+Supabase
--
-- Rode inteiro no SQL Editor do Supabase. Idempotente (pode re-rodar).
-- ═══════════════════════════════════════════════════════════════════

-- ─── Wings (asas) · temas grandes ──────────────────────────────────
create table if not exists memory_wings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  summary text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, name)
);

-- ─── Rooms (salas) · sub-temas dentro de uma asa ───────────────────
create table if not exists memory_rooms (
  id uuid primary key default uuid_generate_v4(),
  wing_id uuid references memory_wings(id) on delete cascade not null,
  name text not null,
  summary text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (wing_id, name)
);

-- ─── Memories (gavetas) · entradas verbatim com validade temporal ──
create table if not exists memories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  wing_id uuid references memory_wings(id) on delete set null,
  room_id uuid references memory_rooms(id) on delete set null,

  content text not null,
  kind text not null check (kind in ('fact','preference','event','decision','context','pattern')),

  -- Validade temporal (MemPalace pattern)
  valid_from timestamptz default now(),
  valid_until timestamptz,
  invalidated_by uuid references memories(id),
  invalidated_reason text,

  -- Rastreio da origem
  source_type text check (source_type in ('chat','task','journal','manual','inferred')),
  source_id uuid,

  -- Qualidade
  confidence numeric default 1.0 check (confidence >= 0 and confidence <= 1),

  -- Full-text search em português
  tsv tsvector generated always as (to_tsvector('portuguese', content)) stored,

  created_at timestamptz default now()
);

create index if not exists memories_tsv_idx on memories using gin(tsv);
create index if not exists memories_active_idx on memories(user_id) where valid_until is null;
create index if not exists memories_kind_idx on memories(user_id, kind);
create index if not exists memories_wing_idx on memories(wing_id) where wing_id is not null;
create index if not exists memories_room_idx on memories(room_id) where room_id is not null;

-- ─── Row Level Security ────────────────────────────────────────────
alter table memory_wings enable row level security;
alter table memory_rooms enable row level security;
alter table memories enable row level security;

drop policy if exists "own_wings"    on memory_wings;
drop policy if exists "own_rooms"    on memory_rooms;
drop policy if exists "own_memories" on memories;

create policy "own_wings"
  on memory_wings for all
  using (auth.uid() = user_id);

create policy "own_rooms"
  on memory_rooms for all
  using (wing_id in (select id from memory_wings where user_id = auth.uid()));

create policy "own_memories"
  on memories for all
  using (auth.uid() = user_id);
