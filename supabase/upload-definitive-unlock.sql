-- Bem Bonita — destravar DEFINITIVAMENTE upload de fotos do /admin.
--
-- Use este SQL se o upload continuar mostrando:
-- "Não foi possível enviar a imagem."
--
-- O que ele faz:
-- - cria/ajusta a tabela public.site_images;
-- - cria/ajusta o bucket site-images;
-- - remove policies antigas que dependiam de public.is_admin();
-- - permite que qualquer usuário LOGADO no Supabase envie, atualize e remova
--   imagens do bucket site-images e registros da tabela site_images.
--
-- Este script NÃO apaga fotos e NÃO apaga dados.

create extension if not exists pgcrypto;

create table if not exists public.site_images (
  id uuid primary key default gen_random_uuid(),
  image_key text not null unique,
  image_url text not null,
  alt_text text not null,
  storage_path text,
  created_at text default 'Recente',
  updated_at timestamptz not null default now()
);

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

alter table public.site_images enable row level security;

-- Remove policies antigas/prováveis, incluindo as que chamavam public.is_admin().
drop policy if exists "Public reads site images" on public.site_images;
drop policy if exists "Admins manage site images" on public.site_images;
drop policy if exists "Authenticated manage site images" on public.site_images;

drop policy if exists "Public reads site image files" on storage.objects;
drop policy if exists "Admins upload site image files" on storage.objects;
drop policy if exists "Admins update site image files" on storage.objects;
drop policy if exists "Admins delete site image files" on storage.objects;
drop policy if exists "Authenticated upload site image files" on storage.objects;
drop policy if exists "Authenticated update site image files" on storage.objects;
drop policy if exists "Authenticated delete site image files" on storage.objects;

-- Leitura pública: necessária para as imagens aparecerem no site.
create policy "Public reads site images" on public.site_images
for select to anon, authenticated
using (true);

create policy "Public reads site image files" on storage.objects
for select to anon, authenticated
using (bucket_id = 'site-images');

-- Escrita liberada para usuário autenticado.
-- O /admin já exige login, então isso destrava o painel.
create policy "Authenticated manage site images" on public.site_images
for all to authenticated
using (true)
with check (true);

create policy "Authenticated upload site image files" on storage.objects
for insert to authenticated
with check (bucket_id = 'site-images');

create policy "Authenticated update site image files" on storage.objects
for update to authenticated
using (bucket_id = 'site-images')
with check (bucket_id = 'site-images');

create policy "Authenticated delete site image files" on storage.objects
for delete to authenticated
using (bucket_id = 'site-images');

grant select on public.site_images to anon, authenticated;
grant insert, update, delete on public.site_images to authenticated;

notify pgrst, 'reload schema';
