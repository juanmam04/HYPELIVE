# Project One — Mobile (Expo)

App móvil de **HYPE LIVE** Phase 0 (`@hypelive/mobile`).

## Requisitos

- Node.js >= 20
- pnpm 9
- Expo Go (SDK 52) o emulador iOS/Android

## Cómo ejecutar

Desde la raíz del monorepo:

```bash
pnpm install
pnpm --filter @hypelive/mobile start
```

O desde esta carpeta:

```bash
pnpm start
pnpm android   # emulador/dispositivo Android
pnpm ios       # simulador/dispositivo iOS
```

## Variables de entorno

Copia `.env.example` a `.env`:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_SENTRY_DSN` (opcional; sin DSN Sentry es no-op)

Sin Supabase, la app usa datos mock de `@hypelive/api` y un modo demo de sesión.

## Scripts

| Script       | Descripción              |
|-------------|--------------------------|
| `start`     | Expo dev server          |
| `android`   | Abrir en Android         |
| `ios`       | Abrir en iOS             |
| `lint`      | ESLint                   |
| `typecheck` | TypeScript `--noEmit`    |

## Notas Phase 0

- Estilos con `@hypelive/design-tokens` + StyleSheet (sin NativeWind).
- Go Live simula cámara/mic/flash — **no pide permisos de cámara**.
- El broadcaster real se enchufa detrás de `src/broadcasting/MockBroadcaster.ts`.
