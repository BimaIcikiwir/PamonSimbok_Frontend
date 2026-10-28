import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatRupiah } from "../../lib/format";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import FoodImage from "../ornaments/FoodImage";

export default function CartDrawer({ buka, onTutup }) {
  const { items, subtotal, ubahJumlah, setCatatan, hapus } = useCart();
  const ref = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (buka && !el.open) el.showModal();
    if (!buka && el.open) el.close();
  }, [buka]);

  return (
    <dialog
      ref={ref}
      onClose={onTutup}
      onClick={(e) => e.target === ref.current && onTutup()}
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-md overflow-hidden border-l-4 border-soga-800 bg-gading-50 p-0 text-soga-800 backdrop:bg-soga-900/60"
    >
      {buka && (
        <div className="flex h-full flex-col">
          <div className="batik-parang h-3 shrink-0 bg-soga-800" aria-hidden="true" />
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-2xl font-bold">Keranjang</h2>
            <button onClick={onTutup} aria-label="Tutup keranjang" className="grid h-9 w-9 place-items-center rounded-full text-xl hover:bg-soga-100">
              ×
            </button>
          </div>

          <div className="scroll-halus flex-1 overflow-y-auto px-5">
            {items.length === 0 ? (
              <EmptyState
                judul="Keranjang masih kosong"
                aksi={
                  <Button
                    onClick={() => {
                      onTutup();
                      nav("/menu");
                    }}
                  >
                    Lihat menu
                  </Button>
                }
              >
                Pilih masakan dari menu, nanti muncul di sini.
              </EmptyState>
            ) : (
              <ul className="space-y-4 pb-4">
                {items.map((i, idx) => (
                  <li key={i.id} className="rounded-3xl border-2 border-soga-200 bg-white p-3">
                    <div className="flex gap-3">
                      <FoodImage src={i.imageUrl} alt={i.name} kategori={i.kategori} aksen={idx} shape="bulat" className="w-16 shrink-0 border-2 border-soga-800" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-display font-bold leading-tight">{i.name}</p>
                          <button onClick={() => hapus(i.id)} className="text-xs font-semibold text-sambal-500 hover:underline">
                            Hapus
                          </button>
                        </div>
                        <p className="text-sm text-soga-500">{formatRupiah(i.price)}</p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border-2 border-soga-800 bg-emas-200 p-0.5">
                            <button onClick={() => ubahJumlah(i.id, -1)} className="grid h-7 w-7 place-items-center rounded-full font-bold hover:bg-emas-300" aria-label={`Kurangi ${i.name}`}>
                              −
                            </button>
                            <span className="min-w-6 text-center font-display font-bold">{i.quantity}</span>
                            <button onClick={() => ubahJumlah(i.id, 1)} className="grid h-7 w-7 place-items-center rounded-full font-bold hover:bg-emas-300" aria-label={`Tambah ${i.name}`}>
                              +
                            </button>
                          </div>
                          <p className="font-display font-extrabold">{formatRupiah(i.price * i.quantity)}</p>
                        </div>
                      </div>
                    </div>
                    <input
                      value={i.note}
                      maxLength={200}
                      onChange={(e) => setCatatan(i.id, e.target.value)}
                      placeholder="Catatan, mis. tidak pedas"
                      aria-label={`Catatan untuk ${i.name}`}
                      className="mt-2.5 w-full rounded-full border-2 border-soga-100 bg-gading-50 px-4 py-1.5 text-sm placeholder:text-soga-300 focus:border-emas-500 focus:outline-none"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="shrink-0 border-t-2 border-soga-200 bg-white px-5 py-4">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-soga-500">Subtotal</span>
                <span className="font-display text-2xl font-extrabold">{formatRupiah(subtotal)}</span>
              </div>
              <Button
                ukuran="lg"
                className="w-full"
                onClick={() => {
                  onTutup();
                  nav("/checkout");
                }}
              >
                Lanjut ke pembayaran
              </Button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
