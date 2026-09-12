-- Bem Bonita — Pedidos da loja online + suporte ao Resend
-- Execute este SQL no Supabase para liberar a aba /admin > Pedidos.

create extension if not exists pgcrypto;

create table if not exists public.product_orders (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique,
  pagbank_payment_url text,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'cancelled', 'refunded', 'manual_review')),
  total_amount integer not null default 0 check (total_amount >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.product_orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_amount integer not null default 0 check (unit_amount >= 0),
  quantity integer not null default 1 check (quantity > 0),
  total_amount integer not null default 0 check (total_amount >= 0),
  image_url text,
  created_at timestamptz not null default now()
);

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

drop trigger if exists product_orders_updated_at on public.product_orders;
create trigger product_orders_updated_at before update on public.product_orders
for each row execute function public.set_updated_at();

alter table public.product_orders enable row level security;
alter table public.product_order_items enable row level security;

drop policy if exists "Anyone creates product orders" on public.product_orders;
create policy "Anyone creates product orders" on public.product_orders
for insert to anon, authenticated
with check (status = 'pending');

drop policy if exists "Anyone creates product order items" on public.product_order_items;
create policy "Anyone creates product order items" on public.product_order_items
for insert to anon, authenticated
with check (true);

drop policy if exists "Admins read product orders" on public.product_orders;
create policy "Admins read product orders" on public.product_orders
for select to authenticated
using (public.is_admin());

drop policy if exists "Admins update product orders" on public.product_orders;
create policy "Admins update product orders" on public.product_orders
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins read product order items" on public.product_order_items;
create policy "Admins read product order items" on public.product_order_items
for select to authenticated
using (public.is_admin());

grant usage on schema public to anon, authenticated;
grant insert on public.product_orders, public.product_order_items to anon, authenticated;
grant select, insert, update on public.product_orders to authenticated;
grant select, insert on public.product_order_items to authenticated;

create index if not exists product_orders_created_idx on public.product_orders (created_at desc);
create index if not exists product_orders_status_idx on public.product_orders (status, created_at desc);
create index if not exists product_order_items_order_idx on public.product_order_items (order_id);
