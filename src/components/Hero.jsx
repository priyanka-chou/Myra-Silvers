import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Ring from "./Ring";
import Magnetic from "./Magnetic";
import { prefersReducedMotion } from "../hooks/useReveal";

const Ring3D = lazy(() => import("./Ring3D"));

export default function Hero() {
  const hero = useRef(null);
  const glow = useRef(null);
  const wrap = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [mode, setMode] = useState("svg");

  // The 3D ring is an upgrade, not a requirement: skip it on small screens,
  // for reduced-motion visitors, and until the hero has already painted.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const fine = window.matchMedia("(min-width: 900px)").matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (!fine || saveData) return;

    let idle = 0;
    const id = window.setTimeout(() => {
      idle = window.requestIdleCallback ? window.requestIdleCallback(() => setMode("3d")) : window.setTimeout(() => setMode("3d"), 1);
    }, 350);

    return () => {
      window.clearTimeout(id);
      if (idle && window.cancelIdleCallback) window.cancelIdleCallback(idle);
    };
  }, []);

  useEffect(() => {
    if (mode !== "svg") return;
    // keep the SVG ring's light alive on touch: tilt with the device
    const onOrient = (e) => {
      if (!wrap.current || !e.gamma) return;
      const g = Math.max(-30, Math.min(30, e.gamma));
      wrap.current.style.transform = `perspective(900px) rotateY(${g * 0.5}deg) rotateX(${-g * 0.18}deg)`;
    };
    window.addEventListener("deviceorientation", onOrient);
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, [mode]);

  const onMove = (e) => {
    const r = hero.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const nx = x / r.width - 0.5;
    const ny = y / r.height - 0.5;

    pointer.current = { x: nx * 2, y: ny * 2 };

    if (glow.current) {
      glow.current.style.transform = `translate3d(${x - 260}px, ${y - 260}px, 0)`;
    }
    if (wrap.current && mode !== "3d") {
      wrap.current.style.transform = `perspective(900px) rotateX(${ny * -16}deg) rotateY(${nx * 22}deg)`;
    }
  };

  return (
    <header className="hero" id="top" ref={hero} onPointerMove={onMove}>
      <div className="stars" aria-hidden="true" />
      <div className="hero__veil" aria-hidden="true" />
      <div className="glow" ref={glow} aria-hidden="true" />

      <div className="heroin">
        <div className="hero__stage">
          <div className="ring-wrap" ref={wrap}>
            {mode === "3d" ? (
              <Suspense fallback={<Ring className="ring-svg" />}>
                <Ring3D pointer={pointer} />
              </Suspense>
            ) : (
              <Ring className="ring-svg" />
            )}
          </div>
        </div>

        <p className="eyebrow" data-reveal>
          Myra Silvers · 925 silver, finished by hand
        </p>

        <h1 data-reveal data-reveal-delay="0.05">
          Silver that <em>catches</em> the light
        </h1>

        <p className="hero__lede" data-reveal data-reveal-delay="0.1">
          A small almanac of rings, chains and quiet things — made in fewer pieces, to be worn close
          and kept for years.
        </p>

        <div className="hero__actions" data-reveal data-reveal-delay="0.15">
          <Magnetic as="a" href="#shop" className="btn" data-cursor="Enter">
            Enter the collection
          </Magnetic>
          <a className="btn btn--ghost" href="#story" data-cursor="">
            Our story
          </a>
        </div>

        <p className="hint" data-reveal data-reveal-delay="0.2">
          Move to light the silver · on mobile, drag or tilt
        </p>
      </div>

      <div className="hero__foot" aria-hidden="true">
        <span className="hero__rule" />
        <span>New moon · the collection begins</span>
      </div>
    </header>
  );
}
