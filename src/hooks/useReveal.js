import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll choreography for whoever asks for it: add `data-reveal` to an
 * element and it rises into place once. `data-parallax="0.15"` drifts.
 * Everything is skipped for people who asked for less motion.
 */
export default function useReveal(deps = []) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        const delay = Number(el.dataset.revealDelay || 0);
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.95,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        const depth = Number(el.dataset.parallax) || 0.12;
        gsap.to(el, {
          yPercent: depth * 100,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
