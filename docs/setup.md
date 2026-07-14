# Setup

## 1. Clonar e instalar

```bash
pnpm install
```

## 2. Variables

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
cp apps/tv/.env.example apps/tv/.env
```

Para modo demo sin backend, dejar vacías las claves de Supabase.

## 3. Supabase local (opcional)

Requiere Docker + [Supabase CLI](https://supabase.com/docs/guides/cli).

```bash
supabase start
supabase db reset
```

Copiar URL y anon key del output de `supabase status` a los `.env`.

Ver también `supabase/README.md`.

## 4. Correr apps

```bash
pnpm dev:web
pnpm dev:mobile
pnpm dev:tv
```

## 5. Calidad local

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Seguridad documentada (resumen)

- Lectura pública de perfiles, canales, programas, streams, videos
- Escritura de canal/programa/stream solo miembros autorizados
- Chat: insert autenticado; delete propio (o moderación futura)
- Follows y watch_progress privados del usuario
- Device pairings con expiración
- Trigger bloquea auto-elevación de `profiles.role`
- Service role nunca en apps cliente
