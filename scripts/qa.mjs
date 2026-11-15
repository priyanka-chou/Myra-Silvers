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

const orbitAngle = (page) =>
  page.evaluate(() => {
    const g = document.querySelector(".orrery__orbit");
    const m = /rotate\(([-\d.]+)/.exec(g.getAttribute("transform") || "");
    return m ? Number(m[1]) : NaN;
  });

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

await check("orrery core is a live WebGL ring", async () => {
  const info = await page.evaluate(() => {
    const c = document.querySelector(".orrery canvas");
    if (!c) return null;
    return { w: c.width, h: c.height, gl: !!c.getContext("webgl2") || !!c.getContext("webgl") };
  });
  assert(info, "no canvas in the orrery");
  assert(info.w > 100 && info.gl, "canvas has no webgl context");
});

await check("hero type is display scale", async () => {
  const size = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector(".orrery h1")).fontSize));
  assert(size >= 36, `h1 is only ${size}px`);
});

await check("hero copy is actually visible", async () => {
  const opacities = await page.evaluate(() =>
    [".orrery .eyebrow", ".orrery h1", ".orrery__lede", ".orbits__btn"].map((s) => {
      const el = document.querySelector(s);
      return el ? Number.parseFloat(getComputedStyle(el).opacity) : -1;
    }),
  );
  opacities.forEach((o, i) => assert(o > 0.9, `hero element ${i} has opacity ${o}`));
});

await check("no text overlaps the nav", async () => {
  const bad = await page.evaluate(() => {
    const nav = document.querySelector(".nav").getBoundingClientRect();
    const h1 = document.querySelector(".orrery h1").getBoundingClientRect();
    return h1.top < nav.bottom - 4;
  });
  assert(!bad, "orrery headline runs under the fixed nav");
});

await check("five orbits carry twenty beads, all on the plate", async () => {
  const data = await page.evaluate(() => {
    const stage = document.querySelector(".orrery__stage").getBoundingClientRect();
    const dots = [...document.querySelectorAll(".bead__dot")].map((d) => {
      const b = d.getBoundingClientRect();
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height / 2;
      return {
        inside: cx >= stage.left - 2 && cx <= stage.right + 2 && cy >= stage.top - 2 && cy <= stage.bottom + 2,
        r: b.width / 2,
      };
    });
    return { orbits: document.querySelectorAll(".orrery__orbit").length, dots };
  });
  assert(data.orbits === 5, `expected 5 orbit groups, got ${data.orbits}`);
  assert(data.dots.length === 20, `expected 20 beads, got ${data.dots.length}`);
  const outside = data.dots.filter((d) => !d.inside).length;
  assert(outside === 0, `${outside} beads fall outside the plate`);
  const tooSmall = data.dots.filter((d) => d.r < 3).length;
  assert(tooSmall === 0, `${tooSmall} beads are too small to see`);
});

await check("the machine turns when dragged", async () => {
  const before = await orbitAngle(page);
  const box = await page.locator(".orrery__stage").boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 150, cy, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(120);
  const after = await orbitAngle(page);
  const delta = Math.abs(after - before);
  assert(Number.isFinite(delta) && delta > 10, `orbit only moved ${delta.toFixed(1)}°`);
});

await check("orbit selector turns the drawer and the caption", async () => {
  await page.click('.orbits__btn:has-text("Earrings")');
  await page.waitForTimeout(300);
  const state = await page.evaluate(() => ({
    pressed: document.querySelector('.orbits__btn[aria-pressed="true"] .orbits__name').textContent.trim(),
    strip: [...document.querySelectorAll(".plate-tab__name")].map((n) => n.textContent.trim()),
    caption: document.querySelector(".orrery__copy h2").textContent.trim(),
    plate: document.querySelector(".plate-line").textContent.trim(),
    lit: document.querySelectorAll(".bead.is-lit").length,
  }));
  assert(state.pressed === "Earrings", `pressed orbit is ${state.pressed}`);
  assert(state.strip.length === 4, `strip shows ${state.strip.length} pieces`);
  assert(state.strip.includes("Crescent Drops"), `strip is ${state.strip.join(", ")}`);
  assert(state.caption === "Crescent Drops", `caption is ${state.caption}`);
  assert(state.plate.includes("II"), `plate line is ${state.plate}`);
  assert(state.lit === 4, `expected 4 lit beads on the earring orbit, got ${state.lit}`);
});

await check("strip selects a piece without leaving the page", async () => {
  await page.click('.plate-tab:has-text("Pearl Hoops")');
  await page.waitForTimeout(250);
  const caption = await page.locator(".orrery__copy h2").textContent();
  const price = await page.locator(".orrery__price").textContent();
  assert(caption.trim() === "Pearl Hoops", `caption is ${caption}`);
  assert(price.includes("2,299"), `price is ${price}`);
  const href = await page.locator(".orrery__copy .link-rule").getAttribute("href");
  assert(href === "/piece/pearl-hoops", `open link points to ${href}`);
});

