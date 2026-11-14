import { useEffect, useRef } from "react";

/** How far through the night you are. */
export default function ScrollMoon() {
  const rail = useRef(null);
  const dot = useRef(null);

  useEffect(() => {
    let frame = 0;
    let progress = 0;

    const paint = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (dot.current) dot.current.style.transform = `translateX(${progress * 100}%) translate(-50%, -50%)`;
      if (rail.current) {
        rail.current.style.setProperty("--p", `${progress * 100}%`);
        rail.current.dataset.visible = progress > 0.01 ? "true" : "false";
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={rail} className="scrollmoon" data-visible="false" aria-hidden="true">
      <span className="scrollmoon__rail" />
      <span ref={dot} className="scrollmoon__dot" />
    </div>
  );
}
