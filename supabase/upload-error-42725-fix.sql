-- Bem Bonita — correção do erro:
-- ERROR 42725: function public.is_admin() is not unique
--
-- Execute este arquivo no SQL Editor do Supabase.
-- Ele não apaga fotos nem dados. Ele cria uma função de admin com nome único
-- e recria as permissões necessárias para upload/salvamento de imagens.

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
create policy "Public reads site image files" on storage.objects
for select to anon, authenticated using (bucket_id = 'site-images');

drop policy if exists "Admins upload site image files" on storage.objects;
create policy "Admins upload site image files" on storage.objects
for insert to authenticated with check (bucket_id = 'site-images' and public.is_bem_bonita_admin());

drop policy if exists "Admins update site image files" on storage.objects;
create policy "Admins update site image files" on storage.objects
for update to authenticated using (bucket_id = 'site-images' and public.is_bem_bonita_admin()) with check (bucket_id = 'site-images' and public.is_bem_bonita_admin());

drop policy if exists "Admins delete site image files" on storage.objects;
create policy "Admins delete site image files" on storage.objects
for delete to authenticated using (bucket_id = 'site-images' and public.is_bem_bonita_admin());

drop policy if exists "Admins manage site images" on public.site_images;
create policy "Admins manage site images" on public.site_images
for all to authenticated using (public.is_bem_bonita_admin()) with check (public.is_bem_bonita_admin());

notify pgrst, 'reload schema';
