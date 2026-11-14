export default function Ring({ className = "" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ringMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fdfefe" />
          <stop offset=".32" stopColor="#aeb4bf" />
          <stop offset=".56" stopColor="#f1f3f6" />
          <stop offset=".78" stopColor="#8b929e" />
          <stop offset="1" stopColor="#6c7280" />
        </linearGradient>
        <radialGradient id="ringGem" cx="35%" cy="28%" r="78%">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".55" stopColor="#dfe7f7" />
          <stop offset="1" stopColor="#93a5cc" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="122" rx="62" ry="64" fill="none" stroke="url(#ringMetal)" strokeWidth="13" />
      <ellipse cx="100" cy="122" rx="62" ry="64" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="1.4" transform="translate(-3,-3)" />
      <path d="M84 62 L100 40 L116 62 L100 74Z" fill="url(#ringGem)" stroke="#eef2f8" strokeWidth="1.5" />
      <path d="M84 62 L116 62 M100 40 L100 74" stroke="#fff" strokeOpacity=".8" strokeWidth="1" />
    </svg>
  );
}
