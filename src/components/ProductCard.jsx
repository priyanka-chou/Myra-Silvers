import { useRef } from "react";
import { Link } from "react-router-dom";
import ProductArt from "./ProductArt";
import { formatPrice } from "../data/products";

export default function ProductCard({ piece, index = 0 }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--mx", `${(nx + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(ny + 0.5) * 100}%`);
    el.style.setProperty("--rx", `${(-ny * 6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(nx * 8).toFixed(2)}deg`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <Link
      ref={ref}
      to={`/piece/${piece.slug}`}
      className="card"
      data-cursor="View"
      style={{ "--i": index }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="card__media">
        <span className="card__phase">{piece.category}</span>
        <ProductArt piece={piece} variant={0} className="card__art" />
        <span className="card__quick">Quick view</span>
      </div>
      <div className="card__body">
        <h3>{piece.name}</h3>
        <div className="card__meta">
          <span>{piece.tagline}</span>
          <span className="price">{formatPrice(piece.price)}</span>
        </div>
      </div>
    </Link>
  );
}