await check("the plates index lists all twenty pieces", async () => {
  const rows = await page.evaluate(() =>
    [...document.querySelectorAll(".plates__row")].map((r) => ({
      name: r.querySelector(".plates__name").textContent.trim(),
      price: r.querySelector(".plates__price").textContent.trim(),
      art: r.querySelector(".plates__art svg") ? 1 : 0,
    })),
  );
  assert(rows.length === 20, `expected 20 plates, got ${rows.length}`);
  assert(rows.every((r) => r.name.length > 0), "a plate has no name");
  assert(rows.every((r) => /₹/.test(r.price)), "a plate has no price");
  assert(rows.every((r) => r.art === 1), "a plate has no artwork");
});

await check("hovering a plate lifts a preview beside the pointer", async () => {
  await page.locator(".plates__row").nth(6).scrollIntoViewIfNeeded();
  await page.locator(".plates__row").nth(6).hover();
  await page.waitForTimeout(450);
  const preview = await page.evaluate(() => {
    const el = document.querySelector(".plates__preview");
    const art = el.querySelector(".art");
    const box = el.getBoundingClientRect();
    return {
      on: el.dataset.on,
      art: art ? art.getBoundingClientRect().width : 0,
      x: box.x,
      y: box.y,
      visible: getComputedStyle(el).visibility,
    };
  });
  assert(preview.on === "true", "preview did not switch on");
  assert(preview.art > 100, `preview artwork is ${preview.art}px`);
  assert(preview.visible === "visible", "preview is not visible");
  assert(preview.x >= 0 && preview.x < 1440, `preview is off-screen at x=${preview.x}`);
  assert(preview.y >= 0 && preview.y < 900, `preview is off-screen at y=${preview.y}`);
});

await check("a plate opens its product page", async () => {
  await page.locator(".plates__row").nth(0).click();
  await page.waitForTimeout(600);
  assert(/\/piece\/selene-band$/.test(page.url()), `landed on ${page.url()}`);
});

await check("scrolled-in sections reveal", async () => {
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.querySelector("#story").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(1000);
  const storyOps = await page.evaluate(() =>
    ["#story h2", "#story .story__numbers"].map((s) => {
      const el = document.querySelector(s);
      return el ? Number.parseFloat(getComputedStyle(el).opacity) : -1;
    }),
  );
  storyOps.forEach((o, i) => assert(o > 0.9, `story element ${i} has opacity ${o}`));

  await page.evaluate(() => document.querySelector(".plates__head").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(1000);
  const plateOps = await page.evaluate(() =>
    [".plates__head h2", ".plates__head .plates__lede", ".plates__item"].map((s) => {
      const el = document.querySelector(s);
      return el ? Number.parseFloat(getComputedStyle(el).opacity) : -1;
    }),
  );
  plateOps.forEach((o, i) => assert(o > 0.9, `plates element ${i} has opacity ${o}`));
});

/* product page */
await page.goto(BASE + "/piece/selene-band", { waitUntil: "networkidle" });
await page.waitForTimeout(900);

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

await check("mobile shows the svg ring, not canvas", async () => {
  const has = await m.evaluate(() => ({
    canvas: !!document.querySelector(".orrery canvas"),
    svg: !!document.querySelector(".orrery__ring-svg"),
  }));
  assert(has.svg && !has.canvas, "orrery did not fall back to the SVG ring");
});

await check("orrery is stacked and the stage fits", async () => {
  const r = await m.evaluate(() => {
    const stage = document.querySelector(".orrery__stage").getBoundingClientRect();
    const intro = document.querySelector(".orrery__intro").getBoundingClientRect();
    return { w: stage.width, left: stage.left, right: stage.right, introBottom: intro.bottom, stageTop: stage.top };
  });
  assert(r.w > 280 && r.w <= 390, `stage is ${r.w}px wide`);
  assert(r.left >= 0 && r.right <= 390.5, "stage overflows the viewport");
  assert(r.stageTop >= r.introBottom - 2, "stage overlaps the intro copy");
});

await check("beads stay large enough to tap", async () => {
  const r = await m.evaluate(() =>
    [...document.querySelectorAll(".bead__dot")].map((d) => parseFloat(getComputedStyle(d).r || "0")),
  );
  const small = r.filter((v) => !(v >= 8)).length;
  assert(r.length === 20, `expected 20 beads, got ${r.length}`);
  assert(small === 0, `${small} beads are smaller than 8px`);
});

await check("piece strip is a two-by-two block", async () => {
  const cols = await m.evaluate(
    () => getComputedStyle(document.querySelector(".orrery__strip")).gridTemplateColumns.split(" ").length,
  );
  assert(cols === 2, `strip has ${cols} columns`);
});

await check("plates index is a compact three-column list", async () => {
  const r = await m.evaluate(() => {
    const row = document.querySelector(".plates__row");
    return {
      cols: getComputedStyle(row).gridTemplateColumns.split(" ").length,
      art: getComputedStyle(row.querySelector(".plates__art")).display,
      preview: getComputedStyle(document.querySelector(".plates__preview")).display,
      rows: document.querySelectorAll(".plates__row").length,
    };
  });
  assert(r.rows === 20, `expected 20 plates, got ${r.rows}`);
  assert(r.cols === 3, `row has ${r.cols} columns`);
  assert(r.art === "none", "row artwork is still shown on mobile");
  assert(r.preview === "none", "floating preview is still active on mobile");
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
