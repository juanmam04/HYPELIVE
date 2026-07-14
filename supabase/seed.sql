-- HYPE LIVE — seed data (local / demo)
-- Jerarquía: canal → programa → temporada? → episodio
-- Stream en vivo → recording (1:1) → episodio VOD
-- Password demo: hypelive-demo-2026
-- Canales ficticios (sin marcas reales).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Fixed UUIDs
-- ---------------------------------------------------------------------------
-- Users
-- a1111111-1111-4111-8111-111111111101  sofia.rios     platform_admin
-- a1111111-1111-4111-8111-111111111102  mateo.vega     channel_admin
-- a1111111-1111-4111-8111-111111111103  lucia.mora     producer
-- a1111111-1111-4111-8111-111111111104  diego.salas    creator
-- a1111111-1111-4111-8111-111111111105  camila.ortega  viewer
-- a1111111-1111-4111-8111-111111111106  andres.pinto   viewer
--
-- Channels
-- b2222222-2222-4222-8222-222222222201  nocturna
-- b2222222-2222-4222-8222-222222222202  casa-sonora
-- b2222222-2222-4222-8222-222222222203  prisma
-- b2222222-2222-4222-8222-222222222204  horizonte

-- ---------------------------------------------------------------------------
-- Clear existing public + demo auth data (FK-safe order)
-- ---------------------------------------------------------------------------
delete from public.watch_progress;
delete from public.program_follows;
delete from public.follows;
delete from public.chat_messages;
delete from public.device_pairings;
delete from public.episodes;
delete from public.recordings;
delete from public.program_hosts;
delete from public.seasons;
delete from public.hosts;
delete from public.streams;
delete from public.videos;
delete from public.programs;
delete from public.channel_members;
delete from public.channels;

delete from auth.identities
where user_id in (
  'a1111111-1111-4111-8111-111111111101',
  'a1111111-1111-4111-8111-111111111102',
  'a1111111-1111-4111-8111-111111111103',
  'a1111111-1111-4111-8111-111111111104',
  'a1111111-1111-4111-8111-111111111105',
  'a1111111-1111-4111-8111-111111111106'
);

delete from auth.users
where id in (
  'a1111111-1111-4111-8111-111111111101',
  'a1111111-1111-4111-8111-111111111102',
  'a1111111-1111-4111-8111-111111111103',
  'a1111111-1111-4111-8111-111111111104',
  'a1111111-1111-4111-8111-111111111105',
  'a1111111-1111-4111-8111-111111111106'
);

