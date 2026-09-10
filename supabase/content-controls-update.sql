-- Bem Bonita — Controles novos de conteúdo, galeria e serviços
-- Execute este arquivo uma vez no SQL Editor do Supabase.

alter table public.site_settings
  add column if not exists services_card_style text not null default 'photo';

alter table public.site_settings
  drop constraint if exists site_settings_services_card_style_check;

alter table public.site_settings
  add constraint site_settings_services_card_style_check
  check (services_card_style in ('photo', 'compact'));

alter table public.site_settings add column if not exists francielly_photo_label text default 'Cuidado autoral';
alter table public.site_settings add column if not exists francielly_extra_1_eyebrow text default 'Trajetória';
alter table public.site_settings add column if not exists francielly_extra_1_title text;
alter table public.site_settings add column if not exists francielly_extra_1_subtitle text;
alter table public.site_settings add column if not exists francielly_extra_2_eyebrow text default 'Atendimento';
alter table public.site_settings add column if not exists francielly_extra_2_title text;
alter table public.site_settings add column if not exists francielly_extra_2_subtitle text;
alter table public.site_settings add column if not exists francielly_extra_3_eyebrow text default 'Resultado';
alter table public.site_settings add column if not exists francielly_extra_3_title text;
alter table public.site_settings add column if not exists francielly_extra_3_subtitle text;

alter table public.portfolio_items add column if not exists service_id uuid references public.services(id) on delete set null;
alter table public.portfolio_items add column if not exists service_name text;
alter table public.portfolio_items add column if not exists hair_type text default 'Todos os tipos de cabelo';
alter table public.portfolio_items add column if not exists photo_label text;
alter table public.portfolio_items add column if not exists image_zoom numeric(3,2) not null default 1;
alter table public.portfolio_items add column if not exists image_position_x integer not null default 50;
alter table public.portfolio_items add column if not exists image_position_y integer not null default 50;

update public.site_settings
set services_card_style = coalesce(nullif(services_card_style, ''), 'photo')
where id = 1;

update public.portfolio_items
set image_zoom = coalesce(image_zoom, 1),
    image_position_x = coalesce(image_position_x, 50),
    image_position_y = coalesce(image_position_y, 50),
    hair_type = coalesce(nullif(hair_type, ''), 'Todos os tipos de cabelo');
