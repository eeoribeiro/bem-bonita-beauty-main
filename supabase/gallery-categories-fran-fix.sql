-- Bem Bonita — correção da Nossa Galeria, categorias e fotos/textos extras da Fran.
--
-- Execute este arquivo no SQL Editor do Supabase se:
-- - categorias da galeria não aparecem no /admin;
-- - não dá para adicionar/editar categoria;
-- - filtros da galeria não aparecem no site;
-- - fotos/textos extras da página da Francielly não salvam.
--
-- Este script preserva dados existentes.

begin;

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

insert into public.admin_users (user_id)
select id
from auth.users
where email = 'arthur0108@gmail.com'
on conflict (user_id) do nothing;

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

alter table public.site_settings
  add column if not exists landmark text,
  add column if not exists business_hours_text text,
  add column if not exists francielly_photo_label text default 'Cuidado autoral',
  add column if not exists francielly_extra_1_eyebrow text default 'Trajetória',
  add column if not exists francielly_extra_1_title text,
  add column if not exists francielly_extra_1_subtitle text,
  add column if not exists francielly_extra_2_eyebrow text default 'Atendimento',
  add column if not exists francielly_extra_2_title text,
  add column if not exists francielly_extra_2_subtitle text,
  add column if not exists francielly_extra_3_eyebrow text default 'Resultado',
  add column if not exists francielly_extra_3_title text,
  add column if not exists francielly_extra_3_subtitle text;

create table if not exists public.portfolio_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null default 'galeria',
  category_id uuid references public.portfolio_categories(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  service_name text,
  hair_type text default 'Todos os tipos de cabelo',
  photo_label text,
  image_zoom numeric(3,2) not null default 1,
  image_position_x integer not null default 50,
  image_position_y integer not null default 50,
  image_url text not null,
  storage_path text,
  alt_text text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_categories
  add column if not exists slug text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

update public.portfolio_categories
set slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null or slug = '';

alter table public.portfolio_categories
  alter column slug set not null;

create unique index if not exists portfolio_categories_slug_key
on public.portfolio_categories (slug);

alter table public.portfolio_items
  add column if not exists category text not null default 'galeria',
  add column if not exists category_id uuid references public.portfolio_categories(id) on delete set null,
  add column if not exists service_id uuid references public.services(id) on delete set null,
  add column if not exists service_name text,
  add column if not exists hair_type text default 'Todos os tipos de cabelo',
  add column if not exists photo_label text,
  add column if not exists image_zoom numeric(3,2) not null default 1,
  add column if not exists image_position_x integer not null default 50,
  add column if not exists image_position_y integer not null default 50,
  add column if not exists storage_path text,
  add column if not exists alt_text text not null default '',
  add column if not exists sort_order integer not null default 0,
  add column if not exists published boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

update public.portfolio_items
set image_zoom = coalesce(image_zoom, 1),
    image_position_x = coalesce(image_position_x, 50),
    image_position_y = coalesce(image_position_y, 50),
    hair_type = coalesce(nullif(hair_type, ''), 'Todos os tipos de cabelo'),
    category = coalesce(nullif(category, ''), 'galeria');

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

drop trigger if exists portfolio_categories_updated_at on public.portfolio_categories;
create trigger portfolio_categories_updated_at
before update on public.portfolio_categories
for each row execute function public.set_updated_at();

drop trigger if exists portfolio_items_updated_at on public.portfolio_items;
create trigger portfolio_items_updated_at
before update on public.portfolio_items
for each row execute function public.set_updated_at();

alter table public.portfolio_categories enable row level security;
alter table public.portfolio_items enable row level security;

alter table public.site_settings enable row level security;

drop policy if exists "Public reads site settings" on public.site_settings;
drop policy if exists "Admins manage site settings" on public.site_settings;

create policy "Public reads site settings" on public.site_settings
for select to anon, authenticated
using (true);

create policy "Admins manage site settings" on public.site_settings
for all to authenticated
using (public.is_bem_bonita_admin())
with check (public.is_bem_bonita_admin());

drop policy if exists "Public reads active portfolio categories" on public.portfolio_categories;
drop policy if exists "Admins manage portfolio categories" on public.portfolio_categories;

create policy "Public reads active portfolio categories" on public.portfolio_categories
for select to anon, authenticated
using (active or public.is_bem_bonita_admin());

create policy "Admins manage portfolio categories" on public.portfolio_categories
for all to authenticated
using (public.is_bem_bonita_admin())
with check (public.is_bem_bonita_admin());

drop policy if exists "Public reads published portfolio" on public.portfolio_items;
drop policy if exists "Admins manage portfolio" on public.portfolio_items;

create policy "Public reads published portfolio" on public.portfolio_items
for select to anon, authenticated
using (published or public.is_bem_bonita_admin());

create policy "Admins manage portfolio" on public.portfolio_items
for all to authenticated
using (public.is_bem_bonita_admin())
with check (public.is_bem_bonita_admin());

grant select on public.portfolio_categories, public.portfolio_items to anon, authenticated;
grant insert, update, delete on public.portfolio_categories, public.portfolio_items to authenticated;
grant select, update on public.site_settings to authenticated;

create index if not exists portfolio_categories_active_order_idx
on public.portfolio_categories (active, sort_order);

create index if not exists portfolio_items_public_order_idx
on public.portfolio_items (published, sort_order);

create index if not exists portfolio_items_category_idx
on public.portfolio_items (category_id, category);

create index if not exists portfolio_items_service_idx
on public.portfolio_items (service_id, service_name);

notify pgrst, 'reload schema';

commit;
