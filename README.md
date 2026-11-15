# Myra Silvers — Nightfall to Dawn

An interactive storefront for a small, hand-finished 925 silver jewellery house.
The site is built as **one night**: you scroll from midnight, through the full
moon, out into dawn. The collection is presented as an **orrery** — a brass
machine of orbits and beads — so browsing means turning a night sky rather than
clicking a filter.

> Silver that catches the light.

---

## Running it

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the built bundle
```

Node 20+ recommended.

## Checks

```bash
npm run lint                  # eslint, clean
npx playwright install chromium
npm run build && npm run preview   # serve dist on :4173
node scripts/qa.mjs           # 30 layout + behaviour assertions
npm run shots                 # desktop/mobile screenshots → ../screenshots
```

`scripts/qa.mjs` drives a real browser and asserts the things that are easy to
break: no horizontal overflow at 390px or 1440px, WebGL mounted on desktop and
skipped on mobile, five orbits carrying all twenty beads inside the plate,
drag-to-turn rotating the machine by more than ten degrees, the orbit selector
driving both the piece strip and the caption, the floating plate preview landing
on-screen, every plate row drawing real artwork, cart persisting through a
reload, and a clean console. It exits non-zero on failure.

Screenshots (desktop and mobile, 2× DPR) are written to `/screenshots`:

| File | Shows |
| --- | --- |
| `desktop-hero.png` | First impression: the orrery with its 3D ring core |
| `desktop-plates.png` | The plates index with the floating preview lifted |
| `desktop-full.png` | Whole page, night through dawn |
| `desktop-product.png` | Product page |
| `desktop-cart.png` | Cart drawer |
| `mobile-hero.png` | 390px orrery, stacked |
| `mobile-plates.png` | Mobile plates index |
| `mobile-menu.png` | Mobile navigation |
| `mobile-full.png` | Whole page on mobile |
| `mobile-product.png` | Mobile product page |
| `mobile-cart.png` | Mobile cart |

---

## The concept

Most jewellery sites are a grid and a product page. This one is an **almanac
machine**: five orbits, one per category, each carrying that category's four
pieces as beads around a silver ring.

| Section | Phase | What happens |
| --- | --- | --- |
| Orrery (hero) | New moon | Five orbits of beads turn around a live 3D ring; drag or scroll to rotate |
| Marquee | — | 925 · hand-finished · small batch · made in India |
| Story | First quarter | Editorial copy, engraved moon etching, house numbers |
| The Plates | Full moon | A twenty-row typographic index; hovering a row lifts its render beside the pointer |
| Featured piece | Waning | The first piece ever made, with four studio angles |
| Product page | Waning | Drag-to-turn gallery, sizes, quantity, cart, care and shipping |
| Footer | Dawn | The palette turns to pearl; one letter per new moon |

Three details carry the idea:

1. **The collection is a mechanism, not a grid.** Orbits rotate at geared speeds —
   each 16% faster than the one inside it, alternating direction
   (`1 : −1.16 : 1.32 : −1.48 : 1.64`) — so the beads never repeat an arrangement.
   Dragging adds angular velocity that decays with inertia; scrolling nudges the
   whole assembly. Clicking an orbit turns the machine to it and swaps the caption.
2. **The index is typographic.** The Plates is not a card grid — it is twenty
   numbered rows of name, orbit numeral and price. The only image is a preview
   that follows the pointer, so the page stays quiet and fast.
3. **The palette is the narrative.** Ink → slate → dawn runs top to bottom, so the
   page changes temperature as you read it.

---

## Interaction notes

- **Cursor** — a small silver disc that grows into a label (`View`, `Drag`,
  `Turn`) over things that do something. Desktop and fine pointers only.
- **Magnetic buttons** — CTA buttons lean a few pixels toward the pointer. Never
  more than that.
- **Orrery drag** — pointer-capture rotation with inertia, clamped to a sane speed.
  Works on touch; the machine keeps turning slowly on its own so it never reads
  as a static image.
- **Orbit selector** — five `aria-pressed` buttons; the active one is the caption's
  subject and highlights its four beads.
- **Plate preview** — a pointer-following panel that stays inside the viewport and
  is switched off entirely on touch, where it would only cover the list.
- **Drag to turn** — the product gallery changes angle on a horizontal drag, with
  a pointer-capture implementation that also works on touch.
- **Scroll choreography** — GSAP ScrollTrigger reveals and a parallax etching,
  all one-shot so nothing fights the reader.
- **Scroll moon** — a hairline rail at the bottom of the viewport shows how far
  through the night you are.

Everything above is progressive: with `prefers-reduced-motion` the site renders
statically, the cursor is left alone, the orrery stops turning on its own, and the
3D ring is replaced by a drawn one.

---

## Technical implementation

**Stack:** React 19 · Vite 8 · React Router 7 · Three.js / React Three Fiber ·
GSAP ScrollTrigger · hand-written CSS.

**Why hand-written CSS.** The layout is editorial, the type scale is deliberate,
and the styling is mostly bespoke composition. Tailwind utilities would flatten
that, so the design system lives in CSS custom properties at the top of
`src/App.css` and each section owns its rules.

**The orrery is SVG, the core is WebGL.** Orbits and beads are SVG so they scale
crisply, stay accessible (each bead is a real `<button>`), and can be animated on
one `requestAnimationFrame` loop that writes a single `transform` per orbit. The
centre ring is the only 3D object.

**The 3D ring is an upgrade, not a requirement.** `Ring3D` is a lazy chunk that
only mounts when the viewport is at least 900px, the visitor hasn't asked for
reduced motion, and `navigator.connection.saveData` is false. Until then — and on
touch — the orrery shows an SVG ring. Three.js and R3F are the only heavy
dependencies and they never block first paint.

**No HDR download.** The environment map is painted into a `<canvas>` at runtime
and uploaded as an equirectangular texture, so the metal has believable
reflections without a network request or `drei`. Removing drei cut roughly 90 kB
gzipped from the 3D chunk.

**Art direction instead of stock photography.** Every one of the twenty pieces is
drawn by a parametric SVG renderer (`ProductArt.jsx`): one silver treatment, one
light direction, four angles per piece, different silhouettes. That keeps the
catalogue visually consistent, ~0 bytes of imagery, and infinitely re-lightable.

**Cart.** React context + `localStorage`. Lines are keyed by `slug::size`, quantity
is capped at 9, the drawer traps focus, restores it on close, and locks body
scroll.

**Accessibility.** Semantic landmarks, `aria-pressed` orbits and sizes, `aria-live`
for quantity and result counts, visible focus rings, focus trap in the drawer,
`inert` on closed overlays, and `aria-label`s on every icon-only button.

---

## Structure

```
src/
  App.jsx              routes, scroll manager, page composition
  App.css              design tokens + all sections, in scroll order
  main.jsx             BrowserRouter entry
  data/products.js     the catalogue: 20 pieces, orbits, helpers
  lib/cart.jsx         cart context + localStorage
  hooks/useReveal.js   GSAP reveal + parallax (reduced-motion aware)
  components/
    Orrery.jsx         the hero machine: orbits, beads, drag/scroll, strip, caption
    Ring3D.jsx         R3F ring + painted studio environment (lazy)
    Ring.jsx           SVG fallback ring
    Navbar.jsx         desktop nav, mobile menu, cart trigger
    Marquee.jsx        house ticker
    Story.jsx          brand narrative + etching
    Plates.jsx         twenty-row collection index + pointer preview
    ProductArt.jsx     parametric studio renders for every piece
    Featured.jsx       the first piece
    ProductPage.jsx    gallery, sizes, cart, accordions, related
    CartDrawer.jsx     drawer with free-shipping progress
    Footer.jsx         dawn palette, newsletter
    Cursor.jsx         labelled cursor disc
    ScrollMoon.jsx     scroll progress
    Magnetic.jsx       pointer-leaning button
    Moon.jsx           moon-phase disc
```

---

## Deployment

The app is a single-page React app with client-side routes, so the host must
rewrite unknown paths to `index.html`. `vercel.json` does that and is included:

```bash
npm i -g vercel
cd frontend && vercel --prod
```

Any static host works (Netlify, Cloudflare Pages) as long as the rewrite rule is
replicated.

---

## Notes and non-goals

- Checkout is intentionally a placeholder — there is no payment provider wired up
  or implied.
- The catalogue is local data. Swapping `data/products.js` for an API is the
  obvious next step.
- Prices are in INR and included tax is assumed, not calculated.

## Credits

Design and build: first-day assignment for Myra Silvers.
Type: Cormorant Garamond and DM Sans (Google Fonts). Everything else — artwork,
moon phases, environment, iconography — is generated in the codebase.
