-- Run in Supabase SQL Editor or via Supabase CLI.
-- Projects CMS table with public read and authenticated write (RLS).

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  slug text not null unique,
  title text not null,
  address text not null,
  description text not null,
  thumbnail text not null,
  year integer not null,
  status text not null
    constraint projects_status_check
    check (status in ('completed', 'in-progress', 'upcoming')),
  images jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  specs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_sort_order_idx
  on public.projects (sort_order asc, created_at asc);

create or replace function public.set_projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_projects_updated_at();

alter table public.projects enable row level security;

create policy "projects_select_public"
  on public.projects
  for select
  to anon, authenticated
  using (true);

create policy "projects_insert_authenticated"
  on public.projects
  for insert
  to authenticated
  with check (true);

create policy "projects_update_authenticated"
  on public.projects
  for update
  to authenticated
  using (true)
  with check (true);

create policy "projects_delete_authenticated"
  on public.projects
  for delete
  to authenticated
  using (true);
