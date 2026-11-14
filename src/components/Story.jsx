export default function Story() {
  return (
    <section className="story" id="story">
      <div className="story__grid">
        <div className="story__text">
          <p className="eyebrow" data-reveal>
            First quarter
          </p>
          <h2 data-reveal data-reveal-delay="0.04">
            Made by hand.
            <br />
            Worn for a lifetime.
          </h2>
          <p data-reveal data-reveal-delay="0.08">
            Every piece begins as a sketch and ends on a bench in a small workshop, filed and
            polished until the seam disappears. We make fewer things, slowly, and only in silver
            we can trace.
          </p>

          <dl className="story__numbers" data-reveal data-reveal-delay="0.12">
            <div>
              <dt>925</dt>
              <dd>parts silver, recycled</dd>
            </div>
            <div>
              <dt>20</dt>
              <dd>pieces, no seasons</dd>
            </div>
            <div>
              <dt>5–7</dt>
              <dd>days to make, by hand</dd>
            </div>
          </dl>
        </div>

        <div className="story__mark" aria-hidden="true">
          <div data-parallax="0.1">
            <svg viewBox="0 0 320 320" className="etch">
              <defs>
                <linearGradient id="etchLine" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#e9edf5" stopOpacity=".85" />
                  <stop offset=".6" stopColor="#9a9ea6" stopOpacity=".35" />
                  <stop offset="1" stopColor="#e9edf5" stopOpacity=".12" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <circle
                  key={i}
                  cx="160"
                  cy="160"
                  r={58 + i * 17}
                  fill="none"
                  stroke="url(#etchLine)"
                  strokeWidth=".8"
                  strokeDasharray={i % 2 ? "2 5" : "none"}
                  opacity={1 - i * 0.13}
                />
              ))}
              <path
                d="M160 62 a98 98 0 1 0 0 196 a74 74 0 1 1 0 -196z"
                fill="none"
                stroke="#e9edf5"
                strokeWidth="1.1"
                opacity=".9"
              />
              <path d="M160 30 v22 M160 268 v22 M30 160 h22 M268 160 h22" stroke="#d9c7a5" strokeWidth="1" opacity=".7" />
              <circle cx="238" cy="102" r="2.6" fill="#e9edf5" />
              <circle cx="76" cy="214" r="1.8" fill="#e9edf5" opacity=".8" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
