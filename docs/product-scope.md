# Alcance de producto

## Phase 0 — Product Foundation (este repositorio)

Incluye:

- Monorepo web + mobile + TV
- Backend Supabase (schema, RLS, seed)
- Auth web/móvil + pairing TV
- Home, live ficticio, canal, watch, studio / go-live
- Chat realtime (o mock)
- Design tokens y componentes por plataforma
- Observabilidad preparada (Sentry opcional)
- CI lint / typecheck / test / build web
- Documentación

## No incluye (Phase 0)

- Amazon IVS u otro proveedor real de video
- OBS / RTMP / WebRTC real
- Cámara/micrófono reales en Go Live
- Grabaciones y procesamiento VOD real
- Pagos, suscripciones, publicidad
- Recomendaciones con IA
- Moderación avanzada de chat
- CDN / DRM / analytics de producto completo

## Phase 1 (siguiente)

- Implementar `VideoProvider` real detrás de la interfaz existente
- Playback HLS en web/móvil/TV
- Broadcaster móvil nativo
- Ingesta studio web
- Webhooks de estado de stream
- Thumbnails / recording pipeline
- Emparejamiento TV ↔ cuenta end-to-end endurecido
