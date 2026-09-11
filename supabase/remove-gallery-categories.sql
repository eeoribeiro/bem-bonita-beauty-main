begin;

-- A galeria do salão agora usa somente os serviços reais como filtros.
-- Este script remove as categorias antigas da galeria, como "Cachos" e "Penteados",
-- e limpa os vínculos antigos das fotos para evitar filtros fantasmas no site/admin.

update public.portfolio_items
set
  category_id = null,
  category = coalesce(service_name, '')
where category_id is not null
   or lower(coalesce(category, '')) in ('cachos', 'penteados');

delete from public.portfolio_categories;

notify pgrst, 'reload schema';

commit;
