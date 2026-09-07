-- Bem Bonita — correção definitiva para upload em "Nosso Espaço".
--
-- Corrige:
-- 1) ERROR 42725: function public.is_admin() is not unique
-- 2) "Não foi possível enviar a imagem" por bloqueio no Storage
-- 3) Falha ao salvar o link da foto em public.site_images
--
-- Este script NÃO apaga fotos e NÃO apaga dados.
-- Ele evita usar public.is_admin(), que ficou duplicada no banco.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.site_images (
  id uuid primary key default gen_random_uuid(),
  image_key text not null unique,
  image_url text not null,
  alt_text text not null,
  storage_path text,
  created_at text default 'Recente',
  updated_at timestamptz not null default now()
);

-- Garante que o usuário logado no painel atual seja administrador.
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'arthur0108@gmail.com'
on conflict (user_id) do nothing;

-- Função com nome único para fugir da is_admin() duplicada.
create or replace function public.is_bem_bonita_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_bem_bonita_admin() from public;
grant execute on function public.is_bem_bonita_admin() to anon, authenticated;

-- Bucket público para imagens do site, com limite maior para fotos de celular.
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

-- Remove policies antigas que chamavam public.is_admin().
drop policy if exists "Public reads site images" on public.site_images;
drop policy if exists "Admins manage site images" on public.site_images;
drop policy if exists "Public reads site image files" on storage.objects;
drop policy if exists "Admins upload site image files" on storage.objects;
drop policy if exists "Admins update site image files" on storage.objects;
drop policy if exists "Admins delete site image files" on storage.objects;

-- Recria policies sem depender da função duplicada.
create policy "Public reads site images" on public.site_images
for select to anon, authenticated using (true);

create policy "Admins manage site images" on public.site_images
for all to authenticated
using (public.is_bem_bonita_admin())
with check (public.is_bem_bonita_admin());

create policy "Public reads site image files" on storage.objects
for select to anon, authenticated
using (bucket_id = 'site-images');

create policy "Admins upload site image files" on storage.objects
for insert to authenticated
with check (bucket_id = 'site-images' and public.is_bem_bonita_admin());

create policy "Admins update site image files" on storage.objects
for update to authenticated
using (bucket_id = 'site-images' and public.is_bem_bonita_admin())
with check (bucket_id = 'site-images' and public.is_bem_bonita_admin());

create policy "Admins delete site image files" on storage.objects
for delete to authenticated
using (bucket_id = 'site-images' and public.is_bem_bonita_admin());

grant select on public.site_images to anon, authenticated;
grant insert, update, delete on public.site_images to authenticated;

notify pgrst, 'reload schema';
