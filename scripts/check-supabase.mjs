import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    let value = trimmed.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function loadEnv() {
  return {
    ...loadEnvFile(resolve(root, ".env")),
    ...loadEnvFile(resolve(root, ".env.local")),
    ...loadEnvFile(resolve(root, "apps/web/.env.local")),
    ...loadEnvFile(resolve(root, "apps/mobile/.env")),
    ...loadEnvFile(resolve(root, "apps/tv/.env")),
    ...process.env,
  };
}

function isRealKey(key) {
  return Boolean(key && key !== "public-anon-key-for-ci" && key.length >= 20);
}

const env = loadEnv();

const webUrl = env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const webKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
const expoUrl =
  env.EXPO_PUBLIC_SUPABASE_URL?.trim() || webUrl;
const expoKey =
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || webKey;

const webOk = Boolean(webUrl && isRealKey(webKey));
const expoOk = Boolean(expoUrl && isRealKey(expoKey));

console.log("HYPE — chequeo Supabase\n");
console.log(`  Web URL:   ${webUrl || "(vacío)"}`);
console.log(`  Web anon:  ${webOk ? "ok" : "faltante / stub"}`);
console.log(`  Expo URL:  ${expoUrl || "(vacío)"}`);
console.log(`  Expo anon: ${expoOk ? "ok" : "faltante / stub"}`);
console.log(
  `  DATABASE_URL (seed remoto): ${env.DATABASE_URL ? "ok" : "opcional"}`,
);

if (!webOk && !expoOk) {
  console.log(`
Modo demo activo (mocks).

Para conectar:
  1. cp apps/web/.env.example apps/web/.env.local
  2. Pegá Project URL + anon key (Dashboard → Settings → API)
  3. pnpm db:link && pnpm db:push
  4. pnpm db:seed --remote   (o SQL Editor con seed.sql)
  5. pnpm supabase:check
  6. Reiniciá pnpm dev:web
`);
  process.exit(1);
}

const url = webUrl || expoUrl;
const key = webKey || expoKey;

try {
  const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/channels?select=id&limit=1`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  if (!res.ok) {
    console.error(`\n✗ API respondió ${res.status}. ¿Aplicaste migraciones (pnpm db:push)?`);
    const body = await res.text();
    if (body) console.error(body.slice(0, 400));
    process.exit(1);
  }

  const rows = await res.json();
  console.log(`\n✓ Conectado. channels visibles: ${Array.isArray(rows) ? rows.length : "?"}`);
  if (Array.isArray(rows) && rows.length === 0) {
    console.log(
      "  (tabla vacía — corré pnpm db:seed --remote o el seed en SQL Editor)",
    );
  }
  process.exit(0);
} catch (error) {
  console.error("\n✗ No se pudo contactar Supabase:", error.message);
  process.exit(1);
}
