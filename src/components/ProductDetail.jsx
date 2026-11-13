import { useState } from "react";
 
export default function ProductDetail({ onAdd }) {
  const [qty, setQty] = useState(1);
 
  return (
    <section className="detail" id="detail">
      <div>
        <div className="stage">
          <svg viewBox="0 0 200 200">
            <ellipse cx="100" cy="115" rx="58" ry="60" fill="none" stroke="#6c7280" strokeWidth="12" />
            <ellipse cx="100" cy="115" rx="58" ry="60" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="2" transform="translate(-3,-3)" />
          </svg>
        </div>
        <div className="thumbs"><span /><span /><span /><span /></div>
      </div>
      <div>
        <h2>Selene Band</h2>
        <p>A short story, materials, size guidance, a gallery that swipes on mobile, and a 3D or zoom view will live here.</p>
        <div className="row">
          <strong style={{ fontSize: 22 }}>₹2,499</strong>
          <div className="qty">
            <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
          <button className="add" onClick={() => onAdd(qty)}>Add to cart</button>
        </div>
        <p style={{ fontSize: 13 }}>925 sterling silver · Sizes 6 to 12 · Free shipping over ₹1,999</p>
      </div>
    </section>
  );
}
 