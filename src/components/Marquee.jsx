const WORDS = ["925 sterling", "hand-finished", "small batch", "made in India", "recycled silver"];

export default function Marquee() {
  const line = [...WORDS, ...WORDS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {line.map((w, i) => (
          <span key={i} className="marquee__item">
            {w}
            <i className="marquee__star">✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}
