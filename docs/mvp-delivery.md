# Entrega fase MVP — jerarquía Channel → Program → Episode

Fecha: 2026-07-14

## Resumen

Se completó la fase de corrección del MVP sobre el monorepo existente: modelo de contenido, migraciones/RLS/seed, queries compartidas, UI web comercial, adaptación mobile/TV, tests de jerarquía y documentación.

## Verificación ejecutada

| Check | Resultado |
|-------|-----------|
| Typecheck web / mobile / TV | OK |
| Lint web | OK (`--max-warnings 0`) |
| Tests domain | OK (11) |
| Tests database mappers | OK (7) |
| Tests api hierarchy | OK (7) |
| Tests validation | OK (8) |
| Build web | OK (Next.js 15, rutas jerárquicas generadas) |
| Screenshots web | OK en `docs/screenshots/` |
| Screenshots mobile/TV nativas | No capturadas (Expo no levantado en esta sesión) |

## Screenshots web

- `docs/screenshots/web-landing.png`
- `docs/screenshots/web-home.png`
- `docs/screenshots/web-channel.png`
- `docs/screenshots/web-program.png`
- `docs/screenshots/web-episode.png`
- `docs/screenshots/web-live.png`
- `docs/screenshots/web-studio.png`
- `docs/screenshots/web-go-live.png`
- `docs/screenshots/web-home-mobile.png`
- `docs/screenshots/web-program-mobile.png`

## Limitaciones reales

- Streaming real no integrado (player/go-live simulados).
- Uploads de media mock.
- Espacio en disco C: muy bajo (~2 GB libres) — builds pueden fallar por EPERM.
- Screenshots TV/Mobile nativos pendientes de sesión Expo.
- Param mobile/TV `watch/[videoId]` carga episodios (compat).

## Próxima fase (streaming real)

- Provider de ingest/playback
- Recording pipeline → Episode
- Chat over live offset
- Quitar mocks de player/go-live
