import { chromium } from "playwright";

const base = "http://localhost:4748";
const shots = [
  ["home", "/home"],
  ["live", "/live/e5555555-5555-4555-8555-555555555501"],
  ["channel", "/channel/nocturna-tv"],
  ["watch", "/watch/f6666666-6666-4666-8666-666666666601"],
  ["studio", "/studio"],
  ["go-live", "/studio/go-live"],
];

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const [name, path] of shots) {
  try {
    await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `docs/screenshots/web-${name}.png` });
    console.log("OK", name);
  } catch (e) {
    console.log("FAIL", name, String(e).slice(0, 200));
  }
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + "/home", { waitUntil: "domcontentloaded", timeout: 45000 });
await page.waitForTimeout(800);
await page.screenshot({ path: "docs/screenshots/web-home-mobile.png" });
console.log("OK home-mobile");
await browser.close();
