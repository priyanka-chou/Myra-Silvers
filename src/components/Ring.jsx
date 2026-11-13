export default function Ring() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".35" stopColor="#aeb4bf" />
          <stop offset=".6" stopColor="#f1f3f6" />
          <stop offset="1" stopColor="#6c7280" />
        </linearGradient>
        <radialGradient id="gem">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#9fb0d4" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="122" rx="62" ry="64" fill="none" stroke="url(#g1)" strokeWidth="12" />
      <ellipse cx="100" cy="122" rx="62" ry="64" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.5" transform="translate(-3,-3)" />
      <path d="M84 62 L100 40 L116 62 L100 74Z" fill="url(#gem)" stroke="#e9edf5" strokeWidth="1.5" />
      <path d="M84 62 L116 62 M100 40 L100 74" stroke="#fff" strokeOpacity=".8" strokeWidth="1" />
    </svg>
  );
}