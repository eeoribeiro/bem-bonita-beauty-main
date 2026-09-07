-- Bem Bonita — Recriação limpa da área "Nosso Espaço".
--
-- Execute este SQL no Supabase.
-- Ele cria uma galeria própria para o portfólio do espaço:
-- - tabela public.space_photos
-- - bucket storage space-photos
-- - leitura pública para o site
-- - upload/edição/exclusão para usuário autenticado no /admin
--
-- Não apaga dados existentes.

create extension if not exists pgcrypto;

create table if not exists public.space_photos (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Foto do espaço Bem Bonita',
  image_url text not null,
  storage_path text,
  alt_text text not null default 'Foto do espaço Bem Bonita',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_space_photos_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists space_photos_updated_at on public.space_photos;
create trigger space_photos_updated_at
before update on public.space_photos
for each row execute function public.set_space_photos_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'space-photos',
  'space-photos',
  true,
  15728640,
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.space_photos enable row level security;

drop policy if exists "Public reads space photos" on public.space_photos;
drop policy if exists "Authenticated manages space photos" on public.space_photos;
drop policy if exists "Public reads space photo files" on storage.objects;
drop policy if exists "Authenticated uploads space photo files" on storage.objects;
drop policy if exists "Authenticated updates space photo files" on storage.objects;
drop policy if exists "Authenticated deletes space photo files" on storage.objects;

create policy "Public reads space photos" on public.space_photos
for select to anon, authenticated
using (published = true);

create policy "Authenticated manages space photos" on public.space_photos
for all to authenticated
using (true)
with check (true);

create policy "Public reads space photo files" on storage.objects
for select to anon, authenticated
using (bucket_id = 'space-photos');

create policy "Authenticated uploads space photo files" on storage.objects
for insert to authenticated
with check (bucket_id = 'space-photos');

create policy "Authenticated updates space photo files" on storage.objects
for update to authenticated
using (bucket_id = 'space-photos')
with check (bucket_id = 'space-photos');

create policy "Authenticated deletes space photo files" on storage.objects
for delete to authenticated
using (bucket_id = 'space-photos');

grant select on public.space_photos to anon, authenticated;
grant insert, update, delete on public.space_photos to authenticated;

create index if not exists space_photos_public_order_idx
on public.space_photos (published, sort_order);

notify pgrst, 'reload schema';
