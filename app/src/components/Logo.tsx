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
      <g stroke="#C8963E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* body silhouette with integrated wheel arches */}
        <path d="M15 33 V27 Q15 24.5 17.5 24.5 H23 L26 20.5 H43 Q45 20.5 45 23 V33 H42 A3 3 0 0 0 36 33 H25 A3 3 0 0 0 19 33 Z" />
        {/* cab / cargo division */}
        <path d="M26 21 V33" />
        {/* cab window */}
        <path d="M27.6 23 H31 V27 H27.6 Z" />
        {/* door handle */}
        <path d="M37.5 28 H40" />
      </g>
      {/* wheels */}
      <g stroke="#C8963E" strokeWidth="1.8" fill="none">
        <circle cx="22" cy="33" r="3" />
        <circle cx="39" cy="33" r="3" />
      </g>
      <circle cx="22" cy="33" r="0.95" fill="#C8963E" />
      <circle cx="39" cy="33" r="0.95" fill="#C8963E" />

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
