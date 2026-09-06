// Inline SVG rather than emoji: flag emoji (🇩🇰 🇬🇧) do not render as flags on
// Windows, which shows "DK" / "GB" letters instead. These also stay crisp at
// any size and cost no extra requests.

export function SunIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="#F5A623" />
      <g stroke="#F5A623" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1.5" x2="12" y2="3.5" />
        <line x1="12" y1="20.5" x2="12" y2="22.5" />
        <line x1="1.5" y1="12" x2="3.5" y2="12" />
        <line x1="20.5" y1="12" x2="22.5" y2="12" />
        <line x1="4.5" y1="4.5" x2="5.9" y2="5.9" />
        <line x1="18.1" y1="18.1" x2="19.5" y2="19.5" />
        <line x1="4.5" y1="19.5" x2="5.9" y2="18.1" />
        <line x1="18.1" y1="5.9" x2="19.5" y2="4.5" />
      </g>
    </svg>
  );
}

export function MoonIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
        fill="#3D3D6B"
      />
    </svg>
  );
}

// Dannebrog. The cross sits off-centre toward the hoist, which is what makes it
// read as the Danish flag rather than a generic Nordic one.
export function FlagDK({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 37 28"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="37" height="28" fill="#C8102E" />
      <rect x="12" width="4" height="28" fill="#FFFFFF" />
      <rect y="12" width="37" height="4" fill="#FFFFFF" />
    </svg>
  );
}

// Union Jack. The clip path is what counterchanges the red diagonals so they
// sit on the correct side of each white one — without it the flag is a common
// upside-down-looking approximation.
export function FlagGB({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 30"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <clipPath id="flag-gb-counterchange">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath="url(#flag-gb-counterchange)"
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}
