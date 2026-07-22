-- gestaovet — esquema inicial
-- Todas as tabelas pertencem à usuária logada (user_id) e são protegidas por RLS.

-- Perfil da veterinária: dados que aparecem no cabeçalho dos documentos impressos
create table public.perfis (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default '',
  crmv text not null default '',
  telefone text not null default '',
  email text not null default '',
  endereco text not null default '',
  cidade_uf text not null default '',
  updated_at timestamptz not null default now()
);

create table public.tutores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nome text not null,
  cpf text not null default '',
  rg text not null default '',
  email text not null default '',
  telefone text not null default '',
  endereco text not null default '',
  observacoes text not null default '',
  created_at timestamptz not null default now()
);

create table public.animais (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  tutor_id uuid not null references public.tutores(id) on delete cascade,
  nome text not null,
  especie text not null check (especie in ('cao', 'gato')),
  raca text not null default '',
  sexo text not null default '' check (sexo in ('macho', 'femea', '')),
  nascimento date,
  idade_texto text not null default '',
  peso_kg numeric(6,2),
  pelagem text not null default '',
  castrado boolean,
  observacoes text not null default '',
  created_at timestamptz not null default now()
);

create table public.consultas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  animal_id uuid not null references public.animais(id) on delete cascade,
  data timestamptz not null default now(),
  tipo text not null default 'consulta' check (tipo in ('consulta', 'retorno')),
  peso_kg numeric(6,2),
  anamnese text not null default '',
  exame_fisico text not null default '',
  diagnostico text not null default '',
  tratamento text not null default '',
  observacoes text not null default '',
  created_at timestamptz not null default now()
);

-- Receitas: itens em JSON [{ medicamento, quantidade, posologia }]
create table public.receitas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  animal_id uuid not null references public.animais(id) on delete cascade,
  data timestamptz not null default now(),
  tipo text not null default 'simples' check (tipo in ('simples', 'controlada')),
  itens jsonb not null default '[]'::jsonb,
  observacoes text not null default '',
  created_at timestamptz not null default now()
);

-- Documentos avulsos: encaminhamento de internação, atestados etc.
create table public.documentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  animal_id uuid not null references public.animais(id) on delete cascade,
  data timestamptz not null default now(),
  tipo text not null default 'encaminhamento' check (tipo in ('encaminhamento', 'atestado', 'outro')),
  titulo text not null default '',
  conteudo text not null default '',
  created_at timestamptz not null default now()
);

-- Tabela de preços dos serviços (usada para montar orçamentos)
create table public.servicos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nome text not null,
  valor numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

-- Orçamentos: itens em JSON [{ descricao, qtd, valor }]
create table public.orcamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  tutor_id uuid references public.tutores(id) on delete set null,
  animal_id uuid references public.animais(id) on delete set null,
  data timestamptz not null default now(),
  itens jsonb not null default '[]'::jsonb,
  desconto numeric(10,2) not null default 0,
  observacoes text not null default '',
  created_at timestamptz not null default now()
);

create index tutores_user_idx on public.tutores (user_id);
create index animais_user_idx on public.animais (user_id);
create index animais_tutor_idx on public.animais (tutor_id);
create index consultas_animal_idx on public.consultas (animal_id, data desc);
create index receitas_animal_idx on public.receitas (animal_id, data desc);
create index documentos_animal_idx on public.documentos (animal_id, data desc);
create index servicos_user_idx on public.servicos (user_id);
create index orcamentos_user_idx on public.orcamentos (user_id, data desc);

-- RLS: cada usuária enxerga somente os próprios registros
alter table public.perfis enable row level security;
alter table public.tutores enable row level security;
alter table public.animais enable row level security;
alter table public.consultas enable row level security;
alter table public.receitas enable row level security;
alter table public.documentos enable row level security;
alter table public.servicos enable row level security;
alter table public.orcamentos enable row level security;

create policy "perfis proprios" on public.perfis
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tutores proprios" on public.tutores
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "animais proprios" on public.animais
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "consultas proprias" on public.consultas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "receitas proprias" on public.receitas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "documentos proprios" on public.documentos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "servicos proprios" on public.servicos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "orcamentos proprios" on public.orcamentos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
