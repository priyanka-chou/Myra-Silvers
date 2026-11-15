import { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { CartProvider } from "./lib/cart";
import useReveal from "./hooks/useReveal";
import Cursor from "./components/Cursor";
import ScrollMoon from "./components/ScrollMoon";
import Navbar from "./components/Navbar";
import Orrery from "./components/Orrery";
import Marquee from "./components/Marquee";
import Story from "./components/Story";
import Plates from "./components/Plates";
import Featured from "./components/Featured";
import ProductPage from "./components/ProductPage";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import "./App.css";

/** Keeps anchor links working and stops new pages opening halfway down. */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        const id = requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
        return () => cancelAnimationFrame(id);
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function Home() {
  useReveal([]);
  return (
    <>
      <Orrery />
      <Marquee />
      <Story />
      <Plates />
      <Featured />
    </>
  );
}

function NotFound() {
  return (
    <section className="missing">
      <p className="eyebrow">New moon</p>
      <h1>Nothing here but dark.</h1>
      <p>The page you were looking for has set.</p>
      <Link to="/" className="btn">
        Back to the beginning
      </Link>
    </section>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Cursor />
      <ScrollMoon />
      <Navbar />
      <ScrollManager />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/piece/:slug" element={<ProductPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
