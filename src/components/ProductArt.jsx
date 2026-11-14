import { useId } from "react";

/**
 * Studio renders.
 *
 * Every piece is drawn, not photographed: one silver treatment, one light
 * direction, four angles per piece. The variation that matters is the
 * silhouette, so the catalogue reads as one brand rather than twenty JPEGs.
 */

const metalStops = [
  ["0%", "#fdfefe"],
  ["26%", "#a9b0bc"],
  ["46%", "#f5f7fa"],
  ["64%", "#767d8a"],
  ["84%", "#dde2ea"],
  ["100%", "#5f6673"],
];

function Defs({ id, v }) {
  const a = ((25 + v * 52) * Math.PI) / 180;
  const x1 = 50 - Math.cos(a) * 50;
  const y1 = 50 - Math.sin(a) * 50;
  const x2 = 50 + Math.cos(a) * 50;
  const y2 = 50 + Math.sin(a) * 50;

  return (
    <defs>
      <linearGradient id={id("metal")} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}>
        {metalStops.map(([o, c]) => (
          <stop key={o} offset={o} stopColor={c} />
        ))}
      </linearGradient>
      <linearGradient id={id("metalAlt")} x1="10%" y1="90%" x2="90%" y2="10%">
        <stop offset="0%" stopColor="#6c7280" />
        <stop offset="40%" stopColor="#e8ecf2" />
        <stop offset="70%" stopColor="#98a0ae" />
        <stop offset="100%" stopColor="#f7f9fc" />
      </linearGradient>
      <radialGradient id={id("gem")} cx="35%" cy="28%" r="78%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor="#e3e9f6" />
        <stop offset="100%" stopColor="#8c9dc4" />
      </radialGradient>
      <radialGradient id={id("pearl")} cx="32%" cy="26%" r="80%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#eef0f3" />
        <stop offset="100%" stopColor="#c2c6cd" />
      </radialGradient>
      <linearGradient id={id("gold")} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e7d6b4" />
        <stop offset="100%" stopColor="#b99b64" />
      </linearGradient>
      <filter id={id("soft")} x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#05070d" floodOpacity=".5" />
      </filter>
    </defs>
  );
}

const stroke = (id, w, extra = {}) => ({
  fill: "none",
  stroke: `url(#${id("metal")})`,
  strokeWidth: w,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  ...extra,
});

const chainArc = (id, d, w = 2, extra) => (
  <path d={d} stroke={stroke(id, w, extra).stroke} strokeWidth={w} fill="none" strokeLinecap="round" />
);

/* ——— shapes ———————————————————————————————————————————————— */

