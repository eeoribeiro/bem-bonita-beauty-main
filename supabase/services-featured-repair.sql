-- Bem Bonita — Reparo seguro para serviços em destaque.
-- Execute no SQL Editor do Supabase se o botão "Marcar como serviço em destaque"
-- der erro ao salvar no /admin. Este script não apaga dados existentes.

alter table public.services
  add column if not exists price_text text not null default '',
  add column if not exists featured boolean not null default false;

create index if not exists services_featured_sort_idx
  on public.services (featured desc, sort_order asc);

notify pgrst, 'reload schema';
