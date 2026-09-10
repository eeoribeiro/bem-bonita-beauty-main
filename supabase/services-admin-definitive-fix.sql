-- Bem Bonita — correção definitiva da área "Serviços" do /admin.
--
-- Execute este arquivo inteiro no SQL Editor do Supabase.
-- Ele NÃO apaga serviços, NÃO apaga fotos e NÃO remove dados existentes.
--
-- Corrige:
-- 1) edição/criação de serviços existentes no painel;
-- 2) upload de foto do serviço;
-- 3) colunas usadas pelo modelo com foto/sem foto;
-- 4) erro "function public.is_admin() is not unique", criando policies sem usar public.is_admin().

begin;

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Garante que o usuário do painel atual seja reconhecido como admin.
-- Se o e-mail mudar, troque abaixo antes de executar.
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'arthur0108@gmail.com'
on conflict (user_id) do nothing;

-- Função exclusiva do projeto para não bater com is_admin() duplicada.
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

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price_text text not null default '',
  featured boolean not null default false,
  benefits text[] not null default '{}',
  image_url text,
  storage_path text,
  cta_label text not null default 'Conversar sobre este serviço',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services
  add column if not exists description text not null default '',
  add column if not exists price_text text not null default '',
  add column if not exists featured boolean not null default false,
  add column if not exists benefits text[] not null default '{}',
  add column if not exists image_url text,
  add column if not exists storage_path text,
  add column if not exists cta_label text not null default 'Conversar sobre este serviço',
  add column if not exists sort_order integer not null default 0,
  add column if not exists published boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- Campos da configuração usados pela seção de serviços no site.
alter table public.site_settings
  add column if not exists services_title text not null default 'Técnica dedicada a cada tipo de cacho',
  add column if not exists services_description text not null default 'Atendimentos pensados para cabelos crespos e cacheados, com avaliação individual antes de cada procedimento.',
  add column if not exists services_card_style text not null default 'photo';

alter table public.site_settings
  drop constraint if exists site_settings_services_card_style_check;

alter table public.site_settings
  add constraint site_settings_services_card_style_check
  check (services_card_style in ('photo', 'compact'));

update public.site_settings
set services_card_style = coalesce(nullif(services_card_style, ''), 'photo')
where services_card_style is null or services_card_style = '';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

alter table public.services enable row level security;

-- Remove policies antigas que podem chamar public.is_admin() duplicada.
drop policy if exists "Public reads published services" on public.services;
drop policy if exists "Admins manage services" on public.services;

create policy "Public reads published services" on public.services
for select to anon, authenticated
using (published or public.is_bem_bonita_admin());

create policy "Admins manage services" on public.services
for all to authenticated
using (public.is_bem_bonita_admin())
with check (public.is_bem_bonita_admin());

grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant select on public.admin_users to authenticated;
grant select, insert, update, delete on public.site_settings to authenticated;

create index if not exists services_public_order_idx
on public.services (published, sort_order);

create index if not exists services_featured_sort_idx
on public.services (featured desc, sort_order asc);

-- Bucket e permissões para foto dos serviços.
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
drop policy if exists "Admins upload site image files" on storage.objects;
drop policy if exists "Admins update site image files" on storage.objects;
drop policy if exists "Admins delete site image files" on storage.objects;

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

notify pgrst, 'reload schema';

commit;
