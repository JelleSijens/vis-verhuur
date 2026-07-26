create table if not exists public.aanvragen (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  naam text not null,
  email text not null,
  telefoon text not null,
  verblijf text,
  startdatum date not null,
  einddatum date not null,
  ervaring text,
  opmerkingen text,
  items jsonb not null default '[]'::jsonb,
  totaal numeric(10,2) not null default 0,
  status text not null default 'Nieuw'
);

alter table public.aanvragen enable row level security;
-- De website schrijft via de server-side service role key. Voeg later aparte admin-authenticatie toe voor uitlezen en statuswijzigingen.
