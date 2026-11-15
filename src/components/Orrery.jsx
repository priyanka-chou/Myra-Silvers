import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CATEGORIES,
  PRODUCTS,
  byCategory,
  bySlug,
  formatPrice,
} from "../data/products";
import ProductArt from "./ProductArt";
import Ring from "./Ring";
import { prefersReducedMotion } from "../hooks/useReveal";

const Ring3D = lazy(() => import("./Ring3D"));

const CENTER = 500;
const RADII = [196, 268, 340, 412, 484];
const NUMERALS = ["I", "II", "III", "IV", "V"];

/**
 * The almanac, as a machine.
 *
 * Five orbits, one per category, each carrying its four pieces as beads.
 * Drag to turn the system — every orbit runs at its own speed, so the
 * machine reads as geared rather than as a carousel. Scroll turns it too.
 * The ring at the centre is the only lit object in the room.
 */
export default function Orrery() {
  const section = useRef(null);
  const stage = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const orbits = useRef([]);
  const angle = useRef(0);
  const velocity = useRef(0);
  const scrollAngle = useRef(0);
  const dragging = useRef(false);
  const moved = useRef(false);
  const lastX = useRef(0);

  const [focus, setFocus] = useState(0);
  const [selected, setSelected] = useState(PRODUCTS[0].slug);
  const [hovered, setHovered] = useState(null);
  const [mode, setMode] = useState("svg");

  const pieces = useMemo(() => byCategory(CATEGORIES[focus]), [focus]);
  const active = bySlug(hovered) || bySlug(selected) || pieces[0];
  const activeNumeral = NUMERALS[Math.max(0, CATEGORIES.indexOf(active.category))];

  /* the centrepiece: 3D only where it can afford to be */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const fine = window.matchMedia("(min-width: 900px)").matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (!fine || saveData) return;
    const id = window.setTimeout(() => setMode("3d"), 450);
    return () => window.clearTimeout(id);
  }, []);

  /* geared rotation + scroll contribution */
  useEffect(() => {
    const calm = prefersReducedMotion();
    let raf = 0;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(2, (now - last) / 16.67);
      last = now;

      if (!dragging.current) {
        angle.current += velocity.current * dt;
        velocity.current *= Math.pow(0.94, dt);
        if (Math.abs(velocity.current) < 0.002) velocity.current = 0;
        if (!calm) angle.current += 0.035 * dt;
      }

      orbits.current.forEach((group, k) => {
        if (!group) return;
        const direction = k % 2 === 0 ? 1 : -1;
        const geared = 1 + k * 0.16;
        const a = (angle.current + scrollAngle.current) * geared * direction;
        group.setAttribute("transform", `rotate(${a.toFixed(3)} ${CENTER} ${CENTER})`);
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* scrolling turns the machine */
  useEffect(() => {
    const onScroll = () => {
      const el = section.current;
      if (!el || window.innerWidth < 900 || prefersReducedMotion()) {
        scrollAngle.current = 0;
        return;
      }
      const rect = el.getBoundingClientRect();
      const travel = el.offsetHeight + window.innerHeight;
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel));
      scrollAngle.current = (progress - 0.5) * 150;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    moved.current = false;
    lastX.current = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const el = stage.current;
    if (el) {
      const r = el.getBoundingClientRect();
      pointer.current = {
        x: ((e.clientX - r.left) / r.width - 0.5) * 2,
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      };
    }
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    if (Math.abs(dx) > 2) moved.current = true;
    lastX.current = e.clientX;
    angle.current += dx * 0.32;
    velocity.current = dx * 0.22;
  };

  const endDrag = () => {
    dragging.current = false;
  };

  const chooseCategory = (index) => {
    setFocus(index);
    setSelected(byCategory(CATEGORIES[index])[0].slug);
    setHovered(null);
  };

  const chooseBead = (piece, index) => {
    if (moved.current) return;
    setFocus(index);
    setSelected(piece.slug);
    setHovered(null);
  };

  return (
    <section className="orrery" id="top" ref={section} aria-labelledby="orrery-title">
      <div className="orrery__grid">
        <div className="orrery__intro">
          <p className="eyebrow" data-reveal>
            The almanac · 925 silver
          </p>
          <h1 id="orrery-title" data-reveal data-reveal-delay="0.04">
            Silver that <em>catches</em> the light
          </h1>
          <p className="orrery__lede" data-reveal data-reveal-delay="0.08">
            Five orbits, twenty pieces, one night. Turn the machine to change the drawer.
          </p>
        </div>

        <div className="orrery__side">
          <ol className="orbits" data-reveal>
            {CATEGORIES.map((category, i) => (
              <li key={category}>
                <button
                  className="orbits__btn"
                  aria-pressed={focus === i}
                  onClick={() => chooseCategory(i)}
                  data-cursor="Turn"
                >
                  <span className="orbits__num">{NUMERALS[i]}</span>
                  <span className="orbits__name">{category}</span>
                  <span className="orbits__count">{byCategory(category).length}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="orrery__caption" aria-live="polite">
            <div className="orrery__thumb">
              <ProductArt piece={active} variant={1} />
            </div>
            <div className="orrery__copy">
              <p className="plate-line">
                Plate {activeNumeral} · {active.category}
              </p>
              <h2>{active.name}</h2>
              <p className="orrery__tagline">{active.tagline}</p>
              <p className="orrery__price">{formatPrice(active.price)}</p>
              <Link to={`/piece/${active.slug}`} className="link-rule" data-cursor="Open">
                Open the plate
              </Link>
            </div>
          </div>
        </div>

        <div className="orrery__stagewrap">
          <div
            className="orrery__stage"
            ref={stage}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            data-cursor="Drag"
          >
            <svg
              className="orrery__svg"
              viewBox="0 0 1000 1000"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <radialGradient id="orreryCore" cx="38%" cy="32%" r="70%">
                  <stop offset="0" stopColor="#20263a" />
                  <stop offset="1" stopColor="#07080e" />
                </radialGradient>
                <linearGradient id="orreryBead" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="0.5" stopColor="#c9ced6" />
                  <stop offset="1" stopColor="#7d838f" />
                </linearGradient>
              </defs>

              {/* the plate, ruled */}
              <circle cx={CENTER} cy={CENTER} r={RADII[RADII.length - 1] + 42} fill="none" stroke="#e9edf5" strokeOpacity="0.07" />
              {Array.from({ length: 120 }).map((_, i) => {
                const a = (i / 120) * Math.PI * 2;
                const long = i % 10 === 0;
                const r1 = RADII[RADII.length - 1] + 30;
                const r2 = r1 + (long ? 12 : 5);
                return (
                  <line
                    key={i}
                    x1={CENTER + Math.cos(a) * r1}
                    y1={CENTER + Math.sin(a) * r1}
                    x2={CENTER + Math.cos(a) * r2}
                    y2={CENTER + Math.sin(a) * r2}
                    stroke="#e9edf5"
                    strokeOpacity={long ? 0.22 : 0.1}
                    strokeWidth="1"
                  />
                );
              })}

              {/* fixed orbits */}
              {RADII.map((r, k) => (
                <circle
                  key={r}
                  cx={CENTER}
                  cy={CENTER}
                  r={r}
                  fill="none"
                  stroke={focus === k ? "#e9edf5" : "#c9ced6"}
                  strokeOpacity={focus === k ? 0.34 : 0.11}
                  strokeWidth="1"
                  strokeDasharray={focus === k ? "none" : "1 7"}
                  className="orrery__ring"
                />
              ))}

              {/* the empty core the ring sits in */}
              <circle cx={CENTER} cy={CENTER} r="118" fill="url(#orreryCore)" stroke="#e9edf5" strokeOpacity="0.09" />

              {/* beads travel; rings do not */}
              {CATEGORIES.map((category, k) => {
                const r = RADII[k];
                return (
                  <g key={category} ref={(el) => (orbits.current[k] = el)} className="orrery__orbit">
                    {byCategory(category).map((piece, i) => {
                      const base = (i * 360) / 4 + k * 21;
                      const rad = (base * Math.PI) / 180;
                      const x = CENTER + Math.cos(rad) * r;
                      const y = CENTER + Math.sin(rad) * r;
                      const isActive = selected === piece.slug && focus === k;
                      return (
                        <g
                          key={piece.slug}
                          className={`bead ${isActive ? "is-on" : ""} ${focus === k ? "is-lit" : ""}`}
                          transform={`translate(${x} ${y})`}
                          onPointerEnter={() => setHovered(piece.slug)}
                          onPointerLeave={() => setHovered(null)}
                          onClick={() => chooseBead(piece, k)}
                        >
                          <circle className="bead__hit" r="26" />
                          <circle className="bead__dot" r={isActive ? 9 : 6.5} fill="url(#orreryBead)" />
                          {isActive ? <circle className="bead__halo" r="18" fill="none" stroke="#e9edf5" strokeOpacity="0.5" strokeWidth="1" /> : null}
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>

            <div className="orrery__core" aria-hidden="true">
              {mode === "3d" ? (
                <Suspense fallback={<Ring className="orrery__ring-svg" />}>
                  <Ring3D pointer={pointer} />
                </Suspense>
              ) : (
                <Ring className="orrery__ring-svg" />
              )}
            </div>

            <span className="orrery__drag" aria-hidden="true">
              drag to turn
            </span>
          </div>

          <div className="orrery__strip" role="group" aria-label={`Pieces in ${CATEGORIES[focus]}`}>
            {pieces.map((piece, i) => (
              <button
                key={piece.slug}
                className={`plate-tab ${selected === piece.slug ? "is-on" : ""}`}
                aria-pressed={selected === piece.slug}
                onClick={() => setSelected(piece.slug)}
                onPointerEnter={() => setHovered(piece.slug)}
                onPointerLeave={() => setHovered(null)}
              >
                <span className="plate-tab__num">
                  {NUMERALS[focus]}.{i + 1}
                </span>
                <span className="plate-tab__name">{piece.name}</span>
                <span className="plate-tab__price">{formatPrice(piece.price)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
