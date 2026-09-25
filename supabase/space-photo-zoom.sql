-- Zoom por foto no “Nosso Espaço” (aba do admin e seção do site).
-- Valor 1 = sem zoom; 1.8 = zoom máximo. Rode no SQL Editor do Supabase.

alter table public.space_photos
  add column if not exists image_zoom numeric(3,2) not null default 1;

update public.space_photos set image_zoom = 1 where image_zoom is null;

notify pgrst, 'reload schema';
