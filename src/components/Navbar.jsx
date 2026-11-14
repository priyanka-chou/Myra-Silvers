import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";

const LINKS = [
  { to: "/#shop", label: "Collection" },
  { to: "/#story", label: "Story" },
  { to: "/#detail", label: "The piece" },
];

export default function Navbar() {
  const { count, openCart } = useCart();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setSolid(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e) => e.key === "Escape" && setMenu(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <>
      <nav className={`nav ${solid ? "nav--solid" : ""}`} aria-label="Main">
        <Link to="/" className="logo" data-cursor="">
          Myra <span>Silvers</span>
        </Link>

        <div className="nav__links">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="nav__link" data-cursor="">
              {l.label}
            </Link>
          ))}
          <button className="cartbtn" onClick={openCart} data-cursor="Open" aria-label={`Open cart, ${count} items`}>
            <span className="cartbtn__label">Cart</span>
            <span className="cartbtn__count" aria-hidden="true">
              {count}
            </span>
          </button>
        </div>

        <button
          className={`nav__toggle ${menu ? "is-open" : ""}`}
          onClick={() => setMenu((v) => !v)}
          aria-expanded={menu}
          aria-label={menu ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
        </button>
      </nav>

      <div className={`menu ${menu ? "is-open" : ""}`} inert={!menu}>
        <div className="menu__inner">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="menu__link" onClick={() => setMenu(false)}>
              {l.label}
            </Link>
          ))}
          <button
            className="menu__link menu__link--cart"
            onClick={() => {
              setMenu(false);
              openCart();
            }}
          >
            Cart ({count})
          </button>
          <div className="menu__foot">
            <span>925 sterling silver</span>
            <a href="https://instagram.com/myra.silvers" target="_blank" rel="noreferrer">
              @myra.silvers
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
