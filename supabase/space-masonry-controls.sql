alter table public.space_photos
  add column if not exists display_mode text not null default 'contain';

alter table public.space_photos
  add column if not exists focus_x integer not null default 50;

alter table public.space_photos
  add column if not exists focus_y integer not null default 50;

notify pgrst, 'reload schema';