-- ---------------------------------------------------------------------------
-- auth.users (local seed)
-- ---------------------------------------------------------------------------
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    'a1111111-1111-4111-8111-111111111101',
    'authenticated', 'authenticated',
    'sofia.rios@hypelive.demo',
    crypt('hypelive-demo-2026', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"sofia.rios","display_name":"Sofía Ríos","avatar_url":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"}'::jsonb,
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1111111-1111-4111-8111-111111111102',
    'authenticated', 'authenticated',
    'mateo.vega@hypelive.demo',
    crypt('hypelive-demo-2026', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"mateo.vega","display_name":"Mateo Vega","avatar_url":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"}'::jsonb,
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1111111-1111-4111-8111-111111111103',
    'authenticated', 'authenticated',
    'lucia.mora@hypelive.demo',
    crypt('hypelive-demo-2026', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"lucia.mora","display_name":"Lucía Mora","avatar_url":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"}'::jsonb,
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1111111-1111-4111-8111-111111111104',
    'authenticated', 'authenticated',
    'diego.salas@hypelive.demo',
    crypt('hypelive-demo-2026', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"diego.salas","display_name":"Diego Salas","avatar_url":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"}'::jsonb,
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1111111-1111-4111-8111-111111111105',
    'authenticated', 'authenticated',
    'camila.ortega@hypelive.demo',
    crypt('hypelive-demo-2026', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"camila.ortega","display_name":"Camila Ortega","avatar_url":"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop"}'::jsonb,
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1111111-1111-4111-8111-111111111106',
    'authenticated', 'authenticated',
    'andres.pinto@hypelive.demo',
    crypt('hypelive-demo-2026', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"andres.pinto","display_name":"Andrés Pinto","avatar_url":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"}'::jsonb,
    now(), now(), '', '', '', ''
  );

insert into auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
)
values
  (
    'a1111111-1111-4111-8111-111111111101',
    'a1111111-1111-4111-8111-111111111101',
    format('{"sub":"%s","email":"sofia.rios@hypelive.demo"}', 'a1111111-1111-4111-8111-111111111101')::jsonb,
    'email', 'a1111111-1111-4111-8111-111111111101', now(), now(), now()
  ),
  (
    'a1111111-1111-4111-8111-111111111102',
    'a1111111-1111-4111-8111-111111111102',
    format('{"sub":"%s","email":"mateo.vega@hypelive.demo"}', 'a1111111-1111-4111-8111-111111111102')::jsonb,
    'email', 'a1111111-1111-4111-8111-111111111102', now(), now(), now()
  ),
  (
    'a1111111-1111-4111-8111-111111111103',
    'a1111111-1111-4111-8111-111111111103',
    format('{"sub":"%s","email":"lucia.mora@hypelive.demo"}', 'a1111111-1111-4111-8111-111111111103')::jsonb,
    'email', 'a1111111-1111-4111-8111-111111111103', now(), now(), now()
  ),
  (
    'a1111111-1111-4111-8111-111111111104',
    'a1111111-1111-4111-8111-111111111104',
    format('{"sub":"%s","email":"diego.salas@hypelive.demo"}', 'a1111111-1111-4111-8111-111111111104')::jsonb,
    'email', 'a1111111-1111-4111-8111-111111111104', now(), now(), now()
  ),
  (
    'a1111111-1111-4111-8111-111111111105',
    'a1111111-1111-4111-8111-111111111105',
    format('{"sub":"%s","email":"camila.ortega@hypelive.demo"}', 'a1111111-1111-4111-8111-111111111105')::jsonb,
    'email', 'a1111111-1111-4111-8111-111111111105', now(), now(), now()
  ),
  (
    'a1111111-1111-4111-8111-111111111106',
    'a1111111-1111-4111-8111-111111111106',
    format('{"sub":"%s","email":"andres.pinto@hypelive.demo"}', 'a1111111-1111-4111-8111-111111111106')::jsonb,
    'email', 'a1111111-1111-4111-8111-111111111106', now(), now(), now()
  );

update public.profiles
set
  role = case id
    when 'a1111111-1111-4111-8111-111111111101' then 'platform_admin'
    when 'a1111111-1111-4111-8111-111111111102' then 'channel_admin'
    when 'a1111111-1111-4111-8111-111111111103' then 'producer'
    when 'a1111111-1111-4111-8111-111111111104' then 'creator'
    when 'a1111111-1111-4111-8111-111111111105' then 'viewer'
    when 'a1111111-1111-4111-8111-111111111106' then 'viewer'
  end,
  display_name = coalesce(display_name, username)
where id in (
  'a1111111-1111-4111-8111-111111111101',
  'a1111111-1111-4111-8111-111111111102',
  'a1111111-1111-4111-8111-111111111103',
  'a1111111-1111-4111-8111-111111111104',
  'a1111111-1111-4111-8111-111111111105',
  'a1111111-1111-4111-8111-111111111106'
);

-- ---------------------------------------------------------------------------
-- Channels (4)
-- ---------------------------------------------------------------------------
insert into public.channels (id, slug, name, description, logo_url, banner_url, is_verified)
values
  (
    'b2222222-2222-4222-8222-222222222201',
    'nocturna',
    'Nocturna',
    'Entretenimiento, entrevistas y conversación nocturna. Charlas largas, humor y cultura pop después de la medianoche.',
    'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=400&fit=crop',
    true
  ),
  (
    'b2222222-2222-4222-8222-222222222202',
    'casa-sonora',
    'Casa Sonora',
    'Música en vivo, sesiones íntimas y el detrás de escena de artistas emergentes del continente.',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop',
    true
  ),
  (
    'b2222222-2222-4222-8222-222222222203',
    'prisma',
    'Prisma',
    'Cultura en vivo: libros, cine, arte y conversaciones que abren perspectivas.',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=400&fit=crop',
    true
  ),
  (
    'b2222222-2222-4222-8222-222222222204',
    'horizonte',
    'Horizonte',
    'Viajes, emprendimiento, gastronomía y el futuro que se construye lejos de las oficinas.',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
    true
  );

-- ---------------------------------------------------------------------------
-- Channel members
-- ---------------------------------------------------------------------------
insert into public.channel_members (id, channel_id, user_id, role)
values
  ('c3333333-3333-4333-8333-333333333301', 'b2222222-2222-4222-8222-222222222201', 'a1111111-1111-4111-8111-111111111102', 'channel_admin'),
  ('c3333333-3333-4333-8333-333333333302', 'b2222222-2222-4222-8222-222222222201', 'a1111111-1111-4111-8111-111111111103', 'producer'),
  ('c3333333-3333-4333-8333-333333333303', 'b2222222-2222-4222-8222-222222222201', 'a1111111-1111-4111-8111-111111111104', 'creator'),
  ('c3333333-3333-4333-8333-333333333304', 'b2222222-2222-4222-8222-222222222202', 'a1111111-1111-4111-8111-111111111102', 'channel_admin'),
  ('c3333333-3333-4333-8333-333333333305', 'b2222222-2222-4222-8222-222222222202', 'a1111111-1111-4111-8111-111111111103', 'producer'),
  ('c3333333-3333-4333-8333-333333333306', 'b2222222-2222-4222-8222-222222222203', 'a1111111-1111-4111-8111-111111111103', 'channel_admin'),
  ('c3333333-3333-4333-8333-333333333307', 'b2222222-2222-4222-8222-222222222203', 'a1111111-1111-4111-8111-111111111104', 'creator'),
  ('c3333333-3333-4333-8333-333333333308', 'b2222222-2222-4222-8222-222222222204', 'a1111111-1111-4111-8111-111111111102', 'channel_admin'),
  ('c3333333-3333-4333-8333-333333333309', 'b2222222-2222-4222-8222-222222222204', 'a1111111-1111-4111-8111-111111111104', 'producer');

-- ---------------------------------------------------------------------------
-- Programs (16 = 4 × 4)
-- ---------------------------------------------------------------------------
insert into public.programs (
  id, channel_id, slug, title, description, artwork_url, banner_url,
  schedule_description, is_active
)
values
  -- Nocturna
  (
    'd4444444-4444-4444-8444-444444444401',
    'b2222222-2222-4222-8222-222222222201',
    'la-noche-es-nuestra',
    'La Noche Es Nuestra',
    'El late show de la casa: invitados, sketches y la mejor banda sonora para cerrar el día.',
    'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=640&h=360&fit=crop',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=400&fit=crop',
    'Lunes a jueves · 22:30',
    true
  ),
  (
    'd4444444-4444-4444-8444-444444444402',
    'b2222222-2222-4222-8222-222222222201',
    'mesa-abierta',
    'Mesa Abierta',
    'Tres voces, un tema y cero guion rígido. Debates nocturnos con invitados de la escena local.',
    'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=640&h=360&fit=crop',
    'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&h=400&fit=crop',
    'Martes y viernes · 21:00',
    true
  ),
  (
    'd4444444-4444-4444-8444-444444444403',
    'b2222222-2222-4222-8222-222222222201',
    'sin-filtro',
    'Sin Filtro',
    'Entrevistas largas sin cortes de marketing. Preguntas incómodas, risas y silencios honestos.',
    'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=640&h=360&fit=crop',
    null,
    'Miércoles · 23:00',
    true
  ),
  (
    'd4444444-4444-4444-8444-444444444404',
    'b2222222-2222-4222-8222-222222222201',
    'despues-de-hora',
    'Después de Hora',
    'El after: clips, llamadas de oyentes y lo que no entró al aire.',
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=640&h=360&fit=crop',
    null,
    'Jueves · 00:30',
    true
  ),
  -- Casa Sonora
  (
    'd4444444-4444-4444-8444-444444444405',
    'b2222222-2222-4222-8222-222222222202',
    'sesion-en-vivo',
    'Sesión en Vivo',
    'Conciertos íntimos desde el living de la Casa. Un artista, un set completo.',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=360&fit=crop',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=400&fit=crop',
    'Viernes · 20:00',
    true
  ),
  (
    'd4444444-4444-4444-8444-444444444406',
    'b2222222-2222-4222-8222-222222222202',
    'patio-sonoro',
    'Patio Sonoro',
    'Jam sessions abiertas en el patio. Improvisación, invitados y vecinos curiosos.',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=640&h=360&fit=crop',
    null,
    'Sábados · 18:00',
    true
  ),
  (
    'd4444444-4444-4444-8444-444444444407',
    'b2222222-2222-4222-8222-222222222202',
    'detras-de-la-cancion',
    'Detrás de la Canción',
    'Cómo se escribe un hit: demos, anécdotas de estudio y el proceso creativo.',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=640&h=360&fit=crop',
    null,
    'Domingos · 17:00',
    true
  ),
  (
    'd4444444-4444-4444-8444-444444444408',
    'b2222222-2222-4222-8222-222222222202',
    'casa-acustica',
    'Casa Acústica',
    'Una canción, un micrófono y un rincón de la casa. Versiones despojadas.',
    'https://images.unsplash.com/photo-1510915361894-db8b50135d2a?w=640&h=360&fit=crop',
    null,
    'Miércoles · 19:30',
    true
  ),
  -- Prisma
  (
    'd4444444-4444-4444-8444-444444444409',
    'b2222222-2222-4222-8222-222222222203',
    'cultura-en-vivo',
    'Cultura en Vivo',
    'Estrenos, ferias y eventos culturales transmitidos desde el lugar de los hechos.',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=640&h=360&fit=crop',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=400&fit=crop',
    'Jueves · 20:00',
    true
  ),
  (
    'd4444444-4444-4444-8444-444444444410',
    'b2222222-2222-4222-8222-222222222203',
    'entre-lineas',
    'Entre Líneas',
    'Club de lectura en cámara: capítulos, spoilers consentidos y recomendaciones.',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=640&h=360&fit=crop',
    null,
    'Lunes · 19:00',
    true
  ),
  (
    'd4444444-4444-4444-8444-444444444411',
    'b2222222-2222-4222-8222-222222222203',
    'historias-que-inspiran',
    'Historias que Inspiran',
    'Perfiles de creadores, activistas y oficios que cambian barrios.',
    'https://images.unsplash.com/photo-1456513080800-b6bbe6ed77ad?w=640&h=360&fit=crop',
    null,
    'Martes · 18:30',
    true
  ),
  (
    'd4444444-4444-4444-8444-444444444412',
    'b2222222-2222-4222-8222-222222222203',
    'punto-de-vista',
    'Punto de Vista',
    'Crítica de cine y series con contexto, sin spoilers innecesarios.',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=640&h=360&fit=crop',
    null,
    'Domingos · 21:00',
    true
  ),
  -- Horizonte
  (
    'd4444444-4444-4444-8444-444444444413',
    'b2222222-2222-4222-8222-222222222204',
    'planeta-futuro',
    'Planeta Futuro',
    'Ciencia cotidiana, clima y las ideas que van a moldear la próxima década.',
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=640&h=360&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop',
    'Martes · 17:00',
    true
  ),
  (
    'd4444444-4444-4444-8444-444444444414',
    'b2222222-2222-4222-8222-222222222204',
    'ruta-40',
    'Ruta 40',
    'Viajes por carretera, pueblos y paisajes. Diarios de viaje en tiempo real.',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=640&h=360&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
    'Sábados · 10:00',
    true
  ),
  (
    'd4444444-4444-4444-8444-444444444415',
    'b2222222-2222-4222-8222-222222222204',
    'emprender-hoy',
    'Emprender Hoy',
    'Historias de negocios locales, fallos honestos y tips accionables.',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=640&h=360&fit=crop',
    null,
    'Jueves · 18:00',
    true
  ),
  (
    'd4444444-4444-4444-8444-444444444416',
    'b2222222-2222-4222-8222-222222222204',
    'cocina-real',
    'Cocina Real',
    'Recetas de estación, mercados y cocinas de barrio sin adornos de set.',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=640&h=360&fit=crop',
    null,
    'Domingos · 12:00',
    true
  );

-- ---------------------------------------------------------------------------
-- Hosts
-- ---------------------------------------------------------------------------
insert into public.hosts (id, name, slug, bio, avatar_url)
values
  (
    'f6666666-6666-4666-8666-666666666601',
    'Valentina Ríos',
    'valentina-rios',
    'Conductora y productora. Especialista en entrevistas largas y humor seco.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop'
  ),
  (
    'f6666666-6666-4666-8666-666666666602',
    'Nicolás Herrera',
    'nicolas-herrera',
    'Co-host de Mesa Abierta. Periodista cultural y DJ ocasional.',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop'
  ),
  (
    'f6666666-6666-4666-8666-666666666603',
    'Marina Solís',
    'marina-solis',
    'Voz principal de Casa Sonora. Curadora musical y presentadora de sesiones.',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop'
  ),
  (
    'f6666666-6666-4666-8666-666666666604',
    'Tomás Quintero',
    'tomas-quintero',
    'Guitarrista y anfitrión de Patio Sonoro. Improvisa con cualquiera que se siente.',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop'
  ),
  (
    'f6666666-6666-4666-8666-666666666605',
    'Elena Vargas',
    'elena-vargas',
    'Crítica literaria y conductora de Entre Líneas. Lee más de lo que duerme.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop'
  ),
  (
    'f6666666-6666-4666-8666-666666666606',
    'Julián Castro',
    'julian-castro',
    'Documentalista y host de Cultura en Vivo. Cámara en mano desde ferias y teatros.',
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop'
  ),
  (
    'f6666666-6666-4666-8666-666666666607',
    'Paula Méndez',
    'paula-mendez',
    'Viajera y voz de Ruta 40. Mapas, mates y grabadoras siempre listas.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop'
  ),
  (
    'f6666666-6666-4666-8666-666666666608',
    'Sebastián Ortiz',
    'sebastian-ortiz',
    'Chef y conductor de Cocina Real. Prefiere el mercado al set de televisión.',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop'
  );

insert into public.program_hosts (id, program_id, host_id, role, display_order)
values
  ('a7777777-7777-4777-8777-777777777701', 'd4444444-4444-4444-8444-444444444401', 'f6666666-6666-4666-8666-666666666601', 'conductora', 0),
  ('a7777777-7777-4777-8777-777777777702', 'd4444444-4444-4444-8444-444444444402', 'f6666666-6666-4666-8666-666666666601', 'co-host', 0),
  ('a7777777-7777-4777-8777-777777777703', 'd4444444-4444-4444-8444-444444444402', 'f6666666-6666-4666-8666-666666666602', 'co-host', 1),
  ('a7777777-7777-4777-8777-777777777704', 'd4444444-4444-4444-8444-444444444403', 'f6666666-6666-4666-8666-666666666602', 'entrevistador', 0),
  ('a7777777-7777-4777-8777-777777777705', 'd4444444-4444-4444-8444-444444444404', 'f6666666-6666-4666-8666-666666666601', 'host', 0),
  ('a7777777-7777-4777-8777-777777777706', 'd4444444-4444-4444-8444-444444444405', 'f6666666-6666-4666-8666-666666666603', 'presentadora', 0),
  ('a7777777-7777-4777-8777-777777777707', 'd4444444-4444-4444-8444-444444444406', 'f6666666-6666-4666-8666-666666666604', 'anfitrión', 0),
  ('a7777777-7777-4777-8777-777777777708', 'd4444444-4444-4444-8444-444444444407', 'f6666666-6666-4666-8666-666666666603', 'host', 0),
  ('a7777777-7777-4777-8777-777777777709', 'd4444444-4444-4444-8444-444444444408', 'f6666666-6666-4666-8666-666666666604', 'host', 0),
  ('a7777777-7777-4777-8777-777777777710', 'd4444444-4444-4444-8444-444444444409', 'f6666666-6666-4666-8666-666666666606', 'conductor', 0),
  ('a7777777-7777-4777-8777-777777777711', 'd4444444-4444-4444-8444-444444444410', 'f6666666-6666-4666-8666-666666666605', 'conductora', 0),
  ('a7777777-7777-4777-8777-777777777712', 'd4444444-4444-4444-8444-444444444411', 'f6666666-6666-4666-8666-666666666606', 'host', 0),
  ('a7777777-7777-4777-8777-777777777713', 'd4444444-4444-4444-8444-444444444412', 'f6666666-6666-4666-8666-666666666605', 'crítica', 0),
  ('a7777777-7777-4777-8777-777777777714', 'd4444444-4444-4444-8444-444444444413', 'f6666666-6666-4666-8666-666666666607', 'host', 0),
  ('a7777777-7777-4777-8777-777777777715', 'd4444444-4444-4444-8444-444444444414', 'f6666666-6666-4666-8666-666666666607', 'viajera', 0),
  ('a7777777-7777-4777-8777-777777777716', 'd4444444-4444-4444-8444-444444444415', 'f6666666-6666-4666-8666-666666666608', 'host', 0),
  ('a7777777-7777-4777-8777-777777777717', 'd4444444-4444-4444-8444-444444444416', 'f6666666-6666-4666-8666-666666666608', 'chef', 0);

-- ---------------------------------------------------------------------------
-- Seasons (temporada 1 en programas destacados)
-- ---------------------------------------------------------------------------
insert into public.seasons (id, program_id, number, title, year, starts_at, ends_at)
values
  (
    'e5555555-5555-4555-8555-555555555501',
    'd4444444-4444-4444-8444-444444444401',
    1, 'Temporada 1', 2026,
    '2026-01-15T00:00:00Z', null
  ),
  (
    'e5555555-5555-4555-8555-555555555502',
    'd4444444-4444-4444-8444-444444444405',
    1, 'Temporada 1', 2026,
    '2026-02-01T00:00:00Z', null
  ),
  (
    'e5555555-5555-4555-8555-555555555503',
    'd4444444-4444-4444-8444-444444444409',
    1, 'Temporada 1', 2026,
    '2026-01-20T00:00:00Z', null
  ),
  (
    'e5555555-5555-4555-8555-555555555504',
    'd4444444-4444-4444-8444-444444444414',
    1, 'Temporada 1', 2026,
    '2026-03-01T00:00:00Z', null
  ),
  (
    'e5555555-5555-4555-8555-555555555505',
    'd4444444-4444-4444-8444-444444444402',
    1, 'Temporada 1', 2025,
    '2025-09-01T00:00:00Z', '2026-01-31T00:00:00Z'
  ),
  (
    'e5555555-5555-4555-8555-555555555506',
    'd4444444-4444-4444-8444-444444444413',
    1, 'Temporada 1', 2026,
    '2026-01-10T00:00:00Z', null
  );

-- ---------------------------------------------------------------------------
-- Streams: 1 live + scheduled + ended por canal
-- ---------------------------------------------------------------------------
insert into public.streams (
  id, channel_id, program_id, title, description, status,
  scheduled_for, started_at, ended_at, viewer_count,
  thumbnail_url, playback_id, provider
)
values
  -- Nocturna
  (
    'b8888888-8888-4888-8888-888888888801',
    'b2222222-2222-4222-8222-222222222201',
    'd4444444-4444-4444-8444-444444444401',
    'La Noche Es Nuestra — EN VIVO',
    'Invitados sorpresa, banda en vivo y el chat más activo de la madrugada.',
    'live', null, now() - interval '45 minutes', null, 1842,
    'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=1280&h=720&fit=crop',
    'pb_nocturna_live_001', 'mux'
  ),
  (
    'b8888888-8888-4888-8888-888888888802',
    'b2222222-2222-4222-8222-222222222201',
    'd4444444-4444-4444-8444-444444444402',
    'Mesa Abierta: ¿Qué miramos esta semana?',
    'Debate sobre estrenos, series y cultura pop.',
    'scheduled', now() + interval '2 days', null, null, 0,
    'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1280&h=720&fit=crop',
    null, 'mux'
  ),
  (
    'b8888888-8888-4888-8888-888888888803',
    'b2222222-2222-4222-8222-222222222201',
    'd4444444-4444-4444-8444-444444444403',
    'Sin Filtro con Valentina Ríos',
    'Entrevista larga grabada la semana pasada.',
    'ended', now() - interval '5 days', now() - interval '5 days', now() - interval '5 days' + interval '2 hours', 980,
    'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=1280&h=720&fit=crop',
    'pb_nocturna_ended_003', 'mux'
  ),
  (
    'b8888888-8888-4888-8888-888888888804',
    'b2222222-2222-4222-8222-222222222201',
    'd4444444-4444-4444-8444-444444444401',
    'La Noche Es Nuestra — especial viernes',
    'Edición especial con invitados musicales.',
    'ended', now() - interval '12 days', now() - interval '12 days', now() - interval '12 days' + interval '90 minutes', 2100,
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1280&h=720&fit=crop',
    'pb_nocturna_ended_004', 'mux'
  ),
  -- Casa Sonora
  (
    'b8888888-8888-4888-8888-888888888805',
    'b2222222-2222-4222-8222-222222222202',
    'd4444444-4444-4444-8444-444444444405',
    'Sesión en Vivo — EN VIVO',
    'Set completo desde el living de la Casa.',
    'live', null, now() - interval '20 minutes', null, 956,
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1280&h=720&fit=crop',
    'pb_casa_live_005', 'mux'
  ),
  (
    'b8888888-8888-4888-8888-888888888806',
    'b2222222-2222-4222-8222-222222222202',
    'd4444444-4444-4444-8444-444444444406',
    'Patio Sonoro: jam de sábado',
    'Improvisación abierta con músicos invitados.',
    'scheduled', now() + interval '3 days', null, null, 0,
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1280&h=720&fit=crop',
    null, 'mux'
  ),
  (
    'b8888888-8888-4888-8888-888888888807',
    'b2222222-2222-4222-8222-222222222202',
    'd4444444-4444-4444-8444-444444444408',
    'Casa Acústica — sesión íntima',
    'Tres canciones, un micrófono.',
    'ended', now() - interval '8 days', now() - interval '8 days', now() - interval '8 days' + interval '55 minutes', 640,
    'https://images.unsplash.com/photo-1510915361894-db8b50135d2a?w=1280&h=720&fit=crop',
    'pb_casa_ended_007', 'mux'
  ),
  (
    'b8888888-8888-4888-8888-888888888808',
    'b2222222-2222-4222-8222-222222222202',
    'd4444444-4444-4444-8444-444444444407',
    'Detrás de la Canción — demos',
    'Cómo se arma un tema desde cero.',
    'ended', now() - interval '15 days', now() - interval '15 days', now() - interval '15 days' + interval '70 minutes', 512,
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1280&h=720&fit=crop',
    'pb_casa_ended_008', 'mux'
  ),
  -- Prisma
  (
    'b8888888-8888-4888-8888-888888888809',
    'b2222222-2222-4222-8222-222222222203',
    'd4444444-4444-4444-8444-444444444409',
    'Cultura en Vivo — EN VIVO',
    'Recorrido por una feria de editoriales independientes.',
    'live', null, now() - interval '10 minutes', null, 421,
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1280&h=720&fit=crop',
    'pb_prisma_live_009', 'mux'
  ),
  (
    'b8888888-8888-4888-8888-888888888810',
    'b2222222-2222-4222-8222-222222222203',
    'd4444444-4444-4444-8444-444444444410',
    'Entre Líneas: club de lectura',
    'Capítulos 1–4 del libro del mes.',
    'scheduled', now() + interval '5 days', null, null, 0,
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1280&h=720&fit=crop',
    null, 'mux'
  ),
  (
    'b8888888-8888-4888-8888-888888888811',
    'b2222222-2222-4222-8222-222222222203',
    'd4444444-4444-4444-8444-444444444412',
    'Punto de Vista: estrenos de la semana',
    'Crítica sin spoilers de tres estrenos.',
    'ended', now() - interval '4 days', now() - interval '4 days', now() - interval '4 days' + interval '65 minutes', 730,
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop',
    'pb_prisma_ended_011', 'mux'
  ),
  (
    'b8888888-8888-4888-8888-888888888812',
    'b2222222-2222-4222-8222-222222222203',
    'd4444444-4444-4444-8444-444444444411',
    'Historias que Inspiran — taller de barrio',
    'Perfil de un taller comunitario de impresión.',
    'ended', now() - interval '18 days', now() - interval '18 days', now() - interval '18 days' + interval '50 minutes', 388,
    'https://images.unsplash.com/photo-1456513080800-b6bbe6ed77ad?w=1280&h=720&fit=crop',
    'pb_prisma_ended_012', 'mux'
  ),
  -- Horizonte
  (
    'b8888888-8888-4888-8888-888888888813',
    'b2222222-2222-4222-8222-222222222204',
    'd4444444-4444-4444-8444-444444444414',
    'Ruta 40 — EN VIVO',
    'Tramo de montaña con paradas improvisadas.',
    'live', null, now() - interval '1 hour', null, 1103,
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1280&h=720&fit=crop',
    'pb_horizonte_live_013', 'mux'
  ),
  (
    'b8888888-8888-4888-8888-888888888814',
    'b2222222-2222-4222-8222-222222222204',
    'd4444444-4444-4444-8444-444444444416',
    'Cocina Real: mercado de estación',
    'Recorrido por el mercado y receta en vivo.',
    'scheduled', now() + interval '1 day', null, null, 0,
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1280&h=720&fit=crop',
    null, 'mux'
  ),
  (
    'b8888888-8888-4888-8888-888888888815',
    'b2222222-2222-4222-8222-222222222204',
    'd4444444-4444-4444-8444-444444444413',
    'Planeta Futuro: clima y ciudades',
    'Conversación con urbanistas y científicos.',
    'ended', now() - interval '6 days', now() - interval '6 days', now() - interval '6 days' + interval '80 minutes', 890,
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1280&h=720&fit=crop',
    'pb_horizonte_ended_015', 'mux'
  ),
  (
    'b8888888-8888-4888-8888-888888888816',
    'b2222222-2222-4222-8222-222222222204',
    'd4444444-4444-4444-8444-444444444415',
    'Emprender Hoy: fallar y arrancar de nuevo',
    'Historias de pivots y primeros clientes.',
    'ended', now() - interval '20 days', now() - interval '20 days', now() - interval '20 days' + interval '75 minutes', 560,
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1280&h=720&fit=crop',
    'pb_horizonte_ended_016', 'mux'
  );

-- ---------------------------------------------------------------------------
-- Recordings (ended streams)
-- ---------------------------------------------------------------------------
insert into public.recordings (
  id, stream_id, provider_recording_id, playback_id, duration_seconds,
  thumbnail_url, status, ready_at
)
values
  ('c9999999-9999-4999-8999-999999999901', 'b8888888-8888-4888-8888-888888888803', 'rec_nocturna_003', 'pb_nocturna_ended_003', 7200, 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=1280&h=720&fit=crop', 'ready', now() - interval '4 days'),
  ('c9999999-9999-4999-8999-999999999902', 'b8888888-8888-4888-8888-888888888804', 'rec_nocturna_004', 'pb_nocturna_ended_004', 5400, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1280&h=720&fit=crop', 'ready', now() - interval '11 days'),
  ('c9999999-9999-4999-8999-999999999903', 'b8888888-8888-4888-8888-888888888807', 'rec_casa_007', 'pb_casa_ended_007', 3300, 'https://images.unsplash.com/photo-1510915361894-db8b50135d2a?w=1280&h=720&fit=crop', 'ready', now() - interval '7 days'),
  ('c9999999-9999-4999-8999-999999999904', 'b8888888-8888-4888-8888-888888888808', 'rec_casa_008', 'pb_casa_ended_008', 4200, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1280&h=720&fit=crop', 'ready', now() - interval '14 days'),
  ('c9999999-9999-4999-8999-999999999905', 'b8888888-8888-4888-8888-888888888811', 'rec_prisma_011', 'pb_prisma_ended_011', 3900, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop', 'ready', now() - interval '3 days'),
  ('c9999999-9999-4999-8999-999999999906', 'b8888888-8888-4888-8888-888888888812', 'rec_prisma_012', 'pb_prisma_ended_012', 3000, 'https://images.unsplash.com/photo-1456513080800-b6bbe6ed77ad?w=1280&h=720&fit=crop', 'ready', now() - interval '17 days'),
  ('c9999999-9999-4999-8999-999999999907', 'b8888888-8888-4888-8888-888888888815', 'rec_horizonte_015', 'pb_horizonte_ended_015', 4800, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1280&h=720&fit=crop', 'ready', now() - interval '5 days'),
  ('c9999999-9999-4999-8999-999999999908', 'b8888888-8888-4888-8888-888888888816', 'rec_horizonte_016', 'pb_horizonte_ended_016', 4500, 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1280&h=720&fit=crop', 'ready', now() - interval '19 days');

-- ---------------------------------------------------------------------------
-- Episodes (3–8 por programa; destacados con más)
-- ---------------------------------------------------------------------------
insert into public.episodes (
  id, program_id, season_id, source_stream_id, source_recording_id,
  title, description, episode_number, aired_at, duration_seconds,
  thumbnail_url, playback_id, status, published_at
)
values
  -- La Noche Es Nuestra (8 eps, temporada 1)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a001', 'd4444444-4444-4444-8444-444444444401', 'e5555555-5555-4555-8555-555555555501', 'b8888888-8888-4888-8888-888888888804', 'c9999999-9999-4999-8999-999999999902', 'Ep. 1 — Arrancamos la temporada', 'El primer late de la temporada con banda en vivo.', 1, now() - interval '12 days', 5400, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=640&h=360&fit=crop', 'pb_ep_lnn_01', 'published', now() - interval '11 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a002', 'd4444444-4444-4444-8444-444444444401', 'e5555555-5555-4555-8555-555555555501', null, null, 'Ep. 2 — Invitados de la escena', 'Comediantes y músicos locales en el sillón.', 2, now() - interval '10 days', 5100, 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=640&h=360&fit=crop', 'pb_ep_lnn_02', 'published', now() - interval '9 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a003', 'd4444444-4444-4444-8444-444444444401', 'e5555555-5555-4555-8555-555555555501', null, null, 'Ep. 3 — Noche de sketches', 'Bloques cómicos y la mejor sección de llamadas.', 3, now() - interval '8 days', 4950, 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=640&h=360&fit=crop', 'pb_ep_lnn_03', 'published', now() - interval '7 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a004', 'd4444444-4444-4444-8444-444444444401', 'e5555555-5555-4555-8555-555555555501', null, null, 'Ep. 4 — Playlist de medianoche', 'DJ set + entrevistas cortas.', 4, now() - interval '6 days', 5280, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=640&h=360&fit=crop', 'pb_ep_lnn_04', 'published', now() - interval '5 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a005', 'd4444444-4444-4444-8444-444444444401', 'e5555555-5555-4555-8555-555555555501', null, null, 'Ep. 5 — Debate light', 'Temas de la semana sin tomar partido (casi).', 5, now() - interval '4 days', 5400, 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=640&h=360&fit=crop', 'pb_ep_lnn_05', 'published', now() - interval '3 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a006', 'd4444444-4444-4444-8444-444444444401', 'e5555555-5555-4555-8555-555555555501', null, null, 'Ep. 6 — Especial música', 'Tres bandas, un escenario.', 6, now() - interval '2 days', 5600, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=360&fit=crop', 'pb_ep_lnn_06', 'published', now() - interval '1 day'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a007', 'd4444444-4444-4444-8444-444444444401', 'e5555555-5555-4555-8555-555555555501', null, null, 'Ep. 7 — En edición', 'Próximo episodio en postproducción.', 7, null, null, 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=640&h=360&fit=crop', null, 'processing', null),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a008', 'd4444444-4444-4444-8444-444444444401', 'e5555555-5555-4555-8555-555555555501', null, null, 'Ep. 8 — Borrador', 'Guion en progreso.', 8, null, null, null, null, 'draft', null),

  -- Mesa Abierta (5)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a009', 'd4444444-4444-4444-8444-444444444402', 'e5555555-5555-4555-8555-555555555505', null, null, 'Ep. 1 — Ciudad y ruido', 'Cómo suena la ciudad después de las 22.', 1, now() - interval '40 days', 3600, 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=640&h=360&fit=crop', 'pb_ep_ma_01', 'published', now() - interval '39 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a010', 'd4444444-4444-4444-8444-444444444402', 'e5555555-5555-4555-8555-555555555505', null, null, 'Ep. 2 — Humor y política', 'Límites del chiste en el late.', 2, now() - interval '33 days', 3720, 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=640&h=360&fit=crop', 'pb_ep_ma_02', 'published', now() - interval '32 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a011', 'd4444444-4444-4444-8444-444444444402', 'e5555555-5555-4555-8555-555555555505', null, null, 'Ep. 3 — Series que enganchan', 'Recomendaciones sin spoilers.', 3, now() - interval '26 days', 3480, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=640&h=360&fit=crop', 'pb_ep_ma_03', 'published', now() - interval '25 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a012', 'd4444444-4444-4444-8444-444444444402', 'e5555555-5555-4555-8555-555555555505', null, null, 'Ep. 4 — Invitados de radio', 'Voces de la noche en otros medios.', 4, now() - interval '19 days', 3900, 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=640&h=360&fit=crop', 'pb_ep_ma_04', 'published', now() - interval '18 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a013', 'd4444444-4444-4444-8444-444444444402', 'e5555555-5555-4555-8555-555555555505', null, null, 'Ep. 5 — Cierre de temporada', 'Lo mejor del ciclo y adelantos.', 5, now() - interval '12 days', 4100, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=640&h=360&fit=crop', 'pb_ep_ma_05', 'published', now() - interval '11 days'),

  -- Sin Filtro (3)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a014', 'd4444444-4444-4444-8444-444444444403', null, 'b8888888-8888-4888-8888-888888888803', 'c9999999-9999-4999-8999-999999999901', 'Ep. 1 — Conversación larga', 'Dos horas sin cortes de marketing.', 1, now() - interval '5 days', 7200, 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=640&h=360&fit=crop', 'pb_nocturna_ended_003', 'published', now() - interval '4 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a015', 'd4444444-4444-4444-8444-444444444403', null, null, null, 'Ep. 2 — Silencios honestos', 'Cuando la entrevista se pone quieta.', 2, now() - interval '20 days', 5400, 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=640&h=360&fit=crop', 'pb_ep_sf_02', 'published', now() - interval '19 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a016', 'd4444444-4444-4444-8444-444444444403', null, null, null, 'Ep. 3 — Preguntas incómodas', 'El arte de preguntar sin atacar.', 3, now() - interval '30 days', 5100, 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=640&h=360&fit=crop', 'pb_ep_sf_03', 'published', now() - interval '29 days'),

  -- Después de Hora (3)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a017', 'd4444444-4444-4444-8444-444444444404', null, null, null, 'Ep. 1 — Lo que no salió al aire', 'Clips y llamadas del after.', 1, now() - interval '7 days', 2400, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=640&h=360&fit=crop', 'pb_ep_dh_01', 'published', now() - interval '6 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a018', 'd4444444-4444-4444-8444-444444444404', null, null, null, 'Ep. 2 — Chat highlights', 'Los mejores mensajes de la semana.', 2, now() - interval '14 days', 2100, 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=640&h=360&fit=crop', 'pb_ep_dh_02', 'published', now() - interval '13 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a019', 'd4444444-4444-4444-8444-444444444404', null, null, null, 'Ep. 3 — Recap express', 'Resumen de 30 minutos.', 3, now() - interval '21 days', 1800, 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=640&h=360&fit=crop', 'pb_ep_dh_03', 'published', now() - interval '20 days'),

  -- Sesión en Vivo (6)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a020', 'd4444444-4444-4444-8444-444444444405', 'e5555555-5555-4555-8555-555555555502', null, null, 'Ep. 1 — Inauguración del living', 'Primera sesión completa en Casa Sonora.', 1, now() - interval '45 days', 3600, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=360&fit=crop', 'pb_ep_sev_01', 'published', now() - interval '44 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a021', 'd4444444-4444-4444-8444-444444444405', 'e5555555-5555-4555-8555-555555555502', null, null, 'Ep. 2 — Folk de medianoche', 'Set acústico con invitados.', 2, now() - interval '38 days', 3300, 'https://images.unsplash.com/photo-1510915361894-db8b50135d2a?w=640&h=360&fit=crop', 'pb_ep_sev_02', 'published', now() - interval '37 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a022', 'd4444444-4444-4444-8444-444444444405', 'e5555555-5555-4555-8555-555555555502', null, null, 'Ep. 3 — Electrónica en el living', 'Synths y luces bajas.', 3, now() - interval '31 days', 3900, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=640&h=360&fit=crop', 'pb_ep_sev_03', 'published', now() - interval '30 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a023', 'd4444444-4444-4444-8444-444444444405', 'e5555555-5555-4555-8555-555555555502', null, null, 'Ep. 4 — Cantautores del sur', 'Tres voces, un micrófono.', 4, now() - interval '24 days', 3500, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=640&h=360&fit=crop', 'pb_ep_sev_04', 'published', now() - interval '23 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a024', 'd4444444-4444-4444-8444-444444444405', 'e5555555-5555-4555-8555-555555555502', null, null, 'Ep. 5 — Remix night', 'Versiones y collabs.', 5, now() - interval '17 days', 3700, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=640&h=360&fit=crop', 'pb_ep_sev_05', 'published', now() - interval '16 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a025', 'd4444444-4444-4444-8444-444444444405', 'e5555555-5555-4555-8555-555555555502', null, null, 'Ep. 6 — Ensayo abierto', 'Errores incluidos.', 6, now() - interval '10 days', 3200, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=360&fit=crop', 'pb_ep_sev_06', 'published', now() - interval '9 days'),

  -- Patio Sonoro (3)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a026', 'd4444444-4444-4444-8444-444444444406', null, null, null, 'Ep. 1 — Primera jam', 'Improvisación con vecinos músicos.', 1, now() - interval '28 days', 4200, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=640&h=360&fit=crop', 'pb_ep_ps_01', 'published', now() - interval '27 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a027', 'd4444444-4444-4444-8444-444444444406', null, null, null, 'Ep. 2 — Blues en el patio', 'Jam de blues al atardecer.', 2, now() - interval '21 days', 3900, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=640&h=360&fit=crop', 'pb_ep_ps_02', 'published', now() - interval '20 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a028', 'd4444444-4444-4444-8444-444444444406', null, null, null, 'Ep. 3 — Percusión abierta', 'Ritmos y círculos.', 3, now() - interval '14 days', 3600, 'https://images.unsplash.com/photo-1510915361894-db8b50135d2a?w=640&h=360&fit=crop', 'pb_ep_ps_03', 'published', now() - interval '13 days'),

  -- Detrás de la Canción (4)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a029', 'd4444444-4444-4444-8444-444444444407', null, 'b8888888-8888-4888-8888-888888888808', 'c9999999-9999-4999-8999-999999999904', 'Ep. 1 — Del demo al master', 'Cómo se arma un tema desde cero.', 1, now() - interval '15 days', 4200, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=640&h=360&fit=crop', 'pb_casa_ended_008', 'published', now() - interval '14 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a030', 'd4444444-4444-4444-8444-444444444407', null, null, null, 'Ep. 2 — Letras que duelen', 'Proceso de escritura.', 2, now() - interval '22 days', 3000, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=640&h=360&fit=crop', 'pb_ep_dc_02', 'published', now() - interval '21 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a031', 'd4444444-4444-4444-8444-444444444407', null, null, null, 'Ep. 3 — Productores invitados', 'El oído detrás del hit.', 3, now() - interval '29 days', 3300, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=360&fit=crop', 'pb_ep_dc_03', 'published', now() - interval '28 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a032', 'd4444444-4444-4444-8444-444444444407', null, null, null, 'Ep. 4 — Mezcla en vivo', 'Sesión de mezcla comentada.', 4, now() - interval '8 days', 3600, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=640&h=360&fit=crop', 'pb_ep_dc_04', 'published', now() - interval '7 days'),

  -- Casa Acústica (3)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a033', 'd4444444-4444-4444-8444-444444444408', null, 'b8888888-8888-4888-8888-888888888807', 'c9999999-9999-4999-8999-999999999903', 'Ep. 1 — Tres canciones', 'Sesión íntima grabada.', 1, now() - interval '8 days', 3300, 'https://images.unsplash.com/photo-1510915361894-db8b50135d2a?w=640&h=360&fit=crop', 'pb_casa_ended_007', 'published', now() - interval '7 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a034', 'd4444444-4444-4444-8444-444444444408', null, null, null, 'Ep. 2 — Versiones despojadas', 'Covers mínimos.', 2, now() - interval '16 days', 2700, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=640&h=360&fit=crop', 'pb_ep_ca_02', 'published', now() - interval '15 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a035', 'd4444444-4444-4444-8444-444444444408', null, null, null, 'Ep. 3 — Un rincón, un tema', 'Una sola canción extendida.', 3, now() - interval '23 days', 1800, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=360&fit=crop', 'pb_ep_ca_03', 'published', now() - interval '22 days'),

  -- Cultura en Vivo (5)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a036', 'd4444444-4444-4444-8444-444444444409', 'e5555555-5555-4555-8555-555555555503', null, null, 'Ep. 1 — Feria de editoriales', 'Recorrido por stands independientes.', 1, now() - interval '35 days', 3600, 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=640&h=360&fit=crop', 'pb_ep_cev_01', 'published', now() - interval '34 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a037', 'd4444444-4444-4444-8444-444444444409', 'e5555555-5555-4555-8555-555555555503', null, null, 'Ep. 2 — Noche de museos', 'Galerías abiertas hasta tarde.', 2, now() - interval '28 days', 3300, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=640&h=360&fit=crop', 'pb_ep_cev_02', 'published', now() - interval '27 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a038', 'd4444444-4444-4444-8444-444444444409', 'e5555555-5555-4555-8555-555555555503', null, null, 'Ep. 3 — Teatro en la calle', 'Funciones al aire libre.', 3, now() - interval '21 days', 3000, 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=640&h=360&fit=crop', 'pb_ep_cev_03', 'published', now() - interval '20 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a039', 'd4444444-4444-4444-8444-444444444409', 'e5555555-5555-4555-8555-555555555503', null, null, 'Ep. 4 — Cine al aire libre', 'Pantalla gigante en la plaza.', 4, now() - interval '14 days', 4200, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=640&h=360&fit=crop', 'pb_ep_cev_04', 'published', now() - interval '13 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a040', 'd4444444-4444-4444-8444-444444444409', 'e5555555-5555-4555-8555-555555555503', null, null, 'Ep. 5 — Danza contemporánea', 'Ensayo abierto de compañía local.', 5, now() - interval '7 days', 2700, 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=640&h=360&fit=crop', 'pb_ep_cev_05', 'published', now() - interval '6 days'),

  -- Entre Líneas (4)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a041', 'd4444444-4444-4444-8444-444444444410', null, null, null, 'Ep. 1 — Libro del mes', 'Arranque del club de lectura.', 1, now() - interval '32 days', 3600, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=640&h=360&fit=crop', 'pb_ep_el_01', 'published', now() - interval '31 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a042', 'd4444444-4444-4444-8444-444444444410', null, null, null, 'Ep. 2 — Capítulos 1–4', 'Discusión con spoilers consentidos.', 2, now() - interval '25 days', 3900, 'https://images.unsplash.com/photo-1456513080800-b6bbe6ed77ad?w=640&h=360&fit=crop', 'pb_ep_el_02', 'published', now() - interval '24 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a043', 'd4444444-4444-4444-8444-444444444410', null, null, null, 'Ep. 3 — Capítulos 5–8', 'Medio libro, muchas teorías.', 3, now() - interval '18 days', 3800, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=640&h=360&fit=crop', 'pb_ep_el_03', 'published', now() - interval '17 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a044', 'd4444444-4444-4444-8444-444444444410', null, null, null, 'Ep. 4 — Cierre y recomendaciones', 'Qué leer después.', 4, now() - interval '11 days', 3400, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=640&h=360&fit=crop', 'pb_ep_el_04', 'published', now() - interval '10 days'),

  -- Historias que Inspiran (3)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a045', 'd4444444-4444-4444-8444-444444444411', null, 'b8888888-8888-4888-8888-888888888812', 'c9999999-9999-4999-8999-999999999906', 'Ep. 1 — Taller de barrio', 'Impresión comunitaria.', 1, now() - interval '18 days', 3000, 'https://images.unsplash.com/photo-1456513080800-b6bbe6ed77ad?w=640&h=360&fit=crop', 'pb_prisma_ended_012', 'published', now() - interval '17 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a046', 'd4444444-4444-4444-8444-444444444411', null, null, null, 'Ep. 2 — Biblioteca ambulante', 'Libros que viajan en bicicleta.', 2, now() - interval '27 days', 2700, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=640&h=360&fit=crop', 'pb_ep_hqi_02', 'published', now() - interval '26 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a047', 'd4444444-4444-4444-8444-444444444411', null, null, null, 'Ep. 3 — Huerta urbana', 'Cultivar en terrazas.', 3, now() - interval '9 days', 2400, 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=640&h=360&fit=crop', 'pb_ep_hqi_03', 'published', now() - interval '8 days'),

  -- Punto de Vista (4)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a048', 'd4444444-4444-4444-8444-444444444412', null, 'b8888888-8888-4888-8888-888888888811', 'c9999999-9999-4999-8999-999999999905', 'Ep. 1 — Estrenos de la semana', 'Tres películas, cero spoilers.', 1, now() - interval '4 days', 3900, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=640&h=360&fit=crop', 'pb_prisma_ended_011', 'published', now() - interval '3 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a049', 'd4444444-4444-4444-8444-444444444412', null, null, null, 'Ep. 2 — Series que enganchan', 'Qué binge vale la pena.', 2, now() - interval '11 days', 3600, 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=640&h=360&fit=crop', 'pb_ep_pdv_02', 'published', now() - interval '10 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a050', 'd4444444-4444-4444-8444-444444444412', null, null, null, 'Ep. 3 — Documentales', 'Historias reales en pantalla.', 3, now() - interval '18 days', 3300, 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=640&h=360&fit=crop', 'pb_ep_pdv_03', 'published', now() - interval '17 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a051', 'd4444444-4444-4444-8444-444444444412', null, null, null, 'Ep. 4 — Cine latinoamericano', 'Recomendaciones del continente.', 4, now() - interval '25 days', 3500, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=640&h=360&fit=crop', 'pb_ep_pdv_04', 'published', now() - interval '24 days'),

  -- Planeta Futuro (5)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a052', 'd4444444-4444-4444-8444-444444444413', 'e5555555-5555-4555-8555-555555555506', 'b8888888-8888-4888-8888-888888888815', 'c9999999-9999-4999-8999-999999999907', 'Ep. 1 — Clima y ciudades', 'Urbanismo y calor urbano.', 1, now() - interval '6 days', 4800, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=640&h=360&fit=crop', 'pb_horizonte_ended_015', 'published', now() - interval '5 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a053', 'd4444444-4444-4444-8444-444444444413', 'e5555555-5555-4555-8555-555555555506', null, null, 'Ep. 2 — Energía del barrio', 'Microgeneración y cooperativas.', 2, now() - interval '13 days', 3600, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&h=360&fit=crop', 'pb_ep_pf_02', 'published', now() - interval '12 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a054', 'd4444444-4444-4444-8444-444444444413', 'e5555555-5555-4555-8555-555555555506', null, null, 'Ep. 3 — Agua que falta', 'Sequías y soluciones locales.', 3, now() - interval '20 days', 3400, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=360&fit=crop', 'pb_ep_pf_03', 'published', now() - interval '19 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a055', 'd4444444-4444-4444-8444-444444444413', 'e5555555-5555-4555-8555-555555555506', null, null, 'Ep. 4 — Ciencia en la cocina', 'Experimentos caseros.', 4, now() - interval '27 days', 2800, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=640&h=360&fit=crop', 'pb_ep_pf_04', 'published', now() - interval '26 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a056', 'd4444444-4444-4444-8444-444444444413', 'e5555555-5555-4555-8555-555555555506', null, null, 'Ep. 5 — El cielo nocturno', 'Astronomía para curiosos.', 5, now() - interval '34 days', 3100, 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=640&h=360&fit=crop', 'pb_ep_pf_05', 'published', now() - interval '33 days'),

  -- Ruta 40 (6)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a057', 'd4444444-4444-4444-8444-444444444414', 'e5555555-5555-4555-8555-555555555504', null, null, 'Ep. 1 — Kilómetro cero', 'Salida y primeras paradas.', 1, now() - interval '42 days', 3600, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=640&h=360&fit=crop', 'pb_ep_r40_01', 'published', now() - interval '41 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a058', 'd4444444-4444-4444-8444-444444444414', 'e5555555-5555-4555-8555-555555555504', null, null, 'Ep. 2 — Pueblos de paso', 'Historias en estaciones de servicio.', 2, now() - interval '35 days', 3300, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=360&fit=crop', 'pb_ep_r40_02', 'published', now() - interval '34 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a059', 'd4444444-4444-4444-8444-444444444414', 'e5555555-5555-4555-8555-555555555504', null, null, 'Ep. 3 — Cordillera', 'Curvas y miradores.', 3, now() - interval '28 days', 3900, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=640&h=360&fit=crop', 'pb_ep_r40_03', 'published', now() - interval '27 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a060', 'd4444444-4444-4444-8444-444444444414', 'e5555555-5555-4555-8555-555555555504', null, null, 'Ep. 4 — Lago al amanecer', 'Camping y mate.', 4, now() - interval '21 days', 3000, 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=640&h=360&fit=crop', 'pb_ep_r40_04', 'published', now() - interval '20 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a061', 'd4444444-4444-4444-8444-444444444414', 'e5555555-5555-4555-8555-555555555504', null, null, 'Ep. 5 — Desierto y viento', 'Tramos largos sin señal.', 5, now() - interval '14 days', 3400, 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=640&h=360&fit=crop', 'pb_ep_r40_05', 'published', now() - interval '13 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a062', 'd4444444-4444-4444-8444-444444444414', 'e5555555-5555-4555-8555-555555555504', null, null, 'Ep. 6 — Llegada al sur', 'Cierre del primer tramo.', 6, now() - interval '7 days', 3600, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=640&h=360&fit=crop', 'pb_ep_r40_06', 'published', now() - interval '6 days'),

  -- Emprender Hoy (3)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a063', 'd4444444-4444-4444-8444-444444444415', null, 'b8888888-8888-4888-8888-888888888816', 'c9999999-9999-4999-8999-999999999908', 'Ep. 1 — Fallar y arrancar', 'Pivots y primeros clientes.', 1, now() - interval '20 days', 4500, 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=640&h=360&fit=crop', 'pb_horizonte_ended_016', 'published', now() - interval '19 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a064', 'd4444444-4444-4444-8444-444444444415', null, null, null, 'Ep. 2 — Finanzas sin miedo', 'Números básicos para empezar.', 2, now() - interval '13 days', 3000, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=640&h=360&fit=crop', 'pb_ep_eh_02', 'published', now() - interval '12 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a065', 'd4444444-4444-4444-8444-444444444415', null, null, null, 'Ep. 3 — Equipo chico', 'Contratar sin presupuesto.', 3, now() - interval '6 days', 2800, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=640&h=360&fit=crop', 'pb_ep_eh_03', 'published', now() - interval '5 days'),

  -- Cocina Real (4)
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a066', 'd4444444-4444-4444-8444-444444444416', null, null, null, 'Ep. 1 — Mercado de estación', 'Verduras de temporada.', 1, now() - interval '16 days', 2700, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=640&h=360&fit=crop', 'pb_ep_cr_01', 'published', now() - interval '15 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a067', 'd4444444-4444-4444-8444-444444444416', null, null, null, 'Ep. 2 — Guiso de domingo', 'Receta de olla.', 2, now() - interval '9 days', 2400, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=640&h=360&fit=crop', 'pb_ep_cr_02', 'published', now() - interval '8 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a068', 'd4444444-4444-4444-8444-444444444416', null, null, null, 'Ep. 3 — Pan casero', 'Masa, espera y horno.', 3, now() - interval '23 days', 3000, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=640&h=360&fit=crop', 'pb_ep_cr_03', 'published', now() - interval '22 days'),
  ('d0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a069', 'd4444444-4444-4444-8444-444444444416', null, null, null, 'Ep. 4 — Postre sin complicarse', 'Dulce rápido de estación.', 4, now() - interval '2 days', 2100, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=640&h=360&fit=crop', 'pb_ep_cr_04', 'published', now() - interval '1 day');

-- ---------------------------------------------------------------------------
-- Chat messages (live streams)
-- ---------------------------------------------------------------------------
insert into public.chat_messages (id, stream_id, user_id, content, stream_offset_seconds)
values
  ('e1b1b1b1-b1b1-4b1b-8b1b-b1b1b1b1b101', 'b8888888-8888-4888-8888-888888888801', 'a1111111-1111-4111-8111-111111111105', '¡Qué buena la banda de hoy!', 120),
  ('e1b1b1b1-b1b1-4b1b-8b1b-b1b1b1b1b102', 'b8888888-8888-4888-8888-888888888801', 'a1111111-1111-4111-8111-111111111106', 'Saludos desde Córdoba', 185),
  ('e1b1b1b1-b1b1-4b1b-8b1b-b1b1b1b1b103', 'b8888888-8888-4888-8888-888888888801', 'a1111111-1111-4111-8111-111111111103', 'Próximo bloque: invitados sorpresa', 300),
  ('e1b1b1b1-b1b1-4b1b-8b1b-b1b1b1b1b104', 'b8888888-8888-4888-8888-888888888805', 'a1111111-1111-4111-8111-111111111105', 'El sonido está impecable', 90),
  ('e1b1b1b1-b1b1-4b1b-8b1b-b1b1b1b1b105', 'b8888888-8888-4888-8888-888888888805', 'a1111111-1111-4111-8111-111111111106', '¿Van a tocar el cover?', 210),
  ('e1b1b1b1-b1b1-4b1b-8b1b-b1b1b1b1b106', 'b8888888-8888-4888-8888-888888888809', 'a1111111-1111-4111-8111-111111111105', 'Qué hermosa la feria', 60),
  ('e1b1b1b1-b1b1-4b1b-8b1b-b1b1b1b1b107', 'b8888888-8888-4888-8888-888888888809', 'a1111111-1111-4111-8111-111111111104', 'Estamos en el stand 12, pasen', 150),
  ('e1b1b1b1-b1b1-4b1b-8b1b-b1b1b1b1b108', 'b8888888-8888-4888-8888-888888888813', 'a1111111-1111-4111-8111-111111111106', 'Ese paisaje es una locura', 400),
  ('e1b1b1b1-b1b1-4b1b-8b1b-b1b1b1b1b109', 'b8888888-8888-4888-8888-888888888813', 'a1111111-1111-4111-8111-111111111105', '¿Dónde están exactamente?', 480),
  ('e1b1b1b1-b1b1-4b1b-8b1b-b1b1b1b1b110', 'b8888888-8888-4888-8888-888888888813', 'a1111111-1111-4111-8111-111111111102', 'Km 842, parada en 10 min', 520);

-- ---------------------------------------------------------------------------
-- Follows (channel) + program_follows
-- ---------------------------------------------------------------------------
insert into public.follows (id, user_id, channel_id)
values
  ('f2c2c2c2-c2c2-4c2c-8c2c-c2c2c2c2c201', 'a1111111-1111-4111-8111-111111111105', 'b2222222-2222-4222-8222-222222222201'),
  ('f2c2c2c2-c2c2-4c2c-8c2c-c2c2c2c2c202', 'a1111111-1111-4111-8111-111111111105', 'b2222222-2222-4222-8222-222222222202'),
  ('f2c2c2c2-c2c2-4c2c-8c2c-c2c2c2c2c203', 'a1111111-1111-4111-8111-111111111106', 'b2222222-2222-4222-8222-222222222203'),
  ('f2c2c2c2-c2c2-4c2c-8c2c-c2c2c2c2c204', 'a1111111-1111-4111-8111-111111111106', 'b2222222-2222-4222-8222-222222222204'),
  ('f2c2c2c2-c2c2-4c2c-8c2c-c2c2c2c2c205', 'a1111111-1111-4111-8111-111111111105', 'b2222222-2222-4222-8222-222222222204'),
  ('f2c2c2c2-c2c2-4c2c-8c2c-c2c2c2c2c206', 'a1111111-1111-4111-8111-111111111104', 'b2222222-2222-4222-8222-222222222201');

insert into public.program_follows (id, user_id, program_id)
values
  ('a3d3d3d3-d3d3-4d3d-8d3d-d3d3d3d3d301', 'a1111111-1111-4111-8111-111111111105', 'd4444444-4444-4444-8444-444444444401'),
  ('a3d3d3d3-d3d3-4d3d-8d3d-d3d3d3d3d302', 'a1111111-1111-4111-8111-111111111105', 'd4444444-4444-4444-8444-444444444405'),
  ('a3d3d3d3-d3d3-4d3d-8d3d-d3d3d3d3d303', 'a1111111-1111-4111-8111-111111111106', 'd4444444-4444-4444-8444-444444444414'),
  ('a3d3d3d3-d3d3-4d3d-8d3d-d3d3d3d3d304', 'a1111111-1111-4111-8111-111111111106', 'd4444444-4444-4444-8444-444444444410'),
  ('a3d3d3d3-d3d3-4d3d-8d3d-d3d3d3d3d305', 'a1111111-1111-4111-8111-111111111105', 'd4444444-4444-4444-8444-444444444416'),
  ('a3d3d3d3-d3d3-4d3d-8d3d-d3d3d3d3d306', 'a1111111-1111-4111-8111-111111111104', 'd4444444-4444-4444-8444-444444444402'),
  ('a3d3d3d3-d3d3-4d3d-8d3d-d3d3d3d3d307', 'a1111111-1111-4111-8111-111111111106', 'd4444444-4444-4444-8444-444444444409'),
  ('a3d3d3d3-d3d3-4d3d-8d3d-d3d3d3d3d308', 'a1111111-1111-4111-8111-111111111105', 'd4444444-4444-4444-8444-444444444413');

-- ---------------------------------------------------------------------------
-- Watch progress (on episodes)
-- ---------------------------------------------------------------------------
insert into public.watch_progress (id, user_id, video_id, episode_id, progress_seconds, completed)
values
  ('b4e4e4e4-e4e4-4e4e-8e4e-e4e4e4e4e401', 'a1111111-1111-4111-8111-111111111105', null, 'd0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a001', 1200, false),
  ('b4e4e4e4-e4e4-4e4e-8e4e-e4e4e4e4e402', 'a1111111-1111-4111-8111-111111111105', null, 'd0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a020', 3600, true),
  ('b4e4e4e4-e4e4-4e4e-8e4e-e4e4e4e4e403', 'a1111111-1111-4111-8111-111111111106', null, 'd0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a057', 900, false),
  ('b4e4e4e4-e4e4-4e4e-8e4e-e4e4e4e4e404', 'a1111111-1111-4111-8111-111111111106', null, 'd0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a048', 3900, true),
  ('b4e4e4e4-e4e4-4e4e-8e4e-e4e4e4e4e405', 'a1111111-1111-4111-8111-111111111105', null, 'd0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a066', 800, false),
  ('b4e4e4e4-e4e4-4e4e-8e4e-e4e4e4e4e406', 'a1111111-1111-4111-8111-111111111106', null, 'd0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a052', 2100, false),
  ('b4e4e4e4-e4e4-4e4e-8e4e-e4e4e4e4e407', 'a1111111-1111-4111-8111-111111111104', null, 'd0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a014', 4500, false),
  ('b4e4e4e4-e4e4-4e4e-8e4e-e4e4e4e4e408', 'a1111111-1111-4111-8111-111111111105', null, 'd0a0a0a0-a0a0-4a0a-8a0a-a0a0a0a0a033', 3300, true);
