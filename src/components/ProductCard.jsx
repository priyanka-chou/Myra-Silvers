const SHAPES = {
  Rings: <ellipse cx="50" cy="55" rx="28" ry="30" fill="none" stroke="#c9ced6" strokeWidth="7" />,
  Earrings: <path d="M50 20a14 14 0 1 0 0 28a20 20 0 1 1 0 -28z" transform="translate(0,20)" fill="#c9ced6" />,
  Necklaces: (
    <>
      <path d="M15 25q35 60 70 0" fill="none" stroke="#c9ced6" strokeWidth="3" />
      <circle cx="50" cy="63" r="9" fill="#c9ced6" />
    </>
  ),
  Bracelets: <ellipse cx="50" cy="50" rx="36" ry="22" fill="none" stroke="#c9ced6" strokeWidth="8" />,
  Anklets: <path d="M10 55q40 25 80 0" fill="none" stroke="#c9ced6" strokeWidth="3" strokeDasharray="6 4" />,
};

export default function ProductCard({ category, name, price }) {
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
    el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
  };

  return (
    <button className="card">
      <div className="img" onPointerMove={onMove}>
        <svg viewBox="0 0 100 100">{SHAPES[category]}</svg>
      </div>
      <span className="quick">Quick view</span>
      <h3>{name}</h3>
      <div className="meta">
        <span>925 silver</span>
        <span className="price">{price}</span>
      </div>
    </button>
  );
}