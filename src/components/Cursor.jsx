import { useEffect, useRef, useState } from "react";

/**
 * A small silver disc that reads as a lens. It follows the pointer with a
 * little lag, and asks whatever it is over: does this need a label?
 * Desktop and fine pointers only — never a gate on touch.
 */
export default function Cursor() {
  const disc = useRef(null);
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return fine && !calm;
  });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      if (disc.current) {
        disc.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onOver = (e) => {
      const target = e.target instanceof Element ? e.target.closest("[data-cursor]") : null;
      setActive(Boolean(target));
      setLabel(target ? target.dataset.cursor : "");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={disc} className={`cursor ${active ? "cursor--on" : ""}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}
