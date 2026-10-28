import { useState } from "react";
import { useEffect } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { tableApi } from "../api";
import { useCart } from "../context/CartContext";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "../components/order/CartDrawer";
import FloatingCart from "../components/order/FloatingCart";

export default function CustomerLayout() {
  const [keranjang, setKeranjang] = useState(false);
  const [params] = useSearchParams();
  const { setMeja } = useCart();

  // QR di meja mengarah ke /?meja=5 -> simpan nomor meja setelah dicek ke BE
  useEffect(() => {
    const n = Number(params.get("meja"));
    if (!Number.isInteger(n) || n <= 0) return;
    tableApi
      .getTable(n)
      .then((t) => setMeja(t.number))
      .catch(() => {});
  }, [params, setMeja]);
  return (
    <div className="flex min-h-dvh flex-col">
      <Header onBukaKeranjang={() => setKeranjang(true)} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-8">
        <Outlet context={{ bukaKeranjang: () => setKeranjang(true) }} />
      </main>
      <FloatingCart onBuka={() => setKeranjang(true)} />
      <CartDrawer buka={keranjang} onTutup={() => setKeranjang(false)} />
      <Footer />
    </div>
  );
}
