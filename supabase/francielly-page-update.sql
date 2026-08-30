-- Execute este arquivo uma única vez no SQL Editor do Supabase.
-- Ele completa a estrutura da página da Francielly e preenche os campos
-- iniciais. Depois disso, todos os textos permanecem editáveis pelo /admin.

alter table public.site_settings
  add column if not exists francielly_eyebrow text default 'Sobre a especialista',
  add column if not exists francielly_methodology_eyebrow text default 'Método Bem Bonita',
  add column if not exists francielly_method_1_title text default 'Corte a Seco e Curvatura Real',
  add column if not exists francielly_method_1_description text,
  add column if not exists francielly_method_2_title text default 'Saúde Capilar em Primeiro Lugar',
  add column if not exists francielly_method_2_description text,
  add column if not exists francielly_method_3_title text default 'Educação e Cuidado em Casa',
  add column if not exists francielly_method_3_description text,
  add column if not exists francielly_space_eyebrow text default 'Ambiente exclusivo',
  add column if not exists francielly_cta_label text default 'Agendar horário com Francielly',
  add column if not exists francielly_space_cta_label text default 'Agendar visita pelo WhatsApp';

update public.site_settings
set
  professional_name = 'Francielly Soares',
  francielly_eyebrow = 'Sobre a especialista',
  francielly_headline = 'Paixão, técnica e identidade',
  francielly_bio = 'Especialista em cabelos crespos e cacheados, Francielly Soares criou o Bem Bonita com o propósito de transformar a relação das mulheres com seus fios naturais. Seu trabalho une técnica, escuta e cuidado para valorizar cada curvatura, preservar a saúde capilar e fortalecer a autoestima.',
  francielly_mission = 'Mais do que estética: resgate da autoestima',
  francielly_cta_label = 'Agendar horário com Francielly',
  landmark = 'Lanna Shopping — Sala 118, Ponte Nova/MG',
  francielly_methodology_eyebrow = 'Método Bem Bonita',
  francielly_method_1_title = 'Corte a Seco e Curvatura Real',
  francielly_method_1_description = 'Cada corte é planejado considerando o fator encolhimento, o caimento e a densidade de cada mecha, respeitando o formato natural dos fios.',
  francielly_method_2_title = 'Saúde Capilar em Primeiro Lugar',
  francielly_method_2_description = 'Mechas e tratamentos são realizados com avaliação prévia da fibra capilar para preservar a integridade, a força e a definição dos cachos.',
  francielly_method_3_title = 'Educação e Cuidado em Casa',
  francielly_method_3_description = 'Além do resultado no salão, você aprende como lavar, finalizar e manter seus cabelos definidos e saudáveis no dia a dia.',
  francielly_space_eyebrow = 'Ambiente exclusivo',
  space_title = 'Um refúgio para você se cuidar',
  space_description = 'Localizado no Lanna Shopping, em Ponte Nova, o Bem Bonita oferece um ambiente acolhedor e preparado para proporcionar uma experiência tranquila, personalizada e focada em você.',
  francielly_space_cta_label = 'Agendar visita pelo WhatsApp',
  updated_at = now()
where id = 1;

