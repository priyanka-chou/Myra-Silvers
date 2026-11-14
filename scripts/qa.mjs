import { chromium } from "playwright";

const BASE = process.env.SHOT_BASE || "http://localhost:4173";
const CATS = ["Rings", "Earrings", "Necklaces", "Bracelets", "Anklets"];
let failures = 0;

const check = async (label, fn) => {
  try {
    await fn();
    console.log("  ok   " + label);
  } catch (e) {
    failures++;
    console.log("  FAIL " + label + " → " + e.message);
  }
};

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

const browser = await chromium.launch();

/* ---------------- desktop ---------------- */
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(4500);

console.log("\nDesktop 1440×900");
await check("no horizontal overflow", async () => {
  const { sw, iw } = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    iw: window.innerWidth,
  }));
  assert(sw <= iw + 1, `scrollWidth ${sw} > ${iw}`);
});

await check("hero ring mounted (canvas + WebGL)", async () => {
  const info = await page.evaluate(() => {
    const c = document.querySelector(".hero canvas");
    if (!c) return null;
    return { w: c.width, h: c.height, gl: !!c.getContext("webgl2") || !!c.getContext("webgl") };
  });
  assert(info, "no canvas in hero");
  assert(info.w > 100 && info.gl, "canvas has no webgl context");
});

await check("hero type is display scale", async () => {
  const size = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector(".hero h1")).fontSize));
  assert(size >= 60, `h1 is only ${size}px`);
});

await check("revealed hero copy is actually visible", async () => {
  const opacities = await page.evaluate(() =>
    [".hero .eyebrow", ".hero h1", ".hero__lede", ".hero__actions .btn"].map((s) => {
      const el = document.querySelector(s);
      return el ? Number.parseFloat(getComputedStyle(el).opacity) : -1;
    }),
  );
  opacities.forEach((o, i) => assert(o > 0.9, `hero element ${i} has opacity ${o}`));
});

await check("no text overlaps the nav", async () => {
  const bad = await page.evaluate(() => {
    const nav = document.querySelector(".nav").getBoundingClientRect();
    const h1 = document.querySelector(".hero h1").getBoundingClientRect();
    return h1.top < nav.bottom - 4;
  });
  assert(!bad, "hero headline runs under the fixed nav");
});

/* every category renders real artwork inside the card */
for (const cat of CATS) {
  await check(`category ${cat}: cards + artwork geometry`, async () => {
    await page.click(`.ph:has-text("${cat}")`);
    await page.waitForTimeout(450);
    const data = await page.evaluate(() => {
      const cards = [...document.querySelectorAll(".coll .card")];
      return cards.map((card) => {
        const media = card.querySelector(".card__media").getBoundingClientRect();
        const svg = card.querySelector(".card__art");
        const art = svg.getBoundingClientRect();
        let drawn = 0;
        for (const el of svg.querySelectorAll("path,ellipse,circle,polygon,rect")) {
          try {
            const b = el.getBBox();
            if (b.width > 0.5 && b.height > 0.5 && Number.isFinite(b.x)) drawn++;
          } catch {
            /* ignore */
          }
        }
        return {
          name: card.querySelector("h3").textContent,
          mediaW: media.width,
          artW: art.width,
          drawn,
          overflow: media.left < -1 || media.right > window.innerWidth + 1,
        };
      });
    });
    assert(data.length === 4, `expected 4 cards, got ${data.length}`);
    for (const c of data) {
      assert(c.mediaW > 180, `${c.name}: card only ${c.mediaW}px`);
      assert(c.artW > 60, `${c.name}: artwork only ${c.artW}px`);
      assert(c.drawn >= 2, `${c.name}: only ${c.drawn} drawable shapes`);
      assert(!c.overflow, `${c.name}: card overflows viewport`);
    }
  });
}

await check("scrolled-in sections reveal", async () => {
  await page.evaluate(() => document.querySelector("#story").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(1000);
  const ops = await page.evaluate(() =>
    ["#story h2", "#story .story__numbers", ".detail h2"].map((s) => {
      const el = document.querySelector(s);
      return el ? Number.parseFloat(getComputedStyle(el).opacity) : -1;
    }),
  );
  ops.forEach((o, i) => assert(o > 0.9, `section element ${i} has opacity ${o}`));
});

/* product page */
await page.goto(BASE + "/piece/selene-band", { waitUntil: "networkidle" });await page.waitForTimeout(900);

console.log("\nProduct page");
await check("gallery artwork renders", async () => {
  const w = await page.evaluate(() => {
    const svg = document.querySelector(".gallery__art svg");
    return svg ? svg.getBoundingClientRect().width : 0;
  });
  assert(w > 200, `gallery art is ${w}px`);
});

await check("four angles and thumbnail switching", async () => {
  const n = await page.locator(".gallery .thumb").count();
  assert(n === 4, `expected 4 thumbs, got ${n}`);
  await page.locator(".gallery .thumb").nth(2).click();
  const label = await page.locator(".gallery__angle").textContent();
  assert(label.trim().startsWith("03"), `angle label is "${label}"`);
});

await check("drag to turn changes angle", async () => {
  const box = await page.locator(".gallery__stage").boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2, { steps: 6 });
  await page.mouse.up();
  const label = await page.locator(".gallery__angle").textContent();
  assert(label.trim().startsWith("04"), `angle did not advance, got "${label}"`);
});

