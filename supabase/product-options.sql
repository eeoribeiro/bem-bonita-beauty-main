alter table public.products
  add column if not exists category text not null default '';

alter table public.products
  add column if not exists product_options jsonb not null default '[]'::jsonb;

comment on column public.products.product_options is
  'Opções internas do card do produto: shampoo, máscara, óleo, kit, tamanho/ml, preço e foto.';

notify pgrst, 'reload schema';
