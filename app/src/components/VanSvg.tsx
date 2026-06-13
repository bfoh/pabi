// app/src/components/VanSvg.tsx

interface VanSvgProps {
  className?: string;
}

/**
 * Side-view Pabi-liveried Sprinter. viewBox 0 0 380 200.
 * Wheels use class "van-wheel" (rotate via GSAP). Headlight glow id "van-headlight".
 */
export default function VanSvg({ className }: VanSvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 380 200"
      width="380"
      height="200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pabi Removals van"
      role="img"
    >
      <defs>
        <linearGradient id="vanBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A2B47" />
          <stop offset="1" stopColor="#0A1628" />
        </linearGradient>
        <radialGradient id="headlightGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FDF3D6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FDF3D6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vanGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9FB6CE" />
          <stop offset="1" stopColor="#5E7894" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="190" cy="186" rx="168" ry="10" fill="#0A1628" opacity="0.22" />

      {/* Headlight glow (drawn behind body, projecting forward-left) */}
      <circle id="van-headlight" cx="20" cy="120" r="34" fill="url(#headlightGlow)" />

      {/* Body shell: long box with raked cab front (nose at left) */}
      <path
        d="M44 150
           L44 92
           Q44 64 72 60
           L96 60
           L120 36
           L356 36
           Q368 36 368 50
           L368 150
           Z"
        fill="url(#vanBody)"
        stroke="#0A1628"
        strokeWidth="2"
      />

      {/* Roof highlight */}
      <path d="M120 40 L356 40 Q362 40 362 48 L120 48 Z" fill="#22324F" opacity="0.6" />

      {/* Windscreen */}
      <path d="M98 60 L120 40 L150 40 L150 60 Z" fill="url(#vanGlass)" stroke="#0A1628" strokeWidth="1.5" />
      {/* Cab door window */}
      <rect x="156" y="42" width="34" height="20" rx="3" fill="url(#vanGlass)" stroke="#0A1628" strokeWidth="1.5" />

      {/* Cargo body panel lines */}
      <line x1="196" y1="40" x2="196" y2="150" stroke="#0A1628" strokeWidth="1.5" opacity="0.5" />
      <line x1="282" y1="40" x2="282" y2="150" stroke="#0A1628" strokeWidth="1.5" opacity="0.5" />
      {/* Sliding-door handle */}
      <rect x="236" y="96" width="22" height="5" rx="2.5" fill="#22324F" />

      {/* Gold lower livery stripe */}
      <rect x="44" y="132" width="324" height="18" fill="#C8963E" />
      <rect x="44" y="130" width="324" height="3" fill="#D4A84D" />

      {/* Pabi hexagon badge on cargo side */}
      <g transform="translate(228 84)">
        <polygon
          points="0,-26 22,-13 22,13 0,26 -22,13 -22,-13"
          fill="none"
          stroke="#C8963E"
          strokeWidth="3"
        />
        <text x="0" y="2" textAnchor="middle" fontFamily="Inter, sans-serif"
              fontSize="15" fontWeight="700" letterSpacing="1" fill="#C8963E">PABI</text>
        <text x="0" y="15" textAnchor="middle" fontFamily="Inter, sans-serif"
              fontSize="6" fontWeight="600" letterSpacing="2" fill="#D4A84D">REMOVALS</text>
      </g>

      {/* Front bumper + headlight lens */}
      <path d="M44 150 L44 120 Q40 120 40 128 L40 150 Z" fill="#1A2B47" />
      <rect x="42" y="112" width="10" height="12" rx="2" fill="#FDF3D6" stroke="#C8963E" strokeWidth="1" />

      {/* Mirror */}
      <path d="M96 64 l-10 -2 l0 8 l10 -2 Z" fill="#1A2B47" />

      {/* Wheel arches */}
      <path d="M86 150 a30 30 0 0 1 60 0 Z" fill="#0A1628" />
      <path d="M270 150 a30 30 0 0 1 60 0 Z" fill="#0A1628" />

      {/* Wheels (spin via .van-wheel) */}
      <g className="van-wheel" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx="116" cy="150" r="22" fill="#15151F" stroke="#2A2A38" strokeWidth="3" />
        <circle cx="116" cy="150" r="9" fill="#C8963E" />
        <rect x="114.5" y="131" width="3" height="38" fill="#0A1628" />
        <rect x="97" y="148.5" width="38" height="3" fill="#0A1628" />
      </g>
      <g className="van-wheel" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx="300" cy="150" r="22" fill="#15151F" stroke="#2A2A38" strokeWidth="3" />
        <circle cx="300" cy="150" r="9" fill="#C8963E" />
        <rect x="298.5" y="131" width="3" height="38" fill="#0A1628" />
        <rect x="281" y="148.5" width="38" height="3" fill="#0A1628" />
      </g>
    </svg>
  );
}
