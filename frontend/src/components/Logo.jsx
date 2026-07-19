import { useId } from 'react';

export default function Logo({ size = 32, wordmark = true, className = '', animated = false }) {
  const uid = useId().replace(/:/g, '');
  // gradient IDs
  const g1 = `g1-${uid}`;
  const g2 = `g2-${uid}`;
  const g3 = `g3-${uid}`;
  const g4 = `g4-${uid}`;
  const g5 = `g5-${uid}`;
  const g6 = `g6-${uid}`;
  const g7 = `g7-${uid}`;
  const gRing = `gr-${uid}`;
  const clipB = `cb-${uid}`;
  const clipG = `cg-${uid}`;
  const clipP = `cp-${uid}`;
  const filS = `fs-${uid}`;

  return (
    <span
      className={`logo ${animated ? 'logo-animated' : ''} ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: wordmark ? Math.max(12, size * 0.3) : 0 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, overflow: 'visible' }}
        className="logo-mark"
        aria-hidden="true"
      >
        <defs>
          {/* Core red gradient */}
          <linearGradient id={g1} x1="6" y1="2" x2="58" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="30%" stopColor="#ff2222" />
            <stop offset="55%" stopColor="#d91818" />
            <stop offset="80%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          {/* Bright accent */}
          <linearGradient id={g2} x1="10" y1="4" x2="54" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff8a8a" />
            <stop offset="40%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          {/* Glass backdrop */}
          <linearGradient id={g3} x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.03)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </linearGradient>
          {/* Letter fill — bright cream */}
          <linearGradient id={g4} x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#eaeaf0" />
            <stop offset="100%" stopColor="#c0c0ce" />
          </linearGradient>
          {/* Letter shadow / 3D layer */}
          <linearGradient id={g5} x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
          </linearGradient>
          {/* Ring gloss */}
          <linearGradient id={gRing} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="20%" stopColor="#ff6b6b" />
            <stop offset="50%" stopColor="#e11d1d" />
            <stop offset="80%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
          </linearGradient>
          {/* Shine sweep */}
          <linearGradient id={g6} x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0)" />
            <stop offset="48%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="52%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          {/* Ambient glow */}
          <radialGradient id={g7} cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#ff2222" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#e11d1d" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
          </radialGradient>
          {/* Filters */}
          <filter id={`gl-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
          </filter>
          <filter id={`sh-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3.5" stdDeviation="5" floodColor="#e11d1d" floodOpacity="0.55" />
            <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="#e11d1d" floodOpacity="0.25" />
          </filter>
          <filter id={`dp-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
          </filter>
          <filter id={`txt-${uid}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="rgba(225,29,29,0.35)" />
          </filter>
          {/* Contour clip for shine */}
          <clipPath id={clipB}>
            <rect x="2" y="2" width="60" height="60" rx="16" />
          </clipPath>
          <clipPath id={clipG}>
            <rect x="2.5" y="2.5" width="59" height="59" rx="15.5" />
          </clipPath>
          <clipPath id={clipP}>
            <rect x="0" y="0" width="64" height="64" rx="18" />
          </clipPath>
        </defs>

        {/* ────────── OUTER GLOW ────────── */}
        <circle cx="32" cy="32" r="32" fill={`url(#${g7})`} className="logo-halo" filter={`url(#gl-${uid})`} />

        {/* ────────── PARTICLES ────────── */}
        <g clipPath={`url(#${clipP})`} className={`logo-particles ${animated ? '' : 'logo-particles-static'}`}>
          <circle cx="8" cy="14" r="1.2" fill="#ff6b6b" opacity="0.7" />
          <circle cx="56" cy="10" r="1" fill="#ff6b6b" opacity="0.5" />
          <circle cx="58" cy="50" r="1.4" fill="#ff6b6b" opacity="0.6" />
          <circle cx="6" cy="52" r="0.9" fill="#ff6b6b" opacity="0.5" />
          <circle cx="49" cy="6" r="0.8" fill="#fff" opacity="0.4" />
          <circle cx="15" cy="56" r="1.1" fill="#fff" opacity="0.35" />
          <circle cx="52" cy="58" r="0.7" fill="#ff8a8a" opacity="0.5" />
          <circle cx="4" cy="32" r="1.3" fill="#ff8a8a" opacity="0.4" />
          <circle cx="60" cy="34" r="0.9" fill="#fff" opacity="0.3" />
        </g>

        {/* ────────── GLASS BACKPLATE ────────── */}
        <g filter={`url(#sh-${uid})`}>
          <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#g3)" />
          <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#g1)" opacity="0.18" />
          {/* Frosted inner */}
          <rect x="6" y="6" width="52" height="52" rx="12" fill="rgba(255,255,255,0.03)" />
          <rect x="6" y="6" width="52" height="52" rx="12" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        </g>

        {/* ────────── RING ────────── */}
        <g clipPath={`url(#${clipG})`}>
          <rect x="2.5" y="2.5" width="59" height="59" rx="15.5" stroke={`url(#${gRing})`} strokeWidth="2" fill="none" className="logo-ring" opacity="0.95" />
          {/* Ring shine track */}
          <rect x="2.5" y="2.5" width="59" height="59" rx="15.5" stroke={`url(#${g6})`} strokeWidth="4" fill="none" className="logo-ring-shine" />
        </g>

        {/* ────────── INNER RIM ────────── */}
        <rect x="4.5" y="4.5" width="55" height="55" rx="13.5" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />

        {/* ────────── SPECULAR HIGHLIGHT ────────── */}
        <g clipPath={`url(#${clipB})`}>
          <path d="M2 8 L2 2 L50 2 Q 30 6 14 14 8 18 6 24 Q 4 16 2 8 Z" fill="rgba(255,255,255,0.35)" />
          <path d="M2 18 C 12 8, 28 4, 42 10 L 62 2 L 2 2 Z" fill="rgba(255,255,255,0.08)" />
        </g>

        {/* ────────── 3D LETTER DROP SHADOWS ────────── */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" className="logo-shadow-layer">
          {/* Left C shadow */}
          <path d="M28.5 18.5 C 15.5 18.5, 10.5 26, 10.5 32 C 10.5 38, 15.5 45.5, 28.5 45.5" stroke={`url(#${g5})`} strokeWidth="8" transform="translate(0,2.5)" />
          {/* Right L shadow */}
          <path d="M38.5 23.5 L 38.5 45.5 L 53.5 45.5" stroke={`url(#${g5})`} strokeWidth="8" transform="translate(0,2.5)" />
        </g>

        {/* ────────── RED UNDERGLOW LAYER ────────── */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" className="logo-glow-layer">
          <path d="M28.5 18.5 C 15.5 18.5, 10.5 26, 10.5 32 C 10.5 38, 15.5 45.5, 28.5 45.5" stroke={`url(#${g2})`} strokeWidth="8.5" />
          <path d="M38.5 23.5 L 38.5 45.5 L 53.5 45.5" stroke={`url(#${g2})`} strokeWidth="8.5" />
        </g>

        {/* ────────── WHITE LETTERS (CRISP) ────────── */}
        <g filter={`url(#dp-${uid})`}>
          <path d="M28.5 18.5 C 15.5 18.5, 10.5 26, 10.5 32 C 10.5 38, 15.5 45.5, 28.5 45.5" stroke={`url(#${g4})`} strokeWidth="6.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M38.5 23.5 L 38.5 45.5 L 53.5 45.5" stroke={`url(#${g4})`} strokeWidth="6.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* ────────── RED ACCENT TERMINALS ────────── */}
        <g>
          <circle cx="28.5" cy="18.5" r="2.8" fill={`url(#${g2})`} filter={`url(#sh-${uid})`} />
          <circle cx="28.5" cy="45.5" r="2.8" fill={`url(#${g2})`} filter={`url(#sh-${uid})`} />
          <circle cx="38.5" cy="23.5" r="2.5" fill={`url(#${g2})`} filter={`url(#sh-${uid})`} />
          <circle cx="53.5" cy="45.5" r="2.5" fill={`url(#${g2})`} filter={`url(#sh-${uid})`} />
        </g>

        {/* ────────── LETTER TOP LIGHT (RIM) ────────── */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
          <path d="M28.5 18.5 C 15.5 18.5, 10.5 26, 10.5 32" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" />
          <path d="M38.5 23.5 L 38.5 45.5 L 53.5 45.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        </g>

        {/* ────────── SHIMMER SWEEP OVER MARK ────────── */}
        <rect x="2" y="2" width="60" height="60" rx="16" fill={`url(#${g6})`} clipPath={`url(#${clipB})`} className="logo-shimmer" />

        {/* ────────── BOTTOM EDGE LIGHT ────────── */}
        <path d="M14 54.5 Q 32 58.5 50 54.5" stroke={`url(#${gRing})`} strokeWidth="1.5" opacity="0.5" fill="none" strokeLinecap="round" />
        <path d="M18 56 Q 32 60 46 56" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" strokeLinecap="round" />
      </svg>

      {wordmark && (
        <span className="logo-wordmark" style={{ fontSize: size * 0.55 }}>
          <span className="logo-word-first">Cowx</span>
          <span className="logo-word-last">Labs</span>
        </span>
      )}
    </span>
  );
}
