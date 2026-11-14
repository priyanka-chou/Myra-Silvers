import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { formatPrice } from "../data/products";
import ProductArt from "./ProductArt";

const FREE_SHIPPING = 1999;

export default function CartDrawer() {
  const { isOpen, closeCart, lines, subtotal, setQty, remove, count } = useCart();
  const panel = useRef(null);
  const closeBtn = useRef(null);
  const [notice, setNotice] = useState(false);

  const close = () => {
    setNotice(false);
    closeCart();
  };

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        setNotice(false);
        closeCart();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const focusable = panel.current.querySelectorAll(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [isOpen, closeCart]);

  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING) * 100);

  return (
    <div className={`cart ${isOpen ? "is-open" : ""}`} inert={!isOpen}>
      <div className="cart__scrim" onClick={close} aria-hidden="true" />
      <aside className="cart__panel" role="dialog" aria-modal="true" aria-label="Your cart" ref={panel}>
        <header className="cart__head">
          <div>
            <p className="eyebrow">Your cart</p>
            <h2>
              {count} {count === 1 ? "piece" : "pieces"}
            </h2>
          </div>
          <button className="cart__close" onClick={close} ref={closeBtn} aria-label="Close cart">
            <span />
            <span />
          </button>
        </header>

        <div className="cart__ship">
          <div className="cart__bar">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p>
            {remaining > 0
              ? `${formatPrice(remaining)} away from free shipping`
              : "Free shipping unlocked ✦"}
          </p>
        </div>

        <div className="cart__body">
          {lines.length === 0 ? (
            <div className="cart__empty">
              <p>The drawer is empty.</p>
              <Link to="/#shop" onClick={close} className="btn">
                Enter the collection
              </Link>
            </div>
          ) : (
            <ul className="cart__list">
              {lines.map((line) => (
                <li className="cart__line" key={line.key}>
                  <Link to={`/piece/${line.slug}`} onClick={close} className="cart__thumb" aria-hidden="true" tabIndex={-1}>
                    <ProductArt piece={line.product} variant={1} />
                  </Link>
                  <div className="cart__linebody">
                    <div className="cart__linetop">
                      <Link to={`/piece/${line.slug}`} onClick={close} className="cart__name">
                        {line.product.name}
                      </Link>
                      <span className="cart__lineprice">{formatPrice(line.product.price * line.qty)}</span>
                    </div>
                    <p className="cart__meta">
                      {line.size === "One size" ? "One size" : `Size ${line.size}`} · 925 silver
                    </p>
                    <div className="cart__linefoot">
                      <div className="qty qty--sm">
                        <button aria-label={`Decrease ${line.product.name}`} onClick={() => setQty(line.key, line.qty - 1)}>
                          −
                        </button>
                        <span>{line.qty}</span>
                        <button aria-label={`Increase ${line.product.name}`} onClick={() => setQty(line.key, line.qty + 1)}>
                          +
                        </button>
                      </div>
                      <button className="cart__remove" onClick={() => remove(line.key)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="cart__foot">
          <div className="cart__total">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <p className="cart__note">Taxes included. Shipping calculated at checkout.</p>
          <button
            className="add add--wide"
            disabled={lines.length === 0}
            onClick={() => setNotice(true)}
          >
            {notice ? "Checkout opens soon" : "Checkout"}
          </button>
          <button className="cart__continue" onClick={close}>
            Continue browsing
          </button>
        </footer>
      </aside>
    </div>
  );
}
