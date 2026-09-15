-- Execute no SQL Editor do Supabase antes do deploy do código com preço promocional.

alter table public.products
  add column if not exists promotional_price_text text not null default '';

comment on column public.products.promotional_price_text is
  'Preço promocional exibido na loja e usado no checkout quando preenchido.';
