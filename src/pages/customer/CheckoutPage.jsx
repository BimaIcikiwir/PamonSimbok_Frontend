import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderApi } from "../../api";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { Input, PilihanKartu, Field } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { formatRupiah } from "../../lib/format";
import { errorPerKolom, pesanError } from "../../lib/errors";
import { recentOrders } from "../../lib/constants";
import { siapkanBunyi } from "../../lib/bunyi";

const NAMA_KEY = "simbok.nama";

export default function CheckoutPage() {
  const cart = useCart();
  const nav = useNavigate();
  const toast = useToast();

  const [nama, setNama] = useState(() => localStorage.getItem(NAMA_KEY) || "");
  const [jenis, setJenis] = useState(cart.meja ? "DINE_IN" : "TAKE_AWAY");
  const [meja, setMeja] = useState(cart.meja ? String(cart.meja) : "");
  const [bayar, setBayar] = useState("QRIS");
  const [notif, setNotif] = useState("SOUND");
  const [kirim, setKirim] = useState(false);
  const [galat, setGalat] = useState({});
  const [pesanGalat, setPesanGalat] = useState("");

  if (cart.items.length === 0)
    return (
      <EmptyState judul="Keranjang masih kosong" aksi={<Link to="/menu" className="rounded-full border-2 border-soga-900 bg-emas-400 px-6 py-2.5 font-display font-bold shadow-timbul">Pilih menu</Link>}>
        Tambahkan masakan dulu sebelum membayar.
      </EmptyState>
    );

  async function submit(e) {
    e.preventDefault();
    setGalat({});
    setPesanGalat("");
    if (jenis === "DINE_IN" && !Number(meja)) {
      setGalat({ tableNumber: "Isi nomor meja kamu" });
      return;
    }
    setKirim(true);
    siapkanBunyi(); // klik ini membuka izin bunyi untuk notifikasi "siap"
    try {
      const order = await orderApi.createOrder({
        customerName: nama.trim(),
        orderType: jenis,
        ...(jenis === "DINE_IN" ? { tableNumber: Number(meja) } : {}),
        paymentMethod: bayar,
        notifyPreference: notif,
        items: cart.items.map((i) => ({
          menuItemId: i.id,
          quantity: i.quantity,
          ...(i.note?.trim() ? { note: i.note.trim() } : {}),
        })),
      });
      localStorage.setItem(NAMA_KEY, nama.trim());
      recentOrders.add(order);
      cart.kosongkan();
      nav(`/pesanan/${order.code}`, { replace: true });
    } catch (err) {
      if (err.code === "MENU_UNAVAILABLE" && Array.isArray(err.errors)) {
        cart.buang(err.errors.map((x) => x.menuItemId));
        setPesanGalat(`${err.message}. Menu tersebut sudah dikeluarkan dari keranjang.`);
      } else if (err.code === "TABLE_NOT_FOUND") {
        setGalat({ tableNumber: err.message });
      } else {
        setGalat(errorPerKolom(err));
        setPesanGalat(pesanError(err));
      }
      toast.gagal("Pesanan belum bisa dibuat");
    } finally {
      setKirim(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-7">
        <h1 className="text-4xl font-extrabold">Pembayaran</h1>

        {pesanGalat && (
          <p role="alert" className="rounded-2xl border-2 border-sambal-500 bg-sambal-100 px-4 py-3 font-semibold text-sambal-500">
            {pesanGalat}
          </p>
        )}

        <Input label="Nama untuk dipanggil" value={nama} onChange={(e) => setNama(e.target.value)} maxLength={40} required placeholder="mis. Budi" error={galat.customerName} autoComplete="given-name" />

        <Field label="Makan di mana?">
          <PilihanKartu
            nilai={jenis}
            onChange={setJenis}
            pilihan={[
              { value: "DINE_IN", label: "Makan di sini", desc: "Diantar ke mejamu" },
              { value: "TAKE_AWAY", label: "Bawa pulang", desc: "Ambil di kasir" },
            ]}
          />
        </Field>

        {jenis === "DINE_IN" && (
          <Input label="Nomor meja" type="number" inputMode="numeric" min={1} value={meja} onChange={(e) => setMeja(e.target.value)} error={galat.tableNumber} placeholder="mis. 5" />
        )}

        <Field label="Cara membayar">
          <PilihanKartu
            nilai={bayar}
            onChange={setBayar}
            pilihan={[
              { value: "QRIS", label: "QRIS", desc: "Bayar sekarang dari ponsel" },
              { value: "CASH", label: "Tunai", desc: "Bayar di kasir" },
            ]}
          />
        </Field>

        <Field label="Beri tahu saat pesanan siap lewat" hint="Pemberitahuan muncul di halaman status pesanan.">
          <PilihanKartu
            nilai={notif}
            onChange={setNotif}
            pilihan={[
              { value: "SOUND", label: "Bunyi", desc: "Layar berbunyi" },
              { value: "MESSAGE", label: "Pesan", desc: "Tulisan di layar" },
            ]}
          />
        </Field>
      </div>

      <aside className="h-fit rounded-[2rem] border-2 border-soga-800 bg-white p-6 shadow-kartu lg:sticky lg:top-24">
        <h2 className="text-2xl font-bold">Ringkasan</h2>
        <ul className="mt-3 divide-y divide-dashed divide-soga-200">
          {cart.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3 py-2.5">
              <div>
                <p className="font-semibold">
                  {i.quantity}× {i.name}
                </p>
                {i.note && <p className="text-sm italic text-soga-500">“{i.note}”</p>}
              </div>
              <p className="font-display font-bold">{formatRupiah(i.price * i.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex items-baseline justify-between border-t-2 border-soga-800 pt-3">
          <span className="font-display font-bold">Total</span>
          <span className="font-display text-3xl font-extrabold">{formatRupiah(cart.subtotal)}</span>
        </div>
        <Button type="submit" ukuran="lg" className="mt-5 w-full" loading={kirim}>
          {bayar === "QRIS" ? "Buat pesanan dan bayar QRIS" : "Buat pesanan"}
        </Button>
        <p className="mt-3 text-center text-xs text-soga-400">Harga dihitung ulang oleh server saat pesanan dibuat.</p>
      </aside>
    </form>
  );
}
