# Supabase — HYPE

Configuración de Supabase para el proyecto HYPE.

## Requisitos

- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Docker Desktop (solo para local)

## Cloud (recomendado para conectar tu proyecto)

Guía completa: `docs/setup.md` §3.

```bash
pnpm db:link
pnpm db:push
# Seed: SQL Editor con seed.sql  —o—  pnpm db:seed --remote
pnpm supabase:check
```

Auth Dashboard:
- Site URL: `http://localhost:4748`
- Redirect URLs: `http://localhost:4748/**`
- Confirm email: off en desarrollo

## Arranque local

```bash
pnpm db:start
pnpm db:reset    # migraciones + seed
pnpm db:status   # URL + anon key → pegar en .env de las apps
```

URLs típicas locales:

| Servicio | URL |
|----------|-----|
| API      | http://127.0.0.1:54321 |
| Studio   | http://127.0.0.1:54323 |
| DB       | postgresql://postgres:postgres@127.0.0.1:54322/postgres |
| Inbucket | http://127.0.0.1:54324 |

## Migraciones

En `migrations/`. Se aplican con `db reset` (local) o `db push` (remoto).

1. `20260314000000_initial_schema.sql` — perfiles, canales, programas, streams, chat, follows, RLS
2. `20260714000000_content_hierarchy.sql` — seasons, hosts, episodes, recordings, program_follows

### Jerarquía

```
Canal → Programa → Temporada? → Episodio (VOD)
                 ↘ Stream (live) → Recording → Episodio
```

## Seed

`seed.sql` — mundo demo en español (4 canales ficticios).

Password demo: `hypelive-demo-2026`

| Email | Rol |
|-------|-----|
| sofia.rios@hypelive.demo | platform_admin |
| mateo.vega@hypelive.demo | channel_admin |
| lucia.mora@hypelive.demo | producer |
| diego.salas@hypelive.demo | creator |
| camila.ortega@hypelive.demo | viewer |
| andres.pinto@hypelive.demo | viewer |

Local: incluido en `pnpm db:reset` / `pnpm db:seed`.  
Remoto: SQL Editor o `pnpm db:seed --remote` (requiere `DATABASE_URL` + `psql`).

## Edge Functions

`functions/` está preparado; vacío por ahora.

## Estructura

```
supabase/
├── config.toml
├── seed.sql
├── README.md
├── functions/
└── migrations/
```

## Detener local

```bash
pnpm db:stop
```
