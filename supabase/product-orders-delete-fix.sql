-- Execute no SQL Editor do Supabase para permitir a exclusão por administradores.
-- Não exclui pedidos nem altera as permissões de leitura ou criação.
-- Os itens do pedido são removidos pelo ON DELETE CASCADE do schema.
begin;

grant delete on public.product_orders to authenticated;

drop policy if exists "Admins delete product orders" on public.product_orders;
create policy "Admins delete product orders" on public.product_orders
for delete to authenticated
using (
  exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  )
);

commit;
