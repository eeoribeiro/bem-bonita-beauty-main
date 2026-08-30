-- Bem Bonita — Estrutura completa do banco de dados e painel /admin
-- Execute este arquivo no SQL Editor do Supabase para criar/atualizar todas as tabelas.

create extension if not exists pgcrypto;

-- 1. Usuários Administradores
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
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

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 2. Configurações Gerais do Site e Páginas
create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  salon_name text not null default 'Bem Bonita',
  professional_name text not null default 'Francielly Soares',
  logo_url text,
  whatsapp text not null default '5531996792131',
  instagram text not null default '@salaobembonita_cielly',
  address text not null default 'Av. Francisco Vieira Martins, 595 — Lanna Shopping, sala 118, primeiro andar — Ponte Nova/MG',
  headline text not null default 'Seus cachos são a nossa arte',
  description text default 'Salão especialista em cabelos crespos e cacheados em Ponte Nova/MG.',
  hero_eyebrow text not null default 'Especialista em cachos em Ponte Nova',
  hero_description text not null default 'Cortes, tratamentos, definição, mechas e penteados para valorizar a identidade dos seus cabelos.',
  services_title text not null default 'Técnica dedicada a cada tipo de cacho',
  services_description text not null default 'Atendimentos pensados para cabelos crespos e cacheados, com avaliação individual antes de cada procedimento.',
  portfolio_title text not null default 'Técnica que respeita cada textura',
  portfolio_description text not null default 'Trabalhos realizados no Bem Bonita, com foco em definição, movimento, mechas, cortes e penteados personalizados.',
  about_title text not null default 'Beleza que respeita a sua essência',
  about_text text not null default 'No Bem Bonita, cada cabelo é tratado de forma única. Sob os cuidados de Francielly Soares, o salão oferece técnicas, tratamentos e produtos pensados especialmente para cabelos crespos e cacheados.',
  francielly_headline text default 'Paixão, técnica e identidade',
  francielly_bio text default 'Especialista em cabelos crespos e cacheados, Francielly construiu o salão Bem Bonita a partir do propósito de transformar a relação que as mulheres têm com seus fios naturais, unindo técnica apurada, respeito à saúde capilar e acolhimento.',
  francielly_mission text default 'Mais do que estética: resgate da autoestima',
  space_title text default 'Um refúgio exclusivo para cuidar dos seus cachos',
  space_description text default 'Localizado no Lanna Shopping em Ponte Nova, o salão Bem Bonita foi desenhado para proporcionar uma experiência relaxante, intimista e acolhedora.',
  landmark text default 'Lanna Shopping, primeiro andar, sala 118',
  business_hours_text text default 'Segunda a Sábado com horário agendado',
  updated_at timestamptz not null default now()
);

alter table public.site_settings add column if not exists logo_url text;
alter table public.site_settings add column if not exists francielly_headline text default 'Paixão, técnica e identidade';
alter table public.site_settings add column if not exists francielly_bio text;
alter table public.site_settings add column if not exists francielly_mission text default 'Mais do que estética: resgate da autoestima';
alter table public.site_settings add column if not exists space_title text;
alter table public.site_settings add column if not exists space_description text;
alter table public.site_settings add column if not exists francielly_eyebrow text default 'Sobre a especialista';
alter table public.site_settings add column if not exists francielly_methodology_eyebrow text default 'Método Bem Bonita';
alter table public.site_settings add column if not exists francielly_method_1_title text default 'Corte a Seco e Curvatura Real';
alter table public.site_settings add column if not exists francielly_method_1_description text;
alter table public.site_settings add column if not exists francielly_method_2_title text default 'Saúde Capilar em Primeiro Lugar';
alter table public.site_settings add column if not exists francielly_method_2_description text;
alter table public.site_settings add column if not exists francielly_method_3_title text default 'Educação e Cuidado em Casa';
alter table public.site_settings add column if not exists francielly_method_3_description text;
alter table public.site_settings add column if not exists francielly_space_eyebrow text default 'Ambiente exclusivo';
alter table public.site_settings add column if not exists francielly_cta_label text default 'Agendar horário com Francielly';
alter table public.site_settings add column if not exists francielly_space_cta_label text default 'Agendar visita pelo WhatsApp';

insert into public.site_settings (id, description)
values (1, 'Salão especialista em cabelos crespos e cacheados em Ponte Nova/MG.')
on conflict (id) do nothing;

-- 3. Equipe de Profissionais
create table if not exists public.professionals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text not null,
  image_url text,
  storage_path text,
  whatsapp text default '5531996792131',
  instagram text default '@salaobembonita_cielly',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Serviços Cadastrados
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
  benefits text[] not null default '{}',
  image_url text,
  storage_path text,
  cta_label text not null default 'Conversar sobre este serviço',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Galeria de Resultados & Categorias
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
  category text not null default 'cachos',
  category_id uuid references public.portfolio_categories(id) on delete set null,
  image_url text not null,
  storage_path text,
  alt_text text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Fotos Principais do Site e Espaço
create table if not exists public.site_images (
  id uuid primary key default gen_random_uuid(),
  image_key text not null unique,
  image_url text not null,
  alt_text text not null,
  storage_path text,
  created_at text default 'Recente',
  updated_at timestamptz not null default now()
);

-- 7. Depoimentos de Clientes
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  service_name text,
  testimonial text not null,
  rating smallint check (rating between 1 and 5),
  image_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. Horários de Funcionamento
create table if not exists public.business_hours (
  day_of_week smallint primary key check (day_of_week between 0 and 6),
  opens_at time,
  closes_at time,
  closed boolean not null default false,
  note text,
  updated_at timestamptz not null default now(),
  check (closed or (opens_at is not null and closes_at is not null))
);

