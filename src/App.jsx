import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Collection from "./components/Collection";
import ProductDetail from "./components/ProductDetail";
import Footer from "./components/Footer";

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <>
      <Navbar cartCount={cartCount} />
      <Hero />
      <Story />
      <Collection />
      <ProductDetail onAdd={(q) => setCartCount((c) => c + q)} />
      <Footer />
    </>
  );
}