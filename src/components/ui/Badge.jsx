const NADA = {
  emas: "bg-emas-200 text-soga-800 ring-emas-500",
  sogan: "bg-soga-100 text-soga-700 ring-soga-300",
  daun: "bg-daun-100 text-daun-700 ring-daun-300",
  sambal: "bg-sambal-100 text-sambal-500 ring-sambal-500/40",
  netral: "bg-gading-200 text-soga-600 ring-soga-200",
};
export default function Badge({ nada = "netral", className = "", children }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${NADA[nada]} ${className}`}>
      {children}
    </span>
  );
}
