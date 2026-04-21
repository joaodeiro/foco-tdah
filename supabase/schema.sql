-- =====================================================
-- HabitsTracker TDAH 2e — Schema do Banco de Dados
-- Supabase / PostgreSQL
-- =====================================================

-- Habilitar extensão UUID
create extension if not exists "uuid-ossp";

-- ─── Profiles ─────────────────────────────────────────────────────────────────
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  energy_baseline int default 3 check (energy_baseline between 1 and 5),
  preferred_timer_minutes int default 25 check (preferred_timer_minutes > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Criar perfil automaticamente ao criar usuário
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Tasks ────────────────────────────────────────────────────────────────────
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'paused')),
  priority text default 'medium' check (priority in ('high', 'medium', 'low')),
  estimated_minutes int,
  context_bookmark text,
  date date default current_date,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Task Steps (AI Breakdown) ────────────────────────────────────────────────
create table task_steps (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references tasks(id) on delete cascade not null,
  content text not null,
  "order" int not null,
  completed boolean default false,
  created_at timestamptz default now()
);

-- ─── Day Plans ────────────────────────────────────────────────────────────────
create table day_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  date date default current_date not null,
  energy_level int check (energy_level between 1 and 5),
  top_three_ids uuid[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, date)
);

-- ─── Journal ──────────────────────────────────────────────────────────────────
create table journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  date date default current_date not null,
  mood_start int check (mood_start between 1 and 5),
  mood_end int check (mood_end between 1 and 5),
  energy_start int check (energy_start between 1 and 5),
  energy_end int check (energy_end between 1 and 5),
  wins text[] default '{}',
  reflection text,
  tasks_completed int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, date)
);

-- ─── Streaks ──────────────────────────────────────────────────────────────────
create table streaks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null unique,
  current_streak int default 0,
  longest_streak int default 0,
  last_active_date date,
  updated_at timestamptz default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table tasks enable row level security;
alter table task_steps enable row level security;
alter table day_plans enable row level security;
alter table journal_entries enable row level security;
alter table streaks enable row level security;

-- Policies: usuário só acessa seus próprios dados
create policy "users_own_profile" on profiles for all using (auth.uid() = id);
create policy "users_own_tasks" on tasks for all using (auth.uid() = user_id);
create policy "users_own_steps" on task_steps for all using (
  task_id in (select id from tasks where user_id = auth.uid())
);
create policy "users_own_day_plans" on day_plans for all using (auth.uid() = user_id);
create policy "users_own_journal" on journal_entries for all using (auth.uid() = user_id);
create policy "users_own_streaks" on streaks for all using (auth.uid() = user_id);

-- ─── Índices para performance ─────────────────────────────────────────────────
create index tasks_user_date on tasks(user_id, date);
create index tasks_status on tasks(user_id, status);
create index task_steps_task_id on task_steps(task_id, "order");
create index day_plans_user_date on day_plans(user_id, date);
create index journal_user_date on journal_entries(user_id, date);
