import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "docs", "screenshots");
mkdirSync(outDir, { recursive: true });

const edge =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const base = process.env.BASE_URL ?? "http://localhost:4748";

const shots = [
  ["landing", "/"],
  ["home", "/home"],
  ["channel", "/channel/nocturna"],
  ["program", "/channel/nocturna/program/la-noche-es-nuestra"],
  ["episode", "/watch/f6666666-6666-4666-8666-666666666601"],
  ["live", "/live/e5555555-5555-4555-8555-555555555501"],
  ["studio", "/studio"],
  ["go-live", "/studio/go-live"],
];

const browser = await puppeteer.launch({
  executablePath: edge,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();

for (const [name, path] of shots) {
  try {
    await page.goto(base + path, { waitUntil: "networkidle2", timeout: 90000 });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: join(outDir, `web-${name}.png`) });
    console.log("OK", name);
  } catch (e) {
    console.log("FAIL", name, e.message?.slice(0, 200) ?? e);
  }
}

await page.setViewport({ width: 390, height: 844 });
try {
  await page.goto(base + "/home", { waitUntil: "networkidle2", timeout: 90000 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: join(outDir, "web-home-mobile.png") });
  console.log("OK home-mobile");

  await page.goto(base + "/channel/nocturna/program/la-noche-es-nuestra", {
    waitUntil: "networkidle2",
    timeout: 90000,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: join(outDir, "web-program-mobile.png") });
  console.log("OK program-mobile");
} catch (e) {
  console.log("FAIL mobile", e.message?.slice(0, 200) ?? e);
}

await browser.close();
