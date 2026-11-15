import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS, formatPrice } from "../data/products";
import ProductArt from "./ProductArt";

/**
 * The index, set like a printed plate list: numeral, name, category, price,
 * one hairline per row. No cards. Hovering lifts the actual plate out of the
 * page and holds it beside the pointer.
 */
export default function Plates() {
  const [hovered, setHovered] = useState(null);
  const preview = useRef(null);

  const onMove = (e) => {
    const el = preview.current;
    if (!el) return;
    const width = 320;
    const x = Math.min(e.clientX + 30, window.innerWidth - width - 24);
    const y = Math.min(Math.max(e.clientY - 190, 88), window.innerHeight - 380);
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  return (
    <section className="plates" id="shop" aria-labelledby="plates-title">
      <div className="plates__head">
        <p className="eyebrow" data-reveal>
          The plates
        </p>
        <h2 id="plates-title" data-reveal data-reveal-delay="0.04">
          Twenty pieces,
          <br />
          one night
        </h2>
        <p className="plates__lede" data-reveal data-reveal-delay="0.08">
          Every piece in the almanac, in the order it was made. Prices include tax; each is
          finished by hand before it leaves the bench.
        </p>
      </div>

      <ol className="plates__list" onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
        {PRODUCTS.map((piece, i) => (
          <li key={piece.slug} className="plates__item" data-reveal data-reveal-delay={(i % 6) * 0.02}>
            <Link
              to={`/piece/${piece.slug}`}
              className="plates__row"
              onPointerEnter={() => setHovered(piece)}
              onFocus={() => setHovered(piece)}
              onBlur={() => setHovered(null)}
              data-cursor="Open"
            >
              <span className="plates__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="plates__art" aria-hidden="true">
                <ProductArt piece={piece} variant={0} />
              </span>
              <span className="plates__name">{piece.name}</span>
              <span className="plates__cat">{piece.category}</span>
              <span className="plates__price">{formatPrice(piece.price)}</span>
              <span className="plates__arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="plates__preview" ref={preview} data-on={hovered ? "true" : "false"} aria-hidden="true">
        {hovered ? (
          <>
            <ProductArt piece={hovered} variant={2} />
            <span className="plates__preview-label">{hovered.name}</span>
          </>
        ) : null}
      </div>
    </section>
  );
}
