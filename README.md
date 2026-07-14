# HYPE LIVE

Plataforma profesional de streaming en vivo para canales, programas y medios de entretenimiento.

**Phase 0 — Product Foundation** está lista: monorepo con web, móvil, TV, backend Supabase compartido, autenticación, datos demo, chat realtime (o mock), sistema de diseño y CI.

Identidad en UI: **HYPE LIVE** (`BRAND_NAME` en `@hypelive/domain`).

## Stack

- Monorepo: pnpm workspaces + Turborepo
- TypeScript estricto
- Web: Next.js (App Router) + Tailwind + Motion
- Mobile / TV: Expo + React Native (+ orientación tvOS)
- Backend: Supabase (PostgreSQL, Auth, Realtime)
- TanStack Query, Zod, Sentry opcional

## Estructura

```text
apps/web          — aplicación web
apps/mobile       — aplicación móvil
apps/tv           — aplicación TV
packages/*        — dominio, API, auth, tokens, validación, etc.
supabase/         — migraciones, seed, config local
docs/             — arquitectura, alcance, diseño, calidad
```

## Requisitos

- Node.js >= 20
- pnpm 9 (`corepack enable` o `npm i -g pnpm@9`)
- Docker (para Supabase local)
- Supabase CLI (opcional, recomendado)
- Expo Go o simuladores para mobile/TV

## Instalación

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
cp apps/tv/.env.example apps/tv/.env
```

Sin claves de Supabase, las apps usan **datos mock** y pueden navegarse en modo demo.

## Variables de entorno

Ver `.env.example` en la raíz y en cada app:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SENTRY_DSN=
EXPO_PUBLIC_SENTRY_DSN=
```

Nunca commits de secrets. La **service role key** no se usa en clientes.

## Desarrollo

```bash
pnpm dev:web       # http://localhost:4748
pnpm dev:mobile    # Expo Metro
pnpm dev:tv        # Expo TV
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Supabase local

```bash
# Instalar CLI: https://supabase.com/docs/guides/cli
supabase start
supabase db reset   # aplica migraciones + seed.sql
```

Detalles: `supabase/README.md`.

Usuarios demo del seed (si corriste seed): ver `supabase/seed.sql` (password documentada allí).

## Scripts raíz

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Dev paralelo (turbo) |
| `pnpm dev:web` | Solo web |
| `pnpm dev:mobile` | Solo mobile |
| `pnpm dev:tv` | Solo TV |
| `pnpm build` | Build de paquetes y web |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript |
| `pnpm format` | Prettier |
| `pnpm test` | Vitest / tests |

## Problemas conocidos

- Build nativo completo de iOS/Android/tvOS no corre en CI sin credenciales/macOS; CI hace lint, typecheck, tests y build web.
- TV requiere dispositivo/simulador Apple TV o Android TV para validar foco del remoto.
- Player y Go Live son **simulados** (Phase 0); no hay IVS/OBS/cámara real.
- Chat realtime requiere Supabase configurado; sin env usa mock local.
- Fuentes display usan stacks web con fallbacks; en nativo se usan system fonts + tokens.

## Documentación

- [Arquitectura](docs/architecture.md)
- [Alcance de producto](docs/product-scope.md)
- [Sistema de diseño](docs/design-system.md)
- [Estándares de calidad](docs/quality-standards.md)
- [Setup](docs/setup.md)
- [Plan de implementación](docs/implementation-plan.md)
