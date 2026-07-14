# Estándares de calidad

## Definition of Done (Phase 0)

- [x] `pnpm install` OK
- [x] `pnpm lint` OK
- [x] `pnpm typecheck` OK
- [x] `pnpm build` OK (web verificado; packages source)
- [x] Web inicia (http://localhost:4748, rutas 200)
- [x] Mobile Metro inicia (http://localhost:8081)
- [x] TV Metro inicia (http://localhost:8082)
- [x] Migraciones + seed presentes y documentados
- [x] Auth web/móvil con modo demo sin env
- [x] Chat realtime o mock funcional
- [x] Sin secrets en repo
- [x] Loading / empty / error en pantallas principales
- [x] Documentación alineada a lo implementado

**Pendiente de entorno local del usuario:** Docker + Supabase CLI para validar migraciones/seed en runtime; dispositivo/simulador TV para foco remoto real.
## Rendimiento

Imágenes con tamaño reservado, lazy donde aplique, skeletons, cache TanStack Query, code splitting Next, sin video real pesado.

## Accesibilidad

Teclado + focus visible (web), labels, contraste, touch targets, alt text, reduced motion, estados no solo por color.

## Seguridad

RLS, no service role en cliente, env validado, roles no elevables desde cliente, chat validado, errores sanitizados hacia Sentry/logs.

## Diseño / responsive / estados

Tokens obligatorios; web responsive; mobile safe areas; TV foco remoto; skeletons sin saltos bruscos.

## Testing

Validaciones Zod, mappers, helpers de dominio, lógica de chat/stream. Sin cobertura artificial.

## Criterios por plataforma

| | Web | Mobile | TV |
|--|-----|--------|-----|
| Navegación | App Router | Expo Router | Expo Router + back |
| Auth | Email/password | Email/password | Pairing |
| Foco | Teclado | Touch | Remoto obligatorio |
