import puppeteer from "puppeteer-core";

const edge =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const browser = await puppeteer.launch({
  executablePath: edge,
  headless: true,
  args: ["--no-sandbox"],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.goto("http://localhost:4748/home", {
  waitUntil: "networkidle2",
  timeout: 90000,
});
await new Promise((r) => setTimeout(r, 2500));

const check = await page.evaluate(() => {
  const cards = [...document.querySelectorAll("a.card-hover")].slice(0, 4);
  return cards.map((c) => {
    const thumb = c.querySelector("[style*='background-image'], .card-media");
    const style = thumb ? getComputedStyle(thumb).backgroundImage : "";
    return {
      title: c.querySelector("h3")?.textContent?.slice(0, 40),
      bg: style.slice(0, 140),
    };
  });
});
console.log(JSON.stringify(check, null, 2));
await page.screenshot({ path: "docs/screenshots/thumbs-home.png" });

const media = await page.goto("http://localhost:4748/media/live-1.jpg");
console.log("media status", media?.status());
await browser.close();
