-- Bem Bonita — Reparo seguro para upload de imagens.
-- Execute no SQL Editor do Supabase se aparecer "Não foi possível enviar a imagem".
-- Este script não apaga fotos nem dados existentes.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  15728640,
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads site image files" on storage.objects;
create policy "Public reads site image files" on storage.objects
for select to anon, authenticated using (bucket_id = 'site-images');

drop policy if exists "Admins upload site image files" on storage.objects;
create policy "Admins upload site image files" on storage.objects
for insert to authenticated with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "Admins update site image files" on storage.objects;
create policy "Admins update site image files" on storage.objects
for update to authenticated using (bucket_id = 'site-images' and public.is_admin()) with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "Admins delete site image files" on storage.objects;
create policy "Admins delete site image files" on storage.objects
for delete to authenticated using (bucket_id = 'site-images' and public.is_admin());

notify pgrst, 'reload schema';
