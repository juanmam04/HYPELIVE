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

const browser = await puppeteer.launch({
  executablePath: edge,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();

async function shot(name, path, fn) {
  try {
    await page.goto(base + path, { waitUntil: "networkidle2", timeout: 90000 });
    await new Promise((r) => setTimeout(r, 1200));
    if (fn) await fn();
    await page.screenshot({ path: join(outDir, `polish-${name}.png`) });
    console.log("OK", name);
  } catch (e) {
    console.log("FAIL", name, e.message?.slice(0, 200));
  }
}

await shot("home", "/home");
await shot("home-hover-card", "/home", async () => {
  const card = await page.$('a.card-hover');
  if (card) {
    await card.hover();
    await new Promise((r) => setTimeout(r, 400));
  }
});
await shot("live-player-chat", "/live/e5555555-5555-4555-8555-555555555501");
await shot("channel", "/channel/nocturna");
await shot("studio-golive-modal-ready", "/studio/go-live");

await page.setViewport({ width: 390, height: 844 });
await shot("home-mobile", "/home");

await browser.close();
