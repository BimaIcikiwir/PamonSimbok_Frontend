const LANGKAH = [
  { key: "PAID", label: "Dibayar" },
  { key: "COOK", label: "Dimasak" },
  { key: "READY", label: "Siap" },
  { key: "COMPLETED", label: "Selesai" },
];

// Indeks langkah yang sedang berjalan per status BE
const POSISI = { PENDING: -1, PAID: 1, READY: 2, COMPLETED: 3, EXPIRED: -1 };

export default function OrderProgress({ status }) {
  const pos = POSISI[status] ?? -1;
  return (
    <ol className="flex items-start" aria-label="Tahap pesanan">
      {LANGKAH.map((l, i) => {
        const selesai = i < pos || status === "COMPLETED";
        const aktif = i === pos && status !== "COMPLETED";
        return (
          <li key={l.key} className="relative flex flex-1 flex-col items-center gap-1.5 text-center">
            {i > 0 && (
              <span
                aria-hidden="true"
                className={`absolute right-1/2 top-4 h-1 w-full rounded-full ${i <= pos || status === "COMPLETED" ? "bg-daun-500" : "bg-soga-100"}`}
              />
            )}
            <span
              className={`relative z-10 grid h-9 w-9 place-items-center rounded-full border-2 font-display font-bold ${
                selesai
                  ? "border-daun-700 bg-daun-500 text-white"
                  : aktif
                    ? "animate-ketuk border-soga-900 bg-emas-400 text-soga-900"
                    : "border-soga-200 bg-white text-soga-300"
              }`}
              aria-current={aktif ? "step" : undefined}
            >
              {selesai ? "✓" : i + 1}
            </span>
            <span className={`text-xs font-semibold ${selesai || aktif ? "text-soga-800" : "text-soga-300"}`}>{l.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
