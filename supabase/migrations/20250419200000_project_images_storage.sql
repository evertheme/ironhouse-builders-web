-- Public bucket for project photos; anon can read, authenticated can manage.
-- Run in Supabase SQL Editor if you have not applied migrations via CLI.

drop policy if exists "project_images_select_public" on storage.objects;
drop policy if exists "project_images_insert_authenticated" on storage.objects;
drop policy if exists "project_images_update_authenticated" on storage.objects;
drop policy if exists "project_images_delete_authenticated" on storage.objects;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  5242880,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "project_images_select_public"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "project_images_insert_authenticated"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

create policy "project_images_update_authenticated"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');

create policy "project_images_delete_authenticated"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');
