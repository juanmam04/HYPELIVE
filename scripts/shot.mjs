import puppeteer from "puppeteer-core";

const edge = process.env.EDGE_PATH;
const base = "http://localhost:4748";
const shots = [
  ["home", "/home"],
  ["live", "/live/e5555555-5555-4555-8555-555555555501"],
  ["channel", "/channel/nocturna-tv"],
  ["watch", "/watch/f6666666-6666-4666-8666-666666666601"],
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
    await page.goto(base + path, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: `../docs/screenshots/web-${name}.png` });
    console.log("OK", name);
  } catch (e) {
    console.log("FAIL", name, e.message);
  }
}
await page.setViewport({ width: 390, height: 844 });
await page.goto(base + "/home", { waitUntil: "networkidle2", timeout: 60000 });
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: "../docs/screenshots/web-home-mobile.png" });
console.log("OK home-mobile");
await browser.close();
