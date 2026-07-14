# Arquitectura — Phase 0

## Separación de aplicaciones

| App | Rol |
|-----|-----|
| `apps/web` | Experiencia principal de descubrimiento, live, VOD y studio |
| `apps/mobile` | Consumo y creación móvil (Go Live preparado, sin hardware real) |
| `apps/tv` | Consumo con control remoto; auth solo por device pairing |

Las tres consumen el mismo modelo de dominio (`@hypelive/types`, `@hypelive/domain`) y las mismas consultas (`@hypelive/api`).

## Paquetes compartidos

| Package | Responsabilidad |
|---------|-----------------|
| `types` | Contratos de entidades |
| `domain` | Reglas puras, branding, `VideoProvider` |
| `validation` | Zod |
| `database` | Cliente Supabase + mappers snake↔camel |
| `api` | Queries/mutations + mock fallback |
| `auth` | Sesión, sign-in/up/out, guards |
| `config` | Validación de env |
| `design-tokens` | Tokens visuales |
| `analytics` | Logger + Sentry opcional |
| `eslint-config` / `typescript-config` | Tooling |

**No** se comparten componentes visuales complejos entre web y React Native.

## Flujo de datos

```text
UI (web/mobile/tv)
  → @hypelive/api (TanStack Query options / functions)
    → @hypelive/database (client + mappers)
      → Supabase
    → mock-data (si falta env o falla lectura demo)
```

Errores se normalizan a mensajes controlados (`AppError` / UI ErrorState). No se muestran stack traces crudos al usuario.

## Supabase

- PostgreSQL con RLS en todas las tablas sensibles
- Auth email/password (web + mobile)
- Realtime en `chat_messages` por `stream_id`
- Triggers: `updated_at`, profile on signup, bloqueo de elevación de rol

## Auth

- Web/móvil: registro, login, logout, restauración de sesión
- Perfil creado por trigger en `auth.users`
- Studio protegido por middleware cuando hay sesión real
- TV: flujo `device_pairings` (waiting → paired / expired), sin teclado de email

## Realtime (chat)

- Un canal por stream (`stream:{id}`)
- Historial limitado + suscripción a inserts
- Validación de longitud (500) en Zod + DB check

## Preparación streaming / VOD / TV

- `VideoProvider` + `MockVideoProvider` en domain
- Interfaces: Broadcaster, Playback, Recording, Thumbnails, Webhooks, Processing
- Streams tienen `playback_id` / `provider` opcionales para Phase 1
- TV Focusable components y pairing model listos

## Decisiones y tradeoffs

1. **StyleSheet + tokens en RN** en lugar de NativeWind: menos fricción con Expo TV y Metro.
2. **Mock fallback en API**: permite UI completa sin Supabase local.
3. **Sin UI compartida web/RN**: evita acoplamiento y deuda de abstracciones frágiles.
4. **Sentry opcional**: no rompe builds sin DSN.
5. **Zustand mínimo**: solo feedback UI (toasts) en web.
