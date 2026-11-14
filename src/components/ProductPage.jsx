import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { bySlug, related, formatPrice, PHASE_SHIFT } from "../data/products";
import ProductArt from "./ProductArt";
import ProductCard from "./ProductCard";
import Moon from "./Moon";
import Magnetic from "./Magnetic";
import useReveal from "../hooks/useReveal";
import { useCart } from "../lib/cart";

const RING_SIZES = ["6", "7", "8", "9", "10", "11", "12"];

function Gallery({ piece }) {
  const [variant, setVariant] = useState(0);
  const dragFrom = useRef(null);
  const [turning, setTurning] = useState(false);

  const step = (dir) => setVariant((v) => (v + dir + 4) % 4);

  const onDown = (e) => {
    dragFrom.current = e.clientX;
    setTurning(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onMove = (e) => {
    if (dragFrom.current == null) return;
    const dx = e.clientX - dragFrom.current;
    if (Math.abs(dx) > 46) {
      step(dx > 0 ? 1 : -1);
      dragFrom.current = e.clientX;
    }
  };

  const onUp = () => {
    dragFrom.current = null;
    setTurning(false);
  };

  return (
    <div className="gallery">
      <div
        className={`gallery__stage ${turning ? "is-turning" : ""}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={onUp}
        data-cursor="Drag"
        role="group"
        aria-label="Product images, drag to turn"
      >
        <span className="gallery__angle" aria-hidden="true">
          0{variant + 1} / 04
        </span>
        <div className="gallery__art" key={variant}>
          <ProductArt piece={piece} variant={variant} />
        </div>
        <span className="gallery__hint" aria-hidden="true">
          drag to turn
        </span>
      </div>

      <div className="thumbs" role="group" aria-label="Product angles">
        {[0, 1, 2, 3].map((v) => (
          <button
            key={v}
            className="thumb"
            aria-pressed={variant === v}
            aria-label={`Angle ${v + 1}`}
            onClick={() => setVariant(v)}
          >
            <ProductArt piece={piece} variant={v} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  // Remounting on slug change keeps quantity and size honest without effects.
  return <Piece key={slug} slug={slug} />;
}

function Piece({ slug }) {
  const piece = useMemo(() => bySlug(slug), [slug]);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(() => (bySlug(slug)?.category === "Rings" ? "8" : "One size"));
  const [added, setAdded] = useState(false);

  useReveal([slug]);

  if (!piece) {
    return (
      <section className="missing">
        <p className="eyebrow">Lost in the dark</p>
        <h1>We can't find that piece.</h1>
        <p>It may have been retired from the almanac.</p>
        <Link to="/#shop" className="btn">
          Back to the collection
        </Link>
      </section>
    );
  }

  const sizes = piece.category === "Rings" ? RING_SIZES : ["One size"];
  const others = related(piece, 3);

  const addToCart = () => {
    add(piece, qty, size);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <article className="piece">
      <nav className="piece__crumb" aria-label="Breadcrumb">
        <Link to="/" data-cursor="">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/#shop" data-cursor="">
          Collection
        </Link>
        <span aria-hidden="true">/</span>
        <span>{piece.name}</span>
      </nav>

      <div className="piece__top">
        <Gallery piece={piece} />

        <div className="piece__info">
          <div className="piece__eyebrow">
            <Moon shift={PHASE_SHIFT[piece.category]} size={20} />
            <span>{piece.category}</span>
          </div>

          <h1>{piece.name}</h1>
          <p className="piece__tagline">{piece.tagline}</p>
          <p className="piece__price">{formatPrice(piece.price)}</p>
          <p className="piece__desc">{piece.description}</p>

          <fieldset className="sizes">
            <legend>{piece.category === "Rings" ? "Ring size" : "Size"}</legend>
            <div className="sizes__row">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="size"
                  aria-pressed={size === s}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            {piece.category === "Rings" ? (
              <p className="sizes__hint">Between sizes? Take the smaller one and we'll resize it free.</p>
            ) : null}
          </fieldset>

          <div className="buy">
            <div className="qty">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span aria-live="polite">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9, q + 1))}>
                +
              </button>
            </div>

            <Magnetic className="add add--wide" onClick={addToCart} data-cursor="Add">
              {added ? "Added — opening cart" : `Add to cart · ${formatPrice(piece.price * qty)}`}
            </Magnetic>
          </div>

          <p className="buy__note">
            Free shipping over ₹1,999 · 14-day returns · dispatched in 5–7 days
          </p>

          <div className="acc">
            <details open>
              <summary>Description</summary>
              <p>{piece.description}</p>
              <p className="acc__quote">“{piece.story}”</p>
            </details>
            <details>
              <summary>Materials &amp; finish</summary>
              <dl>
                <div>
                  <dt>Material</dt>
                  <dd>{piece.details.material}</dd>
                </div>
                <div>
                  <dt>Finish</dt>
                  <dd>{piece.details.finish}</dd>
                </div>
                <div>
                  <dt>Sizing</dt>
                  <dd>{piece.details.sizes}</dd>
                </div>
              </dl>
            </details>
            <details>
              <summary>Care</summary>
              <p>{piece.details.care}</p>
            </details>
            <details>
              <summary>Shipping &amp; returns</summary>
              <p>
                Made to order in 5–7 working days. Free shipping within India over ₹1,999. Returns
                accepted within 14 days on unworn pieces.
              </p>
            </details>
          </div>
        </div>
      </div>

      <section className="also">
        <div className="section__head">
          <p className="eyebrow">Also in this phase</p>
          <h2>Worn together</h2>
        </div>
        <div className="grid">
          {others.map((p, i) => (
            <ProductCard key={p.slug} piece={p} index={i} />
          ))}
        </div>
      </section>
    </article>
  );
}
