import { useRef, useState } from "react";
import Ring from "./Ring";

export default function Hero() {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0, px: 0, py: 0 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setPos({ x, y, px: x / r.width - 0.5, py: y / r.height - 0.5 });
  };

  const glowX = pos.x || window.innerWidth / 2;
  const glowY = pos.y || window.innerHeight * 0.4;

  return (
    <header className="hero" id="top" ref={ref} onPointerMove={onMove}>
      <div className="stars" />
      <div className="glow" style={{ transform: `translate(${glowX - 260}px, ${glowY - 260}px)` }} />
      <div className="heroin">
        <div
          className="ring"
          style={{ transform: `perspective(800px) rotateX(${pos.py * -20}deg) rotateY(${pos.px * 30}deg)` }}
        >
          <Ring />
        </div>
        <h1>Silver that catches the light</h1>
        <p>Handmade pieces, made to be worn close and kept for years. Move your cursor, and the light follows.</p>
        <a className="btn" href="#shop">Enter the collection</a>
        <div className="hint">Move to light the ring · on mobile, drag</div>
      </div>
    </header>
  );
}