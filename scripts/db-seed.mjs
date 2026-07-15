import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const seedFile = resolve(root, "supabase/seed.sql");
const remote = process.argv.includes("--remote");

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
    ...process.env,
  };
}

if (!existsSync(seedFile)) {
  console.error(`No se encontró ${seedFile}`);
  process.exit(1);
}

if (!remote) {
  console.log("→ Reset local: migraciones + seed.sql");
  const result = spawnSync("supabase", ["db", "reset"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  process.exit(result.status ?? 1);
}

const env = loadEnv();
const databaseUrl = env.DATABASE_URL?.trim();

if (!databaseUrl) {
  console.error(`
Seed remoto requiere DATABASE_URL en la raíz (.env).

1. Supabase Dashboard → Project Settings → Database
2. Connection string → URI (modo Session o Direct)
3. Pegala en .env como:
   DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-....supabase.com:5432/postgres

Alternativa sin psql: abrí SQL Editor en el Dashboard y ejecutá el archivo:
  supabase/seed.sql

Usuarios demo (password: hypelive-demo-2026) quedan documentados en supabase/README.md
`);
  process.exit(1);
}

console.log("→ Aplicando seed.sql al proyecto remoto vía psql…");
const result = spawnSync(
  "psql",
  [databaseUrl, "-v", "ON_ERROR_STOP=1", "-f", seedFile],
  { cwd: root, stdio: "inherit", shell: true },
);

if ((result.status ?? 1) !== 0) {
  console.error(`
Falló psql. Instalá PostgreSQL client tools o corré el seed a mano en SQL Editor:
  supabase/seed.sql
`);
  process.exit(result.status ?? 1);
}

console.log("✓ Seed remoto aplicado");
