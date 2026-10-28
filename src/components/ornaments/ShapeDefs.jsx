// Definisi clip-path SVG global (dipasang sekali di App). Dipakai lewat style={{ clipPath: "url(#klip-gunungan)" }}
export default function ShapeDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        {/* Gunungan wayang: puncak lancip, bahu melebar */}
        <clipPath id="klip-gunungan" clipPathUnits="objectBoundingBox">
          <path d="M0.5 0 C0.53 0.09 0.64 0.15 0.74 0.28 C0.84 0.41 0.98 0.5 0.98 0.72 C0.98 0.9 0.88 1 0.5 1 C0.12 1 0.02 0.9 0.02 0.72 C0.02 0.5 0.16 0.41 0.26 0.28 C0.36 0.15 0.47 0.09 0.5 0 Z" />
        </clipPath>
        {/* Daun pisang: lonjong runcing di dua ujung */}
        <clipPath id="klip-daun" clipPathUnits="objectBoundingBox">
          <path d="M0.04 0.96 C0.02 0.5 0.3 0.06 0.96 0.04 C0.98 0.5 0.7 0.94 0.04 0.96 Z" />
        </clipPath>
        {/* Bunga/lotus bersudut delapan lengkung */}
        <clipPath id="klip-bunga" clipPathUnits="objectBoundingBox">
          <path d="M0.5 0.02 C0.62 0.02 0.66 0.14 0.75 0.14 C0.86 0.14 0.86 0.26 0.86 0.3 C0.9 0.36 0.98 0.4 0.98 0.5 C0.98 0.6 0.9 0.64 0.86 0.7 C0.86 0.74 0.86 0.86 0.75 0.86 C0.66 0.86 0.62 0.98 0.5 0.98 C0.38 0.98 0.34 0.86 0.25 0.86 C0.14 0.86 0.14 0.74 0.14 0.7 C0.1 0.64 0.02 0.6 0.02 0.5 C0.02 0.4 0.1 0.36 0.14 0.3 C0.14 0.26 0.14 0.14 0.25 0.14 C0.34 0.14 0.38 0.02 0.5 0.02 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
