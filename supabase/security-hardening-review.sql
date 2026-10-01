-- Bem Bonita - revisão consolidada de segurança e RLS.
-- Execute este arquivo inteiro no SQL Editor do Supabase APÓS os demais SQLs.
-- Ele não apaga registros. Corrige políticas permissivas deixadas por reparos antigos.

begin;

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

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.professionals enable row level security;
alter table public.services enable row level security;
alter table public.products enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.portfolio_categories enable row level security;
alter table public.site_images enable row level security;
alter table public.space_photos enable row level security;
alter table public.testimonials enable row level security;
alter table public.business_hours enable row level security;
alter table public.contact_requests enable row level security;
alter table public.product_orders enable row level security;
alter table public.product_order_items enable row level security;
alter table public.career_applications enable row level security;

drop policy if exists "Authenticated manages space photos" on public.space_photos;
drop policy if exists "Authenticated manage space photos" on public.space_photos;
drop policy if exists "Admins manage space photos" on public.space_photos;
create policy "Admins manage space photos"
on public.space_photos for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated manage site images" on public.site_images;
drop policy if exists "Admins manage site images" on public.site_images;
create policy "Admins manage site images"
on public.site_images for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated upload site image files" on storage.objects;
drop policy if exists "Authenticated update site image files" on storage.objects;
drop policy if exists "Authenticated delete site image files" on storage.objects;
drop policy if exists "Admins upload site image files" on storage.objects;
drop policy if exists "Admins update site image files" on storage.objects;
drop policy if exists "Admins delete site image files" on storage.objects;

create policy "Admins upload site image files"
on storage.objects for insert to authenticated
with check (bucket_id = 'site-images' and public.is_admin());

create policy "Admins update site image files"
on storage.objects for update to authenticated
using (bucket_id = 'site-images' and public.is_admin())
with check (bucket_id = 'site-images' and public.is_admin());

create policy "Admins delete site image files"
on storage.objects for delete to authenticated
using (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "Authenticated uploads space photo files" on storage.objects;
drop policy if exists "Authenticated updates space photo files" on storage.objects;
drop policy if exists "Authenticated deletes space photo files" on storage.objects;
drop policy if exists "Admins upload space photo files" on storage.objects;
drop policy if exists "Admins update space photo files" on storage.objects;
drop policy if exists "Admins delete space photo files" on storage.objects;

create policy "Admins upload space photo files"
on storage.objects for insert to authenticated
with check (bucket_id = 'space-photos' and public.is_admin());

create policy "Admins update space photo files"
on storage.objects for update to authenticated
using (bucket_id = 'space-photos' and public.is_admin())
with check (bucket_id = 'space-photos' and public.is_admin());

create policy "Admins delete space photo files"
on storage.objects for delete to authenticated
using (bucket_id = 'space-photos' and public.is_admin());

drop policy if exists "Admins manage career applications" on public.career_applications;
create policy "Admins manage career applications"
on public.career_applications for all to authenticated
using (public.is_admin())
with check (public.is_admin());

alter table public.career_applications
  drop constraint if exists career_applications_public_input_check;
alter table public.career_applications
  add constraint career_applications_public_input_check check (
    char_length(full_name) between 2 and 120
    and char_length(whatsapp) between 8 and 30
    and char_length(coalesce(city_neighborhood, '')) <= 160
    and char_length(coalesce(interest_area, '')) <= 160
    and char_length(coalesce(experience, '')) <= 3000
    and char_length(coalesce(courses, '')) <= 3000
    and char_length(coalesce(availability, '')) <= 500
    and char_length(coalesce(instagram, '')) <= 160
    and char_length(coalesce(message, '')) <= 3000
    and char_length(coalesce(resume_file_name, '')) <= 255
    and char_length(coalesce(resume_storage_path, '')) <= 500
  ) not valid;

alter table public.product_order_items
  drop constraint if exists product_order_items_public_values_check;
alter table public.product_order_items
  add constraint product_order_items_public_values_check check (
    quantity between 1 and 20
    and unit_amount > 0
    and total_amount = unit_amount * quantity
    and char_length(product_name) between 1 and 160
  ) not valid;

commit;

-- Auditoria visual: o resultado não deve mostrar políticas de escrita genéricas
-- para authenticated nas tabelas e buckets administrativos.
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, policyname;
