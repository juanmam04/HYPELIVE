# Setup

## 1. Clonar e instalar

```bash
pnpm install
```

## 2. Variables de entorno

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
cp apps/tv/.env.example apps/tv/.env
```

Sin claves de Supabase, las apps corren en **modo demo** (mocks).

---

## 3. Conectar Supabase (cloud) — checklist

### A. Proyecto

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. Instalá [Supabase CLI](https://supabase.com/docs/guides/cli).
3. Desde la raíz del repo:

```bash
pnpm db:link          # te pide project ref + DB password
pnpm db:push          # aplica migraciones (schema + RLS + realtime)
```

### B. Auth en el Dashboard

**Authentication → Providers → Email**
- Enable Email provider
- **Confirm email: OFF** (para desarrollo; si lo dejás ON, el signup no entra hasta confirmar)

**Authentication → URL Configuration**
- Site URL: `http://localhost:4748`
- Redirect URLs: `http://localhost:4748/**`

### C. Keys en las apps

Dashboard → **Settings → API**:

| Variable | Dónde |
|----------|--------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_URL` |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` |

Pegá las mismas URL + anon en:
- `apps/web/.env.local`
- `apps/mobile/.env`
- `apps/tv/.env` (opcional)

**Nunca** pongas la `service_role` en las apps cliente.

### D. Seed (datos demo)

Opción 1 — SQL Editor (más simple):
1. Dashboard → SQL Editor
2. Pegá el contenido de `supabase/seed.sql` → Run

Opción 2 — CLI (requiere `psql` + connection string):

```bash
# En .env de la raíz (gitignored):
# DATABASE_URL=postgresql://postgres.[ref]:[PASSWORD]@...supabase.com:5432/postgres

pnpm db:seed:remote
```

Usuarios demo (password `hypelive-demo-2026`):
- `sofia.rios@hypelive.demo` — platform_admin
- `mateo.vega@hypelive.demo` — channel_admin
- `lucia.mora@hypelive.demo` — producer
- `diego.salas@hypelive.demo` — creator
- `camila.ortega@hypelive.demo` / `andres.pinto@hypelive.demo` — viewers

### E. Verificar

```bash
pnpm supabase:check
pnpm dev:web
```

Deberías ver canales reales (Nocturna, Casa Sonora, etc.) y poder iniciar sesión con un usuario del seed o registrarte (el trigger crea `profiles`).

Reiniciá el servidor Next/Expo después de cambiar `.env`.

---

## 4. Supabase local (alternativa a cloud)

Requiere Docker + Supabase CLI.

```bash
pnpm db:start
pnpm db:reset          # migraciones + seed
pnpm db:status         # copia URL + anon key a los .env
```

Ver también `supabase/README.md`.

---

## 5. Correr apps

```bash
pnpm dev:web      # http://localhost:4748
pnpm dev:mobile
pnpm dev:tv
```

## 6. Calidad local

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Scripts de base de datos

| Script | Qué hace |
|--------|----------|
| `pnpm db:start` | Levanta Supabase local |
| `pnpm db:stop` | Detiene local |
| `pnpm db:status` | Muestra URL/keys locales |
| `pnpm db:reset` | Reset local + seed |
| `pnpm db:link` | Vincula proyecto cloud |
| `pnpm db:push` | Empuja migraciones al remoto |
| `pnpm db:seed` | Reset+seed local |
| `pnpm db:seed:remote` | Seed en cloud (`DATABASE_URL`) |
| `pnpm supabase:check` | Valida env + ping a la API |

## Seguridad (resumen)

- Lectura pública de perfiles, canales, programas, streams, episodios
- Escritura de canal/programa/stream solo miembros autorizados
- Chat: insert autenticado; delete propio
- Follows y watch_progress privados del usuario
- Trigger crea `profiles` al registrarse; bloquea auto-elevación de `role`
- Service role **nunca** en apps cliente
