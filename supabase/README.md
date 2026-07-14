# Supabase — HYPE LIVE

Configuración local de Supabase para el proyecto HYPE LIVE.

## Requisitos

- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Docker Desktop en ejecución

## Arranque local

```bash
# Desde la raíz del repo
supabase start
```

Esto levanta API, Postgres, Studio, Auth, Realtime y Storage.

URLs típicas:

| Servicio | URL |
|----------|-----|
| API      | http://127.0.0.1:54321 |
| Studio   | http://127.0.0.1:54323 |
| DB       | postgresql://postgres:postgres@127.0.0.1:54322/postgres |
| Inbucket | http://127.0.0.1:54324 |

Para ver claves locales:

```bash
supabase status
```

## Migraciones

Las migraciones viven en `migrations/`. Al hacer `supabase start` (o `supabase db reset`) se aplican automáticamente.

1. `20260314000000_initial_schema.sql` — perfiles, canales, programas, streams, videos (legacy), chat, follows, watch_progress, RLS.
2. `20260714000000_content_hierarchy.sql` — jerarquía de contenido: temporadas, hosts, episodios, recordings, program_follows; migra VOD desde `videos` → `episodes`.

### Jerarquía de contenido

```
Canal → Programa → Temporada? → Episodio (VOD)
                 ↘ Stream (live) → Recording (1:1 MVP) → Episodio
```

- **programs**: `banner_url`, `is_active`
- **seasons**: opcional por programa; trigger valida `season.program_id = episode.program_id`
- **hosts** / **program_hosts**: conductores y vínculo a programas
- **recordings**: un recording por stream (MVP)
- **episodes**: unidad VOD canónica (`draft|processing|published|unavailable|archived`)
- **program_follows**: follow a nivel programa
- **watch_progress**: `episode_id` (preferido); `video_id` queda nullable por compatibilidad

Aplicar solo migraciones pendientes:

```bash
supabase db push
# o, en local:
supabase migration up
```

Reset completo (recrea DB + migra + seed):

```bash
supabase db reset
```

## Seed

`seed.sql` carga un mundo demo en español con **4 canales ficticios** (Nocturna, Casa Sonora, Prisma, Horizonte): programas, hosts, temporadas, streams (live/scheduled/ended), recordings, episodios, chat, follows y progreso de visionado.

- Usuarios demo (password: `hypelive-demo-2026`):
  - `sofia.rios@hypelive.demo` — platform_admin
  - `mateo.vega@hypelive.demo` — channel_admin
  - `lucia.mora@hypelive.demo` — producer
  - `diego.salas@hypelive.demo` — creator
  - `camila.ortega@hypelive.demo` / `andres.pinto@hypelive.demo` — viewers

El seed limpia tablas públicas en orden FK, recrea `auth.users` e inserta datos con UUIDs fijos. En un proyecto remoto, crea los usuarios vía Auth API y alinea los UUIDs o adapta el seed.

## Edge Functions

La carpeta `functions/` está preparada para Edge Functions. Añade cada función en su propio subdirectorio.

## Estructura

```
supabase/
├── config.toml
├── seed.sql
├── README.md
├── functions/
│   └── .gitkeep
└── migrations/
    ├── 20260314000000_initial_schema.sql
    └── 20260714000000_content_hierarchy.sql
```

## Detener

```bash
supabase stop
```
