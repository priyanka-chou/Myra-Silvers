import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { bySlug } from "../data/products";

const STORAGE_KEY = "myra-cart-v1";
const CartContext = createContext(null);

const read = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((l) => l && bySlug(l.slug)) : [];
  } catch {
    return [];
  }
};

const keyOf = (slug, size) => `${slug}::${size}`;

export function CartProvider({ children }) {
  const [lines, setLines] = useState(read);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable — the cart still works for this visit */
    }
  }, [lines]);

  const add = useCallback((product, qty = 1, size = "One size") => {
    const key = keyOf(product.slug, size);
    setLines((prev) => {
      const found = prev.find((l) => keyOf(l.slug, l.size) === key);
      if (found) return prev.map((l) => (keyOf(l.slug, l.size) === key ? { ...l, qty: Math.min(9, l.qty + qty) } : l));
      return [...prev, { slug: product.slug, size, qty: Math.min(9, qty) }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((key, qty) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => keyOf(l.slug, l.size) !== key)
        : prev.map((l) => (keyOf(l.slug, l.size) === key ? { ...l, qty: Math.min(9, qty) } : l)),
    );
  }, []);

  const remove = useCallback((key) => {
    setLines((prev) => prev.filter((l) => keyOf(l.slug, l.size) !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const detailed = useMemo(
    () =>
      lines
        .map((l) => ({ ...l, key: keyOf(l.slug, l.size), product: bySlug(l.slug) }))
        .filter((l) => l.product),
    [lines],
  );

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const subtotal = useMemo(() => detailed.reduce((n, l) => n + l.product.price * l.qty, 0), [detailed]);

  const value = useMemo(
    () => ({
      lines: detailed,
      count,
      subtotal,
      add,
      setQty,
      remove,
      clear,
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
    }),
    [detailed, count, subtotal, add, setQty, remove, clear, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export const lineKey = keyOf;
