-- Run in Supabase SQL Editor or via Supabase CLI.
-- Contact form submissions: public inserts only via service role (API route);
-- authenticated users can read/update/delete (admin inbox).

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  read_at timestamptz,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create index if not exists contact_messages_archived_created_idx
  on public.contact_messages (archived asc, created_at desc);

alter table public.contact_messages enable row level security;

create policy "contact_messages_select_authenticated"
  on public.contact_messages
  for select
  to authenticated
  using (true);

create policy "contact_messages_update_authenticated"
  on public.contact_messages
  for update
  to authenticated
  using (true)
  with check (true);

create policy "contact_messages_delete_authenticated"
  on public.contact_messages
  for delete
  to authenticated
  using (true);
