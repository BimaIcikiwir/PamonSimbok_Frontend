// Gunungan sebagai ornamen (siluet saja). Untuk gambar berbentuk gunungan pakai <FoodImage shape="gunungan" />.
export default function Gunungan({ className = "", fill = "currentColor" }) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true">
      <path
        d="M50 0 C53 12 64 19 74 36 C84 53 98 64 98 94 C98 118 88 130 50 130 C12 130 2 118 2 94 C2 64 16 53 26 36 C36 19 47 12 50 0 Z"
        fill={fill}
      />
      <path
        d="M50 30 C52 40 60 46 66 58 C73 70 80 78 80 96 C80 110 72 118 50 118 C28 118 20 110 20 96 C20 78 27 70 34 58 C40 46 48 40 50 30 Z"
        fill="none"
        stroke="rgb(0 0 0 / .22)"
        strokeWidth="2"
      />
      <circle cx="50" cy="82" r="9" fill="none" stroke="rgb(0 0 0 / .22)" strokeWidth="2" />
      <path d="M50 70 L50 94 M38 82 L62 82" stroke="rgb(0 0 0 / .22)" strokeWidth="2" />
    </svg>
  );
}
