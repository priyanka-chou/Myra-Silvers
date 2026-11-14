import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SHOT_BASE || "http://localhost:4173";
const OUT = path.resolve("..", "screenshots");

async function scrollThrough(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const tick = () => {
        y += 520;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(tick, 110);
        else setTimeout(resolve, 900);
      };
      tick();
    });
  });
  await page.waitForTimeout(700);
}

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-webgl", "--ignore-gpu-blocklist"] });

/* ---------- desktop ---------- */
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const d = await desktop.newPage();
d.on("pageerror", (e) => console.error("PAGE ERROR:", e.message));

await d.goto(`${BASE}/`, { waitUntil: "networkidle" });
await d.waitForTimeout(4200);
await d.screenshot({ path: path.join(OUT, "desktop-hero.png") });

await scrollThrough(d);
await d.evaluate(() => window.scrollTo(0, 0));
await d.waitForTimeout(900);
await d.screenshot({ path: path.join(OUT, "desktop-full.png"), fullPage: true });

await d.goto(`${BASE}/piece/selene-band`, { waitUntil: "networkidle" });
await d.waitForTimeout(1400);
await d.screenshot({ path: path.join(OUT, "desktop-product.png") });

await d.click(".piece .add--wide");
await d.waitForTimeout(900);
await d.screenshot({ path: path.join(OUT, "desktop-cart.png") });

/* ---------- mobile ---------- */
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const m = await mobile.newPage();
m.on("pageerror", (e) => console.error("PAGE ERROR:", e.message));

await m.goto(`${BASE}/`, { waitUntil: "networkidle" });
await m.waitForTimeout(2200);
await m.screenshot({ path: path.join(OUT, "mobile-hero.png") });

await m.click(".nav__toggle");
await m.waitForTimeout(700);
await m.screenshot({ path: path.join(OUT, "mobile-menu.png") });
await m.click(".menu__link");

await scrollThrough(m);
await m.evaluate(() => window.scrollTo(0, 0));
await m.waitForTimeout(800);
await m.screenshot({ path: path.join(OUT, "mobile-full.png"), fullPage: true });

await m.goto(`${BASE}/piece/selene-band`, { waitUntil: "networkidle" });
await m.waitForTimeout(1200);
await m.screenshot({ path: path.join(OUT, "mobile-product.png") });

await m.click(".piece .add--wide");
await m.waitForTimeout(900);
await m.screenshot({ path: path.join(OUT, "mobile-cart.png") });

await browser.close();
console.log("Screenshots written to", OUT);
