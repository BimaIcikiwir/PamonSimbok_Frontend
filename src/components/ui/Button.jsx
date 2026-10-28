const VARIAN = {
  emas: "bg-emas-400 text-soga-900 border-soga-800 shadow-timbul hover:bg-emas-300 active:translate-y-[3px] active:shadow-none",
  soga: "bg-soga-800 text-gading-50 border-soga-900 hover:bg-soga-700",
  daun: "bg-daun-600 text-white border-daun-700 shadow-[0_3px_0_0_var(--color-daun-700)] hover:bg-daun-500 active:translate-y-[3px] active:shadow-none",
  garis: "bg-transparent text-soga-800 border-soga-300 hover:bg-soga-50",
  bahaya: "bg-sambal-500 text-white border-soga-900 hover:bg-sambal-500/90",
  hantu: "bg-transparent text-soga-700 border-transparent hover:bg-soga-100",
};
const UKURAN = { sm: "px-3.5 py-1.5 text-sm", md: "px-5 py-2.5 text-base", lg: "px-7 py-3.5 text-lg" };

export default function Button({ varian = "emas", ukuran = "md", loading, className = "", children, disabled, ...rest }) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 font-display font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIAN[varian]} ${UKURAN[ukuran]} ${className}`}
      {...rest}
    >
      {loading && <Spinner kecil />}
      {children}
    </button>
  );
}

export function Spinner({ kecil, className = "" }) {
  return (
    <span
      role="status"
      aria-label="Memuat"
      className={`inline-block animate-spin rounded-full border-current border-t-transparent ${kecil ? "h-4 w-4 border-2" : "h-8 w-8 border-4"} ${className}`}
    />
  );
}
