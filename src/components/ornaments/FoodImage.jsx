import { KATEGORI_AKSEN } from "../../lib/constants";

// Bentuk gambar: tidak ada yang kotak.
const BENTUK = {
  bulat: { className: "rounded-full" },
  kori: { className: "bentuk-kori" },
  batu: { className: "bentuk-batu" },
  gunungan: { style: { clipPath: "url(#klip-gunungan)" } },
  daun: { style: { clipPath: "url(#klip-daun)" } },
  bunga: { style: { clipPath: "url(#klip-bunga)" } },
};

function Ikon({ jenis }) {
  // Ikon sederhana digambar dari bentuk dasar
  if (jenis === "minuman")
    return (
      <g>
        <path d="M34 34 L66 34 L61 76 Q60.5 80 56 80 L44 80 Q39.5 80 39 76 Z" fill="#fff8e6" stroke="#3e1b0c" strokeWidth="3" strokeLinejoin="round" />
        <path d="M36.5 52 L63.5 52 L61 76 Q60.5 80 56 80 L44 80 Q39.5 80 39 76 Z" fill="#c98512" opacity=".85" />
        <path d="M56 34 L64 18" stroke="#4b7226" strokeWidth="4" strokeLinecap="round" />
        <circle cx="46" cy="60" r="3" fill="#fff8e6" opacity=".7" />
      </g>
    );
  if (jenis === "jajanan")
    return (
      <g>
        <ellipse cx="50" cy="66" rx="26" ry="9" fill="#a56a3a" stroke="#3e1b0c" strokeWidth="3" />
        <path d="M30 60 Q33 40 50 40 Q67 40 70 60 Q60 68 50 68 Q40 68 30 60 Z" fill="#f6bd3a" stroke="#3e1b0c" strokeWidth="3" strokeLinejoin="round" />
        <path d="M40 52 Q50 46 60 52" fill="none" stroke="#c98512" strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  // makanan: mangkuk beruap
  return (
    <g>
      <path d="M24 50 L76 50 Q76 76 50 78 Q24 76 24 50 Z" fill="#fff8e6" stroke="#3e1b0c" strokeWidth="3" strokeLinejoin="round" />
      <path d="M27 52 Q50 44 73 52 L73 54 Q50 62 27 54 Z" fill="#c98512" opacity=".9" />
      <circle cx="42" cy="49" r="3" fill="#4b7226" />
      <circle cx="55" cy="47" r="3.4" fill="#c4402f" />
      <path d="M40 82 L60 82" stroke="#3e1b0c" strokeWidth="3" strokeLinecap="round" />
      <path d="M38 40 Q35 33 39 27 M50 38 Q47 30 51 23 M62 40 Q59 33 63 27" fill="none" stroke="#3e1b0c" strokeWidth="2.5" strokeLinecap="round" opacity=".45" />
    </g>
  );
}

function jenisDari(kategori = "") {
  const k = kategori.toLowerCase();
  if (k.includes("minum")) return "minuman";
  if (k.includes("jajan") || k.includes("camil") || k.includes("gorengan")) return "jajanan";
  return "makanan";
}

/**
 * Gambar menu. Jika imageUrl ada -> foto, dipotong sesuai bentuk.
 * Jika kosong -> ilustrasi placeholder dengan cincin batik, juga sesuai bentuk.
 */
export default function FoodImage({ src, alt = "", kategori, aksen = 0, shape = "bulat", className = "" }) {
  const b = BENTUK[shape] || BENTUK.bulat;
  const warna = KATEGORI_AKSEN[aksen % KATEGORI_AKSEN.length];
  const jenis = jenisDari(kategori);

  return (
    <div
      className={`relative aspect-square overflow-hidden bg-emas-100 ${b.className || ""} ${className}`}
      style={b.style}
      role={src ? undefined : "img"}
      aria-label={src ? undefined : `Gambar contoh ${alt}`}
    >
      {src ? (
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="100" height="100" fill="#fdf1d6" />
          {/* cincin batik */}
          <g opacity=".5" stroke={warna} fill="none" strokeWidth="1.2">
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse key={i} cx="50" cy="12" rx="5" ry="9" transform={`rotate(${i * 30} 50 50)`} />
            ))}
          </g>
          <circle cx="50" cy="50" r="30" fill="#fffaf0" stroke={warna} strokeWidth="1.6" strokeDasharray="2 3.5" />
          <Ikon jenis={jenis} />
        </svg>
      )}
    </div>
  );
}
