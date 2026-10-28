import { useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatRupiah } from "../../lib/format";

// Bilah keranjang di bawah layar (ponsel) saat memilih menu
export default function FloatingCart({ onBuka }) {
  const { jumlah, subtotal } = useCart();
  const { pathname } = useLocation();
  if (jumlah === 0 || pathname !== "/menu") return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-4 pt-8 md:hidden">
      <button
        onClick={onBuka}
        className="pointer-events-auto flex w-full items-center justify-between rounded-full border-2 border-soga-900 bg-soga-800 px-5 py-3 text-gading-50 shadow-kartu"
      >
        <span className="font-display font-bold">{jumlah} menu dipilih</span>
        <span className="font-display text-lg font-extrabold text-emas-300">{formatRupiah(subtotal)}</span>
      </button>
    </div>
  );
}