await check("size selector is a radio-style set", async () => {
  const n = await page.locator(".sizes .size").count();
  assert(n === 7, `expected 7 ring sizes, got ${n}`);
  await page.locator(".sizes .size").nth(4).click();
  const pressed = await page.locator('.sizes .size[aria-pressed="true"]').textContent();
  assert(pressed.trim() === "10", `pressed size is ${pressed}`);
});

await check("quantity stepper caps and floors", async () => {
  const dec = page.locator(".buy .qty button").first();
  await dec.click();
  const q = await page.locator(".buy .qty span").textContent();
  assert(q.trim() === "1", `qty went below one: ${q}`);
});

await check("add to cart opens drawer with correct line", async () => {
  await page.click(".piece .add--wide");
  await page.waitForTimeout(700);
  const open = await page.evaluate(() => document.querySelector(".cart").classList.contains("is-open"));
  assert(open, "drawer did not open");
  const name = await page.locator(".cart__name").first().textContent();
  assert(name.includes("Selene Band"), `cart line is "${name}"`);
  const size = await page.locator(".cart__meta").first().textContent();
  assert(size.includes("Size 10"), `cart size is "${size}"`);
  const total = await page.locator(".cart__total strong").textContent();
  assert(total.includes("2,499"), `subtotal is ${total}`);
});

await check("cart survives a reload", async () => {
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const count = await page.locator(".cartbtn__count").textContent();
  assert(count.trim() === "1", `badge shows ${count}`);
});

/* console hygiene */
await check("no console or page errors", async () => {
  assert(errors.length === 0, errors.join(" | "));
});

/* ---------------- mobile ---------------- */
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
const m = await mctx.newPage();
const mErrors = [];
m.on("pageerror", (e) => mErrors.push(e.message));

await m.goto(BASE + "/", { waitUntil: "networkidle" });
await m.waitForTimeout(1800);

console.log("\nMobile 390×844");
await check("no horizontal overflow", async () => {
  const { sw, iw } = await m.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  assert(sw <= iw + 1, `scrollWidth ${sw} > ${iw}`);
});

await check("mobile shows svg ring, not canvas", async () => {
  const has = await m.evaluate(() => ({
    canvas: !!document.querySelector(".hero canvas"),
    svg: !!document.querySelector(".hero .ring-svg"),
  }));
  assert(has.svg && !has.canvas, "hero did not fall back to the SVG ring");
});

await check("desktop links hidden, toggle visible", async () => {
  const r = await m.evaluate(() => ({
    links: getComputedStyle(document.querySelector(".nav__links")).display,
    toggle: getComputedStyle(document.querySelector(".nav__toggle")).display,
  }));
  assert(r.links === "none", "desktop links still visible");
  assert(r.toggle !== "none", "menu toggle hidden");
});

await check("menu opens and closes", async () => {
  await m.click(".nav__toggle");
  await m.waitForTimeout(500);
  assert(await m.evaluate(() => document.querySelector(".menu").classList.contains("is-open")), "menu did not open");
  await m.click(".menu__link");
  await m.waitForTimeout(600);
  assert(!(await m.evaluate(() => document.querySelector(".menu").classList.contains("is-open"))), "menu stayed open");
});

await check("grid is two columns at 390px", async () => {
  const cols = await m.evaluate(() => getComputedStyle(document.querySelector(".grid")).gridTemplateColumns.split(" ").length);
  assert(cols === 2, `grid has ${cols} columns`);
});

await check("product buy button is reachable (no overflow)", async () => {
  await m.goto(BASE + "/piece/selene-band", { waitUntil: "networkidle" });
  await m.waitForTimeout(700);
  const box = await m.locator(".piece .add--wide").boundingBox();
  assert(box && box.width > 200 && box.x >= 0 && box.x + box.width <= 390.5, "add button sits outside the viewport");
});

await check("mobile cart works", async () => {
  await m.click(".piece .add--wide");
  await m.waitForTimeout(700);
  const open = await m.evaluate(() => document.querySelector(".cart").classList.contains("is-open"));
  assert(open, "drawer did not open on mobile");
});

await check("no mobile page errors", async () => {
  assert(mErrors.length === 0, mErrors.join(" | "));
});

await browser.close();
console.log(`\n${failures === 0 ? "All checks passed." : failures + " check(s) failed."}`);
process.exit(failures ? 1 : 0);