-- 9. Solicitações de Contato / Leads
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  phone text not null check (char_length(phone) between 10 and 20),
  service_name text,
  message text check (message is null or char_length(message) <= 2000),
  status text not null default 'novo' check (status in ('novo', 'em_atendimento', 'concluido')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Triggers para atualização automática de updated_at
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

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists professionals_updated_at on public.professionals;
create trigger professionals_updated_at before update on public.professionals
for each row execute function public.set_updated_at();

drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists portfolio_items_updated_at on public.portfolio_items;
create trigger portfolio_items_updated_at before update on public.portfolio_items
for each row execute function public.set_updated_at();

drop trigger if exists portfolio_categories_updated_at on public.portfolio_categories;
create trigger portfolio_categories_updated_at before update on public.portfolio_categories
for each row execute function public.set_updated_at();

drop trigger if exists site_images_updated_at on public.site_images;
create trigger site_images_updated_at before update on public.site_images
for each row execute function public.set_updated_at();

drop trigger if exists testimonials_updated_at on public.testimonials;
create trigger testimonials_updated_at before update on public.testimonials
for each row execute function public.set_updated_at();

drop trigger if exists business_hours_updated_at on public.business_hours;
create trigger business_hours_updated_at before update on public.business_hours
for each row execute function public.set_updated_at();

drop trigger if exists contact_requests_updated_at on public.contact_requests;
create trigger contact_requests_updated_at before update on public.contact_requests
for each row execute function public.set_updated_at();

-- Políticas de Segurança RLS (Row Level Security)
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.professionals enable row level security;
alter table public.services enable row level security;
alter table public.products enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.portfolio_categories enable row level security;
alter table public.site_images enable row level security;
alter table public.testimonials enable row level security;
alter table public.business_hours enable row level security;
alter table public.contact_requests enable row level security;

-- Policies
drop policy if exists "Admins read admin users" on public.admin_users;
create policy "Admins read admin users" on public.admin_users
for select to authenticated using (public.is_admin());

drop policy if exists "Public reads site settings" on public.site_settings;
create policy "Public reads site settings" on public.site_settings
for select to anon, authenticated using (true);
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public reads active professionals" on public.professionals;
create policy "Public reads active professionals" on public.professionals
for select to anon, authenticated using (active or public.is_admin());
drop policy if exists "Admins manage professionals" on public.professionals;
create policy "Admins manage professionals" on public.professionals
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public reads published services" on public.services;
create policy "Public reads published services" on public.services
for select to anon, authenticated using (published or public.is_admin());
drop policy if exists "Admins manage services" on public.services;
create policy "Admins manage services" on public.services
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public reads published products" on public.products;
create policy "Public reads published products" on public.products
for select to anon, authenticated using (published or public.is_admin());
drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public reads published portfolio" on public.portfolio_items;
create policy "Public reads published portfolio" on public.portfolio_items
for select to anon, authenticated using (published or public.is_admin());
drop policy if exists "Admins manage portfolio" on public.portfolio_items;
create policy "Admins manage portfolio" on public.portfolio_items
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public reads active portfolio categories" on public.portfolio_categories;
create policy "Public reads active portfolio categories" on public.portfolio_categories
for select to anon, authenticated using (active or public.is_admin());
drop policy if exists "Admins manage portfolio categories" on public.portfolio_categories;
create policy "Admins manage portfolio categories" on public.portfolio_categories
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public reads site images" on public.site_images;
create policy "Public reads site images" on public.site_images
for select to anon, authenticated using (true);
drop policy if exists "Admins manage site images" on public.site_images;
create policy "Admins manage site images" on public.site_images
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public reads published testimonials" on public.testimonials;
create policy "Public reads published testimonials" on public.testimonials
for select to anon, authenticated using (published or public.is_admin());
drop policy if exists "Admins manage testimonials" on public.testimonials;
create policy "Admins manage testimonials" on public.testimonials
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public reads business hours" on public.business_hours;
create policy "Public reads business hours" on public.business_hours
for select to anon, authenticated using (true);
drop policy if exists "Admins manage business hours" on public.business_hours;
create policy "Admins manage business hours" on public.business_hours
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Anyone creates contact requests" on public.contact_requests;
create policy "Anyone creates contact requests" on public.contact_requests
for insert to anon, authenticated with check (status = 'novo');
drop policy if exists "Admins manage contact requests" on public.contact_requests;
create policy "Admins manage contact requests" on public.contact_requests
for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.site_settings, public.professionals, public.site_images, public.services, public.portfolio_categories, public.portfolio_items, public.testimonials, public.business_hours to anon, authenticated;
grant insert on public.contact_requests to anon, authenticated;
grant select, insert, update, delete on public.admin_users, public.site_settings, public.professionals, public.site_images, public.services, public.portfolio_categories, public.portfolio_items, public.testimonials, public.business_hours, public.contact_requests to authenticated;

-- Índices
create index if not exists professionals_sort_order_idx on public.professionals (active, sort_order);
create index if not exists services_public_order_idx on public.services (published, sort_order);
create unique index if not exists services_unique_sort_order_idx on public.services (sort_order);
create index if not exists portfolio_public_order_idx on public.portfolio_items (published, category_id, sort_order);
create unique index if not exists portfolio_unique_sort_order_idx on public.portfolio_items (sort_order);
create index if not exists portfolio_categories_order_idx on public.portfolio_categories (active, sort_order);
create index if not exists testimonials_public_date_idx on public.testimonials (published, created_at desc);
create index if not exists contact_requests_status_date_idx on public.contact_requests (status, created_at desc);

-- Storage bucket para upload de fotos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  5242880,
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
