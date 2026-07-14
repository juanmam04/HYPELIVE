# Plan de implementación — revisión MVP (jerarquía de contenido)

## Principios

- No destruir monorepo ni packages.
- No streaming real.
- Migración incremental y verificable.
- `videos` deprecado con adaptador hasta estabilizar `episodes`.

## Fases

### F1 — Dominio y branding ✅ objetivo inmediato
- `APP_NAME` / `BRAND_NAME` = HYPE LIVE.
- Tipos: Episode, Season, Host, Recording, EpisodeStatus, RecordingStatus.
- Extender Program (bannerUrl, isActive).
- WatchProgress → episodeId (compat videoId).
- Follow canal + ProgramFollow.

### F2 — Migración SQL + RLS
- `20260714000000_content_hierarchy.sql`
- Tablas: seasons, hosts, program_hosts, recordings, episodes, program_follows.
- Alter programs: banner_url, is_active.
- Migrar filas videos → episodes (mismos IDs cuando sea posible).
- watch_progress.episode_id + backfill.
- RLS: lectura pública contenido publicado; escritura solo miembros autorizados.
- Vista o tabla `videos` mantenida como compat (o view sobre episodes).

### F3 — Seed + mocks
- 4 canales: Nocturna, Casa Sonora, Prisma, Horizonte + programas listados.
- Hosts ficticios, streams, episodes, recordings.
- mock-data 1:1 con seed.

### F4 — API / queries
- getFeaturedStream, getLiveStreams, getChannelBySlug, getChannelPrograms,
  getProgramBySlug, getProgramEpisodes, getEpisodeById, getStreamById,
  follow/unfollow channel+program, watch progress por episode.
- Mappers en `@hypelive/database`.
- Web: usar mock solo si `isDemoMode()`.

### F5 — Design tokens + componentes
- Ajustar tokens si falta surface-elevated / border-active.
- ChannelCard, ProgramCard, EpisodeCard, StreamCard, LiveBadge, VerifiedBadge.
- Hover 1.02, 150–200ms.

### F6 — Web rutas
- `/channel/[slug]` con tabs.
- `/channel/[slug]/program/[programSlug]`.
- `/watch/[episodeId]` (+ redirect videoId).
- Studio: programs, recordings, go-live tipo programa|evento.
- Home: hero + streams / channels / programs / episodes / upcoming.

### F7 — Mobile + TV
- Navegación y pantallas Channel / Program / Episode.
- Branding HYPE LIVE; quitar “Modo demo” visible.

### F8 — Tests + CI + screenshots
- Tests dominio/mappers/queries clave.
- lint, typecheck, test, build web.
- Screenshots requeridos.

## Verificación por fase

Tras cada fase: typecheck del package tocado; no avanzar con errores TS.
