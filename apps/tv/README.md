# Project One — TV (Expo)

App TV de **HYPE LIVE** Phase 0 (`@hypelive/tv`), orientada a Apple TV / Android TV.

## Requisitos

- Node.js >= 20
- pnpm 9
- Para validación real de TV: simulador **Apple TV** o dispositivo/emulador **Android TV**
- En desarrollo se puede abrir en Expo Go / emulador phone (focus de mando es limitado)

## Cómo ejecutar

Desde la raíz del monorepo:

```bash
pnpm install
pnpm --filter @hypelive/tv start
```

O desde esta carpeta:

```bash
pnpm start
pnpm android
pnpm ios
```

## Variables de entorno

Copia `.env.example` a `.env` (opcionales en Phase 0):

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_SENTRY_DSN`

Sin Supabase se usan mocks de `@hypelive/api`. El emparejamiento de dispositivo es simulado.

## Auth

No hay login email/password. Solo flujo de **pairing** (`/pair`) con código corto y QR simulado.

## Scripts

| Script       | Descripción              |
|-------------|--------------------------|
| `start`     | Expo dev server          |
| `android`   | Abrir en Android         |
| `ios`       | Abrir en iOS             |
| `lint`      | ESLint                   |
| `typecheck` | TypeScript `--noEmit`    |

## Limitaciones conocidas

- Build nativo tvOS completo requiere target `react-native-tvos` / Xcode Apple TV.
- Android TV leanback se valida en emulador TV o hardware.
- El chat en TV es solo lectura; comentar desde el teléfono.
- En phone/Expo Go el anillo de foco TV es aproximado.
