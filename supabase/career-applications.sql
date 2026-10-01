-- Bem Bonita — currículos enviados pelo "Trabalhe conosco".
-- Execute este arquivo no SQL Editor do Supabase para liberar:
-- - envio público de candidaturas pelo site;
-- - upload de PDF no bucket privado career-resumes;
-- - leitura/download somente para administradores do /admin.

create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  whatsapp text not null,
  city_neighborhood text,
  interest_area text,
  experience text,
  courses text,
  availability text,
  instagram text,
  message text,
  resume_file_name text,
  resume_storage_path text,
  status text not null default 'new' check (status in ('new', 'reviewed', 'contacted', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists career_applications_created_at_idx
  on public.career_applications (created_at desc);

alter table public.career_applications enable row level security;

drop policy if exists "Anyone can submit career applications" on public.career_applications;
create policy "Anyone can submit career applications"
on public.career_applications
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins manage career applications" on public.career_applications;
create policy "Admins manage career applications"
on public.career_applications
for all
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

grant insert on public.career_applications to anon;
grant select, insert, update, delete on public.career_applications to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('career-resumes', 'career-resumes', false, 10485760, array['application/pdf'])
on conflict (id) do update
set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = array['application/pdf'];

drop policy if exists "Anyone can upload career PDF" on storage.objects;
create policy "Anyone can upload career PDF"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'career-resumes'
  and lower((storage.foldername(name))[1]) = 'curriculos'
);

drop policy if exists "Admins read career PDFs" on storage.objects;
create policy "Admins read career PDFs"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'career-resumes'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins delete career PDFs" on storage.objects;
create policy "Admins delete career PDFs"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'career-resumes'
  and exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);
