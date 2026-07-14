# Auditoría del estado actual — HYPE LIVE MVP

Fecha: 2026-07-14 (actualizada post-fase jerarquía)  
Alcance: monorepo existente (no proyecto nuevo).

## Qué funciona

- Monorepo pnpm + Turborepo: `apps/web`, `apps/mobile`, `apps/tv` + packages compartidos.
- Auth Supabase (email/password) cuando hay env; guards y middleware de studio.
- Chat Realtime preparado (mock local si no hay Supabase).
- Follows de **canal** y **programa** (`program_follows`).
- Watch progress sobre **episodes** (`episode_id`; `video_id` deprecado).
- Schema + migración jerárquica: seasons, hosts, program_hosts, recordings, episodes, program_follows.
- Seed canónico: 4 canales (Nocturna, Casa Sonora, Prisma, Horizonte), 16 programas, hosts, seasons, streams, recordings, episodios.
- Design tokens comerciales: fondo oscuro, acento azul `#3D7EEA`, rojo solo LIVE.
- Web: Landing `/`, Home, Channel (tabs), Program, Episode `/watch/[episodeId]`, Live, Studio, Go Live (programa|evento), recordings, episodes.
- Mobile/TV: navegación Channel → Program → Episode; branding HYPE LIVE.
- Queries compartidas en `@hypelive/api` con mocks alineados.
- Branding centralizado: `APP_NAME` / `BRAND_NAME` en `@hypelive/domain`.

## Qué está mockeado

- Player, Go Live (cámara/mic/calidad), métricas de studio, uploads de artwork.
- Chat sin Supabase: mensajes locales.
- Creación de programas / convertir recording → episode: UI simulada.
- `useMock` vía `isDemoMode()` cuando no hay env Supabase válido.

## Qué sigue pendiente / limitado

1. Streaming real (IVS/Mux/etc.) — **fuera de esta fase**.
2. Uploads reales de media.
3. `/studio/programs/[programId]` edición profunda (hay listado + new).
4. Tests RLS en CI contra Supabase local (migración lista; no hay suite e2e DB en CI).
5. TV search aún sobre mocks locales.
6. Mobile/TV watch param sigue nombrado `videoId` pero carga episodios.

## Rutas web

`/` (landing) · `/home` · `/en-vivo` · `/programas` · `/canales` · `/mi-lista` · `/configuracion` · `/live/[streamId]` · `/watch/[episodeId]` · `/channel/[channelSlug]` · `/channel/[channelSlug]/program/[programSlug]` · `/studio` · `/studio/programs` · `/studio/programs/new` · `/studio/go-live` · `/studio/recordings` · `/studio/episodes` · `/login` · `/register`

## Tablas (post-migración)

profiles, channels, channel_members, programs (+ banner, is_active), seasons, hosts, program_hosts, streams, recordings, episodes, chat_messages, follows (canal), program_follows, watch_progress (episode_id), device_pairings, videos (compat / deprecada).

## Modelo

```
Channel → Program → Season? → Episode
                 ↘ Stream → Recording? → Episode?
Channel → Stream (evento especial, program_id null)
```

## Cambios realizados en esta fase

1. Tipos compartidos Episode/Season/Host/Recording + HomeFeed/StudioSummary.
2. Migración SQL + RLS + seed 4 canales.
3. Queries y mocks alineados; tests de jerarquía en `@hypelive/api`.
4. Web/Mobile/TV adaptados a la jerarquía y UI comercial.
5. Landing real (ya no solo redirect).
6. Docs de migración de videos → episodes.
