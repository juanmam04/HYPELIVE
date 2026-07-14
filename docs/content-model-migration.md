# Migración del modelo de contenido: videos → episodes

## Uso actual de `videos`

Representa una **mezcla**:

- VOD / “capítulo” de un programa (`program_id` set);
- resultado de un stream terminado (`stream_id` set);
- assets sueltos del canal.

No hay concepto de **Episode** ni **Recording** técnica.

## Problemas

1. Semántica confusa para Studio (“convertir grabación en episodio”).
2. Watch progress atado a `video_id`.
3. UI “Continuar viendo” / “Nuevos episodios” sin entidad Episode.
4. Imposible modelar temporada / número de episodio correctamente.

## Estrategia elegida

1. Crear tablas `episodes`, `recordings`, `seasons`, `hosts`, `program_hosts`, `program_follows`.
2. Migrar cada fila de `videos` con `program_id` a `episodes` **preservando el mismo UUID** → `/watch/[id]` sigue funcionando.
3. Videos sin `program_id`: asociar al primer programa del canal o crear episodio “Especial” del canal (documentado en seed).
4. Si hay `stream_id`: crear `recording` 1:1 y setear `source_stream_id` / `source_recording_id` en episode.
5. `watch_progress`: agregar `episode_id`, backfill desde `video_id`, mantener `video_id` nullable deprecado.
6. Mantener tabla `videos` en Phase 0.5 como **legacy read-only** + función/API `videoToEpisode` para compat.
7. Apps nuevas leen solo `episodes`; redirect documentado.

## Compatibilidad temporal

| Antes | Después |
|-------|---------|
| `/watch/[videoId]` | Mismo ID si migrado = episodeId |
| `getVideoById` | Alias → `getEpisodeById` |
| `HomeFeed.continueWatching` | Episodes + progress |
| Studio historial videos | Episodes + recordings |

## Queries que cambian

- `getVideoById` → deprecado, delega a episode.
- Nuevas: `getEpisodeById`, `getProgramEpisodes`, `getRelatedEpisodes`.
- `upsertWatchProgress` usa `episodeId`.

## Rollback

Re-aplicar backup de `videos` / `watch_progress`; episodes se pueden truncar si no hay producción real aún.
