-- À exécuter une seule fois dans Supabase : SQL Editor > New query > Run
create table if not exists public.site_content (
  id int primary key default 1,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- Sécurité : aucune policy = personne ne peut lire/écrire depuis le navigateur.
-- Seul le serveur (clé service_role, dans les variables Vercel) y a accès.
alter table public.site_content enable row level security;
