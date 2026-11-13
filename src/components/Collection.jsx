import { useState } from "react";
import { PRODUCTS, PHASE_SHIFT } from "../data/products";
import ProductCard from "./ProductCard";

export default function Collection() {
  const [cat, setCat] = useState("Rings");

  return (
    <section className="coll" id="shop">
      <h2>The collection</h2>
      <div className="phases" role="group" aria-label="Categories">
        {Object.keys(PRODUCTS).map((c) => (
          <button key={c} className="ph" aria-pressed={cat === c} onClick={() => setCat(c)}>
            <span className="moon" style={{ "--s": PHASE_SHIFT[c] }} />
            {c}
          </button>
        ))}
      </div>
      <div className="grid">
        {PRODUCTS[cat].map(([name, price]) => (
          <ProductCard key={cat + name} category={cat} name={name} price={price} />
        ))}
      </div>
    </section>
  );
}