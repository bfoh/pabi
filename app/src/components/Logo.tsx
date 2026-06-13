// app/src/components/Logo.tsx
// Crisp inline lockup: gold hexagon + van mark, bold PABI wordmark, REMOVALS sub-label.
// Designed for dark (navy) backgrounds — header and footer share this one component.

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 232 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Pabi Removals"
    >
      {/* Hexagon badge */}
      <polygon
        points="30,3 53,16.5 53,43.5 30,57 7,43.5 7,16.5"
        fill="none"
        stroke="#C8963E"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />

      {/* Van mark */}
      <g stroke="#C8963E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* cargo box + cab */}
        <path d="M19 25 H37 V35 H17 V30 Q17 27 20 26 L21 25 Z" />
        <path d="M37 28 H41 L44 31 V35 H37 Z" />
        {/* ground line */}
        <path d="M14 39 H46" strokeWidth="1.3" opacity="0.5" />
      </g>
      {/* wheels */}
      <circle cx="24" cy="35.5" r="2.6" fill="#C8963E" />
      <circle cx="39" cy="35.5" r="2.6" fill="#C8963E" />

      {/* Wordmark */}
      <text
        x="68" y="34"
        fontFamily="Manrope, system-ui, sans-serif"
        fontSize="30" fontWeight="800" letterSpacing="0.5"
        fill="#FFFFFF"
      >
        PABI
      </text>
      {/* Sub-label with flanking rules */}
      <line x1="69" y1="46.5" x2="76" y2="46.5" stroke="#C8963E" strokeWidth="1.4" />
      <text
        x="80" y="49.5"
        fontFamily="Manrope, system-ui, sans-serif"
        fontSize="9" fontWeight="600" letterSpacing="3.4"
        fill="#C8963E"
      >
        REMOVALS
      </text>
    </svg>
  );
}
