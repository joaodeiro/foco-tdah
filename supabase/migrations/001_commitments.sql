-- C-01 + C-02: declaração diária de apps a evitar + check-in
-- Extende journal_entries com duas listas.
-- Rode no SQL Editor do Supabase uma vez.

alter table journal_entries
  add column if not exists avoid_apps text[] default '{}';

alter table journal_entries
  add column if not exists avoided_apps_breached text[] default '{}';

-- Opcional: index se for consultar por compromissos.
-- create index if not exists journal_avoid_apps_idx on journal_entries using gin (avoid_apps);
