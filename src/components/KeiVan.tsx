/**
 * A stylised Kei micro-van, drawn in the car's own accent colour.
 *
 * This is what renders when a car has no photo yet, so a brand-new fleet entry
 * still looks intentional instead of showing a broken image. Swap it out per
 * car by setting `image` on the car record.
 */
export function KeiVan({
  accent = "#d94436",
  className,
  title,
}: {
  accent?: string;
  className?: string;
  title?: string;
}) {
  // Gradient ids must not collide across the several vans on a page. They're
  // derived from the accent rather than useId() because this renders as a
  // Server Component, where hooks aren't available. Two vans sharing an accent
  // share an id, which is harmless: the gradients they describe are identical.
  const uid = accent.replace(/[^a-zA-Z0-9]/g, "");
  const bodyGradient = `body-${uid}`;
  const glassGradient = `glass-${uid}`;

  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={bodyGradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.72" />
        </linearGradient>
        <linearGradient id={glassGradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="200" cy="222" rx="150" ry="12" fill="rgba(28,25,23,0.10)" />

      {/* Roof rack */}
      <rect x="120" y="42" width="190" height="7" rx="3.5" fill="#1c1917" opacity="0.55" />
      <rect x="132" y="34" width="8" height="10" rx="3" fill="#1c1917" opacity="0.45" />
      <rect x="290" y="34" width="8" height="10" rx="3" fill="#1c1917" opacity="0.45" />

      {/* Body */}
      <path
        d="M 44 188 L 40 122 Q 38 98 52 86 L 66 64 Q 70 52 86 52 L 348 52 Q 366 52 366 70 L 366 178 Q 366 188 354 188 Z"
        fill={`url(#${bodyGradient})`}
        stroke="#1c1917"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Accent stripe along the flank */}
      <path
        d="M 52 150 L 360 150 L 360 164 L 52 164 Z"
        fill="#1c1917"
        opacity="0.14"
      />

      {/* Windscreen */}
      <path
        d="M 60 112 L 72 72 Q 74 66 82 66 L 118 66 L 118 112 Z"
        fill={`url(#${glassGradient})`}
        stroke="#1c1917"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Side windows */}
      <rect
        x="134"
        y="66"
        width="98"
        height="46"
        rx="6"
        fill={`url(#${glassGradient})`}
        stroke="#1c1917"
        strokeWidth="3.5"
      />
      <rect
        x="248"
        y="66"
        width="98"
        height="46"
        rx="6"
        fill={`url(#${glassGradient})`}
        stroke="#1c1917"
        strokeWidth="3.5"
      />

      {/* Sliding-door seam + handle */}
      <path d="M 240 66 L 240 182" stroke="#1c1917" strokeWidth="3" opacity="0.45" />
      <rect x="212" y="126" width="22" height="7" rx="3.5" fill="#1c1917" opacity="0.6" />

      {/* Headlight + indicator */}
      <rect x="40" y="126" width="16" height="16" rx="5" fill="#fde68a" stroke="#1c1917" strokeWidth="3" />
      <rect x="42" y="150" width="12" height="8" rx="3" fill="#fb923c" opacity="0.9" />

      {/* Rear light cluster */}
      <rect x="352" y="120" width="12" height="26" rx="4" fill="#ef4444" stroke="#1c1917" strokeWidth="3" />

      {/* Wheels */}
      <g>
        <circle cx="112" cy="188" r="34" fill="#1c1917" />
        <circle cx="112" cy="188" r="16" fill="#e7e5e4" />
        <circle cx="112" cy="188" r="6" fill="#a8a29e" />
      </g>
      <g>
        <circle cx="300" cy="188" r="34" fill="#1c1917" />
        <circle cx="300" cy="188" r="16" fill="#e7e5e4" />
        <circle cx="300" cy="188" r="6" fill="#a8a29e" />
      </g>
    </svg>
  );
}
