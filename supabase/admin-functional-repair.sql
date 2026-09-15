-- Reparo seguro e idempotente do painel administrativo Bem Bonita.
-- Execute este arquivo no SQL Editor do Supabase. Ele preserva os dados existentes.

create extension if not exists pgcrypto;

alter table public.site_settings
  add column if not exists professional_name text default 'Francielly Soares',
  add column if not exists francielly_headline text default 'Paixão, técnica e identidade',
  add column if not exists francielly_bio text,
  add column if not exists francielly_mission text default 'Mais do que estética: resgate da autoestima',
  add column if not exists landmark text,
  add column if not exists space_title text,
  add column if not exists space_description text,
  add column if not exists business_hours_text text,
  add column if not exists updated_at timestamptz default now(),
  add column if not exists francielly_eyebrow text default 'Sobre a especialista',
  add column if not exists francielly_methodology_eyebrow text default 'Método Bem Bonita',
  add column if not exists francielly_method_1_title text default 'Corte a Seco e Curvatura Real',
  add column if not exists francielly_method_1_description text,
  add column if not exists francielly_method_2_title text default 'Saúde Capilar em Primeiro Lugar',
  add column if not exists francielly_method_2_description text,
  add column if not exists francielly_method_3_title text default 'Educação e Cuidado em Casa',
  add column if not exists francielly_method_3_description text,
  add column if not exists francielly_space_eyebrow text default 'Ambiente exclusivo',
  add column if not exists francielly_cta_label text default 'Agendar horário com Francielly',
  add column if not exists francielly_space_cta_label text default 'Agendar visita pelo WhatsApp';

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subtitle text not null default '',
  hair_type text not null default '',
  description text not null,
  benefits text[] not null default '{}',
  image_url text,
  storage_path text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price_text text not null default '',
  promotional_price_text text not null default '',
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
  add column if not exists price_text text not null default '',
  add column if not exists promotional_price_text text not null default '',
  add column if not exists featured boolean not null default false,
  add column if not exists benefits text[] not null default '{}',
  add column if not exists image_url text,
  add column if not exists storage_path text,
  add column if not exists cta_label text not null default 'Conversar sobre este serviço',
  add column if not exists sort_order integer not null default 0,
  add column if not exists published boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

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

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.services enable row level security;

drop policy if exists "Public reads published products" on public.products;
create policy "Public reads published products" on public.products
for select to anon, authenticated
using (published or public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

drop policy if exists "Public reads published services" on public.services;
create policy "Public reads published services" on public.services
for select to anon, authenticated
using (published or public.is_admin());

drop policy if exists "Admins manage services" on public.services;
create policy "Admins manage services" on public.services
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;

create index if not exists products_public_order_idx
on public.products (published, sort_order);

create index if not exists services_public_order_idx
on public.services (published, sort_order);

create index if not exists services_featured_sort_idx
on public.services (featured desc, sort_order asc);

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

-- Atualiza o cache de esquema usado pela API do Supabase.
notify pgrst, 'reload schema';
