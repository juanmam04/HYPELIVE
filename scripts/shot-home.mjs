import puppeteer from "puppeteer-core";

const edge = process.env.EDGE_PATH;
const browser = await puppeteer.launch({
  executablePath: edge,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1920,1080"],
  defaultViewport: { width: 1920, height: 1080 },
});
const page = await browser.newPage();
await page.goto("http://localhost:4748/home", { waitUntil: "networkidle2", timeout: 90000 });
await new Promise((r) => setTimeout(r, 2500));

const html = await page.content();
const checks = {
  hasProjectOne: /Project One/i.test(html),
  hasHypeLive: /HYPE LIVE/i.test(html),
  hasModoDemo: /Modo demo/i.test(html),
  hasSesionDemo: /Sesi[oó]n demo/i.test(html),
  hasEnVivoAhora: /En vivo ahora/i.test(html),
  hasVerEnVivo: /Ver en vivo/i.test(html),
  hasLiveBadge: /EN VIVO/i.test(html),
};

// Clip first viewport only
await page.screenshot({
  path: "../docs/screenshots/home-1920x1080-viewport.png",
  clip: { x: 0, y: 0, width: 1920, height: 1080 },
});

// Measure if live row is in viewport
const metrics = await page.evaluate(() => {
  const hero = document.querySelector("h1");
  const liveSection = Array.from(document.querySelectorAll("h2")).find((h) =>
    h.textContent?.includes("En vivo ahora"),
  );
  const liveRect = liveSection?.getBoundingClientRect();
  const cta = Array.from(document.querySelectorAll("a,button")).find((el) =>
    el.textContent?.includes("Ver en vivo"),
  );
  const ctaRect = cta?.getBoundingClientRect();
  return {
    heroText: hero?.textContent?.slice(0, 80) ?? null,
    liveTop: liveRect?.top ?? null,
    liveInView: liveRect ? liveRect.top < 1080 && liveRect.bottom > 0 : false,
    ctaTop: ctaRect?.top ?? null,
    ctaInView: ctaRect ? ctaRect.top < 1080 && ctaRect.bottom > 0 : false,
    logoText: document.querySelector("header a")?.textContent?.trim() ?? null,
  };
});

console.log(JSON.stringify({ checks, metrics }, null, 2));
await browser.close();
