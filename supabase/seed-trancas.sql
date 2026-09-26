-- Popula a “Galeria de tranças” (aba Tranças do /admin) com as fotos que o
-- site exibe hoje como padrão. Só insere se a categoria ainda estiver vazia.
-- Rode no SQL Editor do Supabase.

insert into public.portfolio_items (title, description, category, hair_type, photo_label, image_zoom, image_position_x, image_position_y, image_url, storage_path, alt_text, sort_order, published)
select
  v.title,
  '',
  'trancas',
  'Todos os tipos de cabelo',
  '',
  1,
  50,
  50,
  v.image_url,
  null,
  v.alt_text,
  v.sort_order,
  true
from (values
  (
    'Tranças laterais personalizadas',
    '/media/penteado-trancas-rosa.jpg',
    'Penteado com tranças laterais e detalhes delicados',
    1
  ),
  (
    'Tranças com detalhes dourados',
    '/media/penteado-trancas-douradas.jpg',
    'Tranças com detalhes dourados em cabelo cacheado',
    2
  ),
  (
    'Tranças criativas e coloridas',
    '/media/penteado-trancas-coloridas.jpg',
    'Penteado com tranças coloridas e acabamento criativo',
    3
  )
) as v(title, image_url, alt_text, sort_order)
where not exists (
  select 1 from public.portfolio_items where category = 'trancas' limit 1
);

notify pgrst, 'reload schema';