const SHAPES = {
  /* Rings */
  band: (id, p) => {
    const cy = 118;
    return (
      <>
        <ellipse cx="100" cy={cy} rx={p.rx} ry={p.ry} {...stroke(id, p.weight)} filter={`url(#${id("soft")})`} />
        <ellipse cx="100" cy={cy} rx={p.rx - 2} ry={p.ry - 2} fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="1.4" />
        {p.gem && (
          <g>
            <circle cx="112" cy={cy - p.ry + 4} r="9" fill={`url(#${id("gem")})`} stroke="#eef2f8" strokeWidth="1.2" />
            <path d={`M112 ${cy - p.ry - 5} l0 18 M103 ${cy - p.ry + 4} l18 0`} stroke="#fff" strokeOpacity=".8" strokeWidth="1" />
            <path d={`M105 ${cy - p.ry + 9} l14 -10`} stroke="#fff" strokeOpacity=".35" strokeWidth="1" />
          </g>
        )}
      </>
    );
  },

  stack: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          cx="100"
          cy={116 + i * 3}
          rx={p.rx - i * 3}
          ry={p.ry - i * 2}
          fill="none"
          stroke={`url(#${id("metal")})`}
          strokeWidth={p.weight - i * 0.4}
        />
      ))}
      <path d="M78 92 q22 -6 44 0" stroke="#fff" strokeOpacity=".5" strokeWidth="1.4" fill="none" />
    </g>
  ),

  signet: (id, p) => (
    <>
      <ellipse cx="100" cy="120" rx={p.rx} ry={p.ry} {...stroke(id, p.weight)} filter={`url(#${id("soft")})`} />
      <ellipse cx="100" cy="86" rx="19" ry="13" fill={`url(#${id("metalAlt")})`} stroke="#f2f5fa" strokeWidth="1.2" />
      <ellipse cx="100" cy="86" rx="13" ry="8" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1" />
      <path d="M76 110 q24 -8 48 0" stroke="#fff" strokeOpacity=".4" strokeWidth="1.2" fill="none" />
    </>
  ),

  twist: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      <ellipse cx="100" cy="116" rx={p.rx} ry={p.ry} {...stroke(id, p.weight)} />
      <ellipse
        cx="100"
        cy="116"
        rx={p.rx}
        ry={p.ry}
        fill="none"
        stroke={`url(#${id("metalAlt")})`}
        strokeWidth={p.weight - 1.6}
        strokeDasharray="7 9"
      />
      <ellipse cx="100" cy="116" rx={p.rx - 2.5} ry={p.ry - 2.5} fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1" />
    </g>
  ),

  /* Earrings */
  drop: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      <path d="M100 34 v22" stroke={`url(#${id("metalAlt")})`} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="100" cy="30" r="4.2" fill="none" stroke={`url(#${id("metal")})`} strokeWidth="2" />
      <path
        d={`M100 58 a${p.size} ${p.size} 0 1 0 0 ${p.size * 2} a${p.size * 0.82} ${p.size * 0.82} 0 1 1 0 -${p.size * 2}`}
        fill={`url(#${id("metal")})`}
        stroke="#f4f7fb"
        strokeWidth=".8"
      />
      <path d={`M92 74 q8 -6 14 2`} stroke="#fff" strokeOpacity=".7" strokeWidth="1.2" fill="none" />
    </g>
  ),

  hoop: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      <circle cx="100" cy="112" r={p.size} fill="none" stroke={`url(#${id("metal")})`} strokeWidth={p.weight} />
      <circle cx="100" cy={112 - p.size} r="3.4" fill="none" stroke={`url(#${id("metalAlt")})`} strokeWidth="2" />
      {Array.from({ length: p.pearls }).map((_, i) => {
        const a = (Math.PI * (0.15 + (i / p.pearls) * 0.9));
        return (
          <circle
            key={i}
            cx={100 + Math.cos(a) * p.size}
            cy={112 + Math.sin(a) * p.size}
            r={4.6 - (i % 2) * 0.5}
            fill={`url(#${id("pearl")})`}
            stroke="#fff"
            strokeOpacity=".5"
            strokeWidth=".6"
          />
        );
      })}
    </g>
  ),

  stud: (id, p) => {
    const pts = Array.from({ length: p.points * 2 }).map((_, i) => {
      const r = i % 2 === 0 ? p.size : p.size * 0.42;
      const a = (Math.PI / p.points) * i - Math.PI / 2;
      return `${100 + Math.cos(a) * r},${104 + Math.sin(a) * r}`;
    });
    return (
      <g filter={`url(#${id("soft")})`}>
        <polygon points={pts.join(" ")} fill={`url(#${id("metal")})`} stroke="#f6f9fc" strokeWidth=".9" />
        <circle cx="100" cy="104" r={p.size * 0.26} fill={`url(#${id("gem")})`} />
      </g>
    );
  },

  dangler: (id) => (
    <g filter={`url(#${id("soft")})`}>
      <circle cx="100" cy="30" r="4" fill="none" stroke={`url(#${id("metalAlt")})`} strokeWidth="2" />
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          cx="100"
          cy={44 + i * 17}
          rx={8 - i * 1.4}
          ry={10 - i * 1.6}
          fill="none"
          stroke={`url(#${id("metal")})`}
          strokeWidth="2.6"
        />
      ))}
      <path
        d="M100 88 c-11 11 -14 31 0 40 c14 -9 11 -29 0 -40 z"
        fill={`url(#${id("metalAlt")})`}
        stroke="#f4f7fb"
        strokeWidth=".8"
      />
    </g>
  ),

  /* Necklaces */
  pendant: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      {chainArc(id, "M46 26 q54 64 108 0", 2.2)}
      <path
        d={`M100 ${64} a${p.size} ${p.size} 0 0 0 0 ${p.size * 2} z`}
        fill={`url(#${id("metal")})`}
        stroke="#f5f8fb"
        strokeWidth="1"
      />
      <path d={`M100 ${64} h${p.size} `} stroke="#e9eef5" strokeWidth="1" opacity=".6" />
      <path d={`M88 ${74} q10 -4 18 2`} stroke="#fff" strokeOpacity=".7" strokeWidth="1.3" fill="none" />
    </g>
  ),

  thread: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      {chainArc(id, `M${100 - p.size} 30 q${p.size} 52 ${p.size * 2} 0`, 1.8)}
      <rect x="95" y="70" width="10" height="48" rx="5" fill={`url(#${id("metalAlt")})`} stroke="#f4f7fb" strokeWidth=".8" />
      {Array.from({ length: 7 }).map((_, i) => (
        <circle key={i} cx={i % 2 ? 98 : 102} cy={75 + i * 6.4} r="1.6" fill="#fff" opacity=".9" />
      ))}
    </g>
  ),

  halo: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      {chainArc(id, "M52 24 q48 56 96 0", 2)}
      <circle cx="100" cy={24 + 30 + p.size + 8} r={p.size} fill="none" stroke={`url(#${id("metal")})`} strokeWidth="4.5" />
      <path d="M100 54 v18" stroke={`url(#${id("metalAlt")})`} strokeWidth="2" />
      <circle cx="100" cy={54} r="3" fill="#fff" opacity=".8" />
    </g>
  ),

  choker: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      <path
        d={`M${100 - p.size * 0.7} 62 q${p.size * 0.7} 46 ${p.size * 1.4} 0`}
        fill="none"
        stroke={`url(#${id("metal")})`}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d={`M${100 - p.size * 0.7} 62 q${p.size * 0.7} 46 ${p.size * 1.4} 0`}
        fill="none"
        stroke="#fff"
        strokeOpacity=".25"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="100" cy="100" r="11" fill="none" stroke={`url(#${id("metalAlt")})`} strokeWidth="3" />
      <circle cx="100" cy="100" r="7" fill={`url(#${id("gem")})`} stroke="#f3f7fb" strokeWidth="1" />
    </g>
  ),

  /* Bracelets */
  cuff: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      <path
        d={`M100 ${100 - p.ry} a${p.rx} ${p.ry} 0 1 0 0 ${p.ry * 2} a${p.rx} ${p.ry} 0 0 0 ${p.rx - 6} -${p.ry * 0.55}`}
        fill="none"
        stroke={`url(#${id("metal")})`}
        strokeWidth={p.weight}
        strokeLinecap="round"
      />
      {Array.from({ length: 9 }).map((_, i) => (
        <circle
          key={i}
          cx={100 - p.rx + 10 + i * 9}
          cy={100 + Math.sin(i) * 12}
          r="1.5"
          fill="#fff"
          opacity=".28"
        />
      ))}
      <path d={`M100 ${100 - p.ry} a${p.rx} ${p.ry} 0 0 1 ${p.rx * 0.6} ${p.ry * 0.5}`} fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="2" />
    </g>
  ),

  tide: (id) => (
    <g filter={`url(#${id("soft")})`}>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M40 ${92 + i * 16} q15 -14 30 0 t30 0 t30 0 t30 0`}
          fill="none"
          stroke={`url(#${id(i % 2 ? "metalAlt" : "metal")})`}
          strokeWidth={4 - i * 0.5}
          strokeLinecap="round"
        />
      ))}
    </g>
  ),

  links: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      {Array.from({ length: p.count }).map((_, i) => {
        const a = (Math.PI * 2 * i) / p.count;
        return (
          <ellipse
            key={i}
            cx={100 + Math.cos(a) * p.rx}
            cy={104 + Math.sin(a) * p.ry}
            rx="8"
            ry="5.5"
            fill="none"
            stroke={`url(#${id(i % 2 ? "metalAlt" : "metal")})`}
            strokeWidth="3"
            transform={`rotate(${(a * 180) / Math.PI} ${100 + Math.cos(a) * p.rx} ${104 + Math.sin(a) * p.ry})`}
          />
        );
      })}
    </g>
  ),

  bangle: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      <circle cx="100" cy="104" r={p.rx} fill="none" stroke={`url(#${id("metal")})`} strokeWidth={p.weight} />
      <circle cx="100" cy="104" r={p.rx - p.weight / 2 + 1.5} fill="none" stroke={`url(#${id("gold")})`} strokeWidth="2" opacity=".85" />
      <path d={`M${100 - p.rx + 6} 78 a${p.rx} ${p.rx} 0 0 1 ${p.rx * 0.9} ${-p.rx * 0.25}`} fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2.4" />
    </g>
  ),

  /* Anklets */
  chain: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      <path d={`M${100 - p.size} 96 q${p.size} 44 ${p.size * 2} 0`} fill="none" stroke={`url(#${id("metal")})`} strokeWidth="2.2" strokeDasharray="3 3.4" />
      <circle cx="100" cy="120" r="4" fill={`url(#${id("metalAlt")})`} stroke="#f2f6fa" strokeWidth=".8" />
    </g>
  ),

  stars: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      {chainArc(id, `M${100 - p.size} 96 q${p.size} 44 ${p.size * 2} 0`, 1.8)}
      {Array.from({ length: p.count }).map((_, i) => {
        const t = (i + 1) / (p.count + 1);
        const x = 100 - p.size + t * p.size * 2;
        const y = 96 + Math.sin(Math.PI * t) * 22;
        return (
          <path
            key={i}
            d={`M${x} ${y - 5} l1.4 3.4 3.6 .3 -2.8 2.4 .9 3.5 -3.1 -1.9 -3.1 1.9 .9 -3.5 -2.8 -2.4 3.6 -.3z`}
            fill={`url(#${id("metal")})`}
            transform={`rotate(${i * 24} ${x} ${y})`}
          />
        );
      })}
    </g>
  ),

  shore: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      {chainArc(id, `M${100 - p.size} 96 q${p.size} 44 ${p.size * 2} 0`, 1.6)}
      {Array.from({ length: p.beads }).map((_, i) => {
        const t = (i + 1) / (p.beads + 1);
        const x = 100 - p.size + t * p.size * 2;
        const y = 96 + Math.sin(Math.PI * t) * 21 + 2;
        return <circle key={i} cx={x} cy={y} r={2.4 + (i % 3)} fill={`url(#${id("metalAlt")})`} stroke="#fff" strokeOpacity=".4" strokeWidth=".5" />;
      })}
    </g>
  ),

  drift: (id, p) => (
    <g filter={`url(#${id("soft")})`}>
      <path d={`M${100 - p.size} 90 q${p.size} 34 ${p.size * 2} 0`} fill="none" stroke={`url(#${id("metal")})`} strokeWidth="2.6" strokeLinecap="round" />
      <path d={`M${100 - p.size} 104 q${p.size} 36 ${p.size * 2} 0`} fill="none" stroke={`url(#${id("metalAlt")})`} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="100" cy="126" r="4.5" fill="none" stroke={`url(#${id("metal")})`} strokeWidth="2" />
    </g>
  ),
};

export default function ProductArt({ piece, variant = 0, className = "" }) {
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, "") || "art";
  const id = (n) => `${uid}-${n}-${variant}`;
  const v = variant % 4;
  const draw = SHAPES[piece.art.kind];

  return (
    <svg
      viewBox="0 0 200 200"
      className={`art ${className}`}
      role="img"
      aria-label={`${piece.name}, silver ${piece.category.slice(0, -1).toLowerCase()}`}
    >
      <Defs id={id} v={v} />
      <ellipse cx="100" cy="166" rx="52" ry="7" fill="#000" opacity=".22" />
      {draw ? draw(id, piece.art, v) : null}
    </svg>
  );
}
