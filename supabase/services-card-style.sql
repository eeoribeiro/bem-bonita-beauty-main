-- Bem Bonita — Opção global de estilo dos cards de serviços
-- Execute este arquivo no SQL Editor do Supabase se a opção ainda não aparecer/salvar no admin.

alter table public.site_settings
  add column if not exists services_card_style text not null default 'photo';

alter table public.site_settings
  drop constraint if exists site_settings_services_card_style_check;

alter table public.site_settings
  add constraint site_settings_services_card_style_check
  check (services_card_style in ('photo', 'compact'));

update public.site_settings
set services_card_style = coalesce(nullif(services_card_style, ''), 'photo')
where id = 1;
