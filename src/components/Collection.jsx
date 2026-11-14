import { useState } from "react";
import { CATEGORIES, PHASE_SHIFT, PRODUCTS } from "../data/products";
import ProductCard from "./ProductCard";
import Moon from "./Moon";

export default function Collection() {
  const [cat, setCat] = useState("Rings");
  const pieces = PRODUCTS.filter((p) => p.category === cat);

  return (
    <section className="coll" id="shop">
      <div className="section__head">
        <p className="eyebrow" data-reveal>
          Full moon
        </p>
        <h2 data-reveal data-reveal-delay="0.04">
          The collection
        </h2>
        <p className="section__lede" data-reveal data-reveal-delay="0.08">
          Turn the moon to change the drawer. Every category is a different phase of the same night.
        </p>
      </div>

      <div className="phases" role="group" aria-label="Jewellery categories" data-reveal>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className="ph"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            data-cursor="Turn"
          >
            <Moon shift={PHASE_SHIFT[c]} size={26} />
            <span>{c}</span>
            <span className="ph__count">
              {PRODUCTS.filter((p) => p.category === c).length}
            </span>
          </button>
        ))}
      </div>

      <div className="coll__status" aria-live="polite">
        {pieces.length} pieces · {cat}
      </div>

      <div className="grid" key={cat}>
        {pieces.map((piece, i) => (
          <ProductCard key={piece.slug} piece={piece} index={i} />
        ))}
      </div>

      <p className="coll__foot" data-reveal>
        Every piece is made to order in small batches. Allow 5–7 days before dispatch.
      </p>
    </section>
  );
}
