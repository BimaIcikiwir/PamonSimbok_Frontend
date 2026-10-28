import FoodImage from "../ornaments/FoodImage";
import { formatRupiah } from "../../lib/format";
import { useCart } from "../../context/CartContext";

const BENTUK = ["bulat", "gunungan", "batu", "bunga", "kori", "daun"];

export default function MenuCard({ item, kategori, indeks = 0 }) {
  const { items, tambah, ubahJumlah } = useCart();
  const di = items.find((i) => i.id === item.id);
  const habis = !item.isAvailable;

  return (
    <article className={`relative flex flex-col rounded-[2rem] border-2 bg-white px-5 pb-5 pt-0 shadow-kartu ${habis ? "border-soga-100" : "border-soga-200"}`}>
      <div className={`-mt-8 mb-3 self-center ${habis ? "grayscale" : ""}`}>
        <FoodImage
          src={item.imageUrl}
          alt={item.name}
          kategori={kategori}
          aksen={indeks}
          shape={BENTUK[indeks % BENTUK.length]}
          className="w-36 border-[3px] border-soga-800 shadow-timbul"
        />
      </div>
      {habis && (
        <span className="absolute right-4 top-4 rotate-6 rounded-full border-2 border-soga-900 bg-sambal-500 px-3 py-0.5 font-display text-sm font-bold text-white">
          Habis
        </span>
      )}

      <h3 className="text-xl font-bold">{item.name}</h3>
      <p className="mt-1 min-h-[2.75rem] text-sm leading-snug text-soga-500">{item.description || "Dimasak langsung saat dipesan."}</p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="font-display text-xl font-extrabold text-soga-700">{formatRupiah(item.price)}</p>
        {habis ? (
          <span className="text-sm font-semibold text-soga-400">Belum tersedia</span>
        ) : di ? (
          <div className="flex items-center gap-1 rounded-full border-2 border-soga-800 bg-emas-200 p-0.5">
            <button onClick={() => ubahJumlah(item.id, -1)} className="grid h-8 w-8 place-items-center rounded-full font-display text-lg font-bold hover:bg-emas-300" aria-label={`Kurangi ${item.name}`}>
              −
            </button>
            <span className="min-w-6 text-center font-display font-bold" aria-live="polite">
              {di.quantity}
            </span>
            <button onClick={() => ubahJumlah(item.id, 1)} className="grid h-8 w-8 place-items-center rounded-full font-display text-lg font-bold hover:bg-emas-300" aria-label={`Tambah ${item.name}`}>
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => tambah({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl, kategori })}
            className="rounded-full border-2 border-soga-900 bg-emas-400 px-4 py-1.5 font-display font-bold text-soga-900 shadow-timbul transition hover:bg-emas-300 active:translate-y-[3px] active:shadow-none"
          >
            Pesan
          </button>
        )}
      </div>
    </article>
  );
}
