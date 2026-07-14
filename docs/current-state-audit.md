# Auditoría del estado actual — HYPE LIVE MVP

Fecha: 2026-07-14  
Alcance: monorepo existente (no proyecto nuevo).

## Qué funciona

- Monorepo pnpm + Turborepo: `apps/web`, `apps/mobile`, `apps/tv` + packages compartidos.
- Auth Supabase (email/password) cuando hay env; guards y middleware de studio.
- Chat Realtime preparado (mock local si no hay Supabase).
- Follows de **canal**, watch progress sobre **videos**.
- Schema RLS inicial: profiles, channels, channel_members, programs, streams, videos, chat, follows, watch_progress, device_pairings.
- Seed rico (6 canales ficticios, programas, streams, videos).
- Design tokens: fondo oscuro, acento azul `#3D7EEA`, rojo solo LIVE.
- Web Home reciente: header HYPE LIVE, hero, fila “En vivo ahora” en primer viewport (1920×1080 verificado).
- Studio + Go Live simulados; VideoProvider mock.

## Qué está mockeado

- Web fuerza `{ useMock: true }` en casi todas las queries → no consume DB aunque exista.
- Player, Go Live (cámara/mic), métricas de studio, pairing TV (parcial).
- Chat sin Supabase: mensajes locales.
- Enrich de channel/program en path “real” aún usa mocks en algunos puntos.

## Qué está roto / ambiguo

1. **No existe jerarquía Episode**: `videos` mezcla VOD / grabación / “capítulo”.
2. **No hay** seasons, hosts, recordings, program_follows.
3. **ProgramCard** navega al canal, no a ficha de programa.
4. **No hay ruta** `/channel/.../program/...` ni `/watch/[episodeId]`.
5. Seed vs `mock-data` desalineados (conteos y asignación de programas).
6. Restos “Project One” en `app.json` mobile/TV y docs; “Modo demo” en mobile profile.
7. Tipo `ChannelDetail` sin query dedicada.

## Rutas web existentes

`/` → redirect `/home` · `/home` · `/en-vivo` · `/programas` · `/canales` · `/mi-lista` · `/configuracion` · `/live/[streamId]` · `/watch/[videoId]` · `/channel/[channelSlug]` · `/studio` · `/studio/go-live` · `/login` · `/register`

## Tablas existentes

profiles, channels, channel_members, programs, streams, **videos**, chat_messages, follows (solo canal), watch_progress (video_id), device_pairings.

## Ambiguidades del modelo

| Concepto producto | Representación actual |
|-------------------|------------------------|
| Canal / medio | `channels` ✅ |
| Programa / show | `programs` ✅ (faltan banner, is_active) |
| Episodio | ≈ `videos` (incorrecto semánticamente) |
| Grabación técnica | no existe (solo interfaz stub) |
| Temporada | no existe |
| Host / conductor | no existe |
| Follow programa | no existe |

## Inconsistencias visuales

- Home web OK en dirección comercial; landing marketing eliminada (redirect).
- Mobile/TV aún con naming Project One en manifests y copy “Modo demo”.
- Docs `design-system` / `implementation-plan` parcialmente desactualizados.

## Cambios previstos (sin destruir arquitectura)

1. Introducir Episode / Season / Host / Recording + program_follows.
2. Migrar `videos` → `episodes` (IDs preservados) + adaptador temporal.
3. Queries compartidas reales; quitar `useMock: true` hardcodeado (fallback solo si falta env).
4. Rutas Channel → Program → Episode; redirects desde `/watch/[videoId]`.
5. Studio: programas, go-live programa|evento, recordings UI mock.
6. Alinear seed a 4 canales canónicos (Nocturna, Casa Sonora, Prisma, Horizonte).
7. Actualizar mobile/TV a la misma jerarquía y branding HYPE LIVE.
8. Tests, lint, typecheck, builds, screenshots.
