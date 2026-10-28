import { useMemo, useState } from "react";
import { cashierApi, menuApi } from "../../api";
import useAsync from "../../hooks/useAsync";
import useLiveEvents from "../../hooks/useLiveEvents";
import { useToast } from "../../context/ToastContext";
import { formatRupiah } from "../../lib/format";
import { errorPerKolom, pesanError } from "../../lib/errors";
import { Input, Field, PilihanKartu } from "../../components/ui/Field";
import Button, { Spinner } from "../../components/ui/Button";
import FoodImage from "../../components/ornaments/FoodImage";

const BENTUK = ["bulat", "bunga", "batu", "gunungan"];

export default function PosPage() {
  const toast = useToast();
  const { data: menu, loading, muat } = useAsync(menuApi.getMenu, []);
  useLiveEvents((e) => e === "menu.updated" && muat(true));

  const [cari, setCari] = useState("");
  const [keranjang, setKeranjang] = useState({}); // id -> { item, quantity, note }
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState("TAKE_AWAY");
  const [meja, setMeja] = useState("");
  const [notif, setNotif] = useState("SOUND");
  const [kirim, setKirim] = useState(false);
  const [galat, setGalat] = useState({});

  const baris = Object.values(keranjang);
  const total = baris.reduce((n, b) => n + b.item.price * b.quantity, 0);

  const daftar = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return (menu || [])
      .map((c) => ({ ...c, items: c.items.filter((i) => !q || i.name.toLowerCase().includes(q)) }))
      .filter((c) => c.items.length);
  }, [menu, cari]);

  const ubah = (item, delta) =>
    setKeranjang((k) => {
      const q = (k[item.id]?.quantity || 0) + delta;
      const { [item.id]: _, ...sisa } = k;
      return q <= 0 ? sisa : { ...k, [item.id]: { item, quantity: Math.min(50, q), note: k[item.id]?.note || "" } };
    });

  async function submit(e) {
    e.preventDefault();
    setGalat({});
    if (baris.length === 0) return toast.gagal("Pilih minimal 1 menu");
    if (jenis === "DINE_IN" && !Number(meja)) return setGalat({ tableNumber: "Isi nomor meja" });
    setKirim(true);
    try {
      const o = await cashierApi.createManualOrder({
        customerName: nama.trim(),
        orderType: jenis,
        ...(jenis === "DINE_IN" ? { tableNumber: Number(meja) } : {}),
        notifyPreference: notif,
        items: baris.map((b) => ({ menuItemId: b.item.id, quantity: b.quantity, ...(b.note.trim() ? { note: b.note.trim() } : {}) })),
      });
      toast.ok(`Pesanan ${o.queueLabel} dibuat dan sudah lunas (kode ${o.code})`);
      setKeranjang({});
      setNama("");
      setMeja("");
    } catch (err) {
      setGalat(errorPerKolom(err));
      toast.gagal(pesanError(err));
      if (err.code === "MENU_UNAVAILABLE") muat(true);
    } finally {
      setKirim(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-4xl font-extrabold">Pesanan manual</h1>
            <p className="text-soga-500">Untuk pelanggan yang memesan langsung di kasir. Dibayar tunai dan langsung masuk dapur.</p>
          </div>
          <input type="search" value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari menu…" aria-label="Cari menu" className="w-56 rounded-full border-2 border-soga-200 bg-white px-5 py-2 focus:border-emas-500 focus:outline-none" />
        </div>
        {loading && <Spinner className="mx-auto my-16 block text-soga-500" />}
        <div className="space-y-6">
          {daftar.map((c) => (
            <div key={c.id}>
              <h2 className="mb-2 text-xl font-bold">{c.name}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {c.items.map((i, idx) => {
                  const q = keranjang[i.id]?.quantity || 0;
                  return (
                    <li key={i.id} className={`flex items-center gap-3 rounded-full border-2 bg-white p-2 pr-3 ${q ? "border-soga-800" : "border-soga-200"} ${i.isAvailable ? "" : "opacity-50"}`}>
                      <FoodImage src={i.imageUrl} alt={i.name} kategori={c.name} aksen={idx} shape={BENTUK[idx % 4]} className="w-14 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display font-bold leading-tight">{i.name}</p>
                        <p className="text-sm text-soga-500">{i.isAvailable ? formatRupiah(i.price) : "Habis"}</p>
                      </div>
                      {i.isAvailable &&
                        (q ? (
                          <div className="flex items-center gap-1 rounded-full bg-emas-200 p-0.5">
                            <button type="button" onClick={() => ubah(i, -1)} className="grid h-8 w-8 place-items-center rounded-full font-bold hover:bg-emas-300" aria-label={`Kurangi ${i.name}`}>−</button>
                            <span className="min-w-5 text-center font-display font-bold">{q}</span>
                            <button type="button" onClick={() => ubah(i, 1)} className="grid h-8 w-8 place-items-center rounded-full font-bold hover:bg-emas-300" aria-label={`Tambah ${i.name}`}>+</button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => ubah(i, 1)} className="rounded-full border-2 border-soga-900 bg-emas-400 px-4 py-1 font-display font-bold shadow-[0_2px_0_0_var(--color-soga-900)] hover:bg-emas-300">
                            Tambah
                          </button>
                        ))}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <aside className="h-fit space-y-5 rounded-[2rem] border-2 border-soga-800 bg-white p-6 shadow-kartu xl:sticky xl:top-24">
        <h2 className="text-2xl font-bold">Rincian pesanan</h2>
        <Input label="Nama pelanggan" value={nama} onChange={(e) => setNama(e.target.value)} maxLength={40} required error={galat.customerName} />
        <Field label="Jenis">
          <PilihanKartu nilai={jenis} onChange={setJenis} pilihan={[{ value: "TAKE_AWAY", label: "Bawa pulang" }, { value: "DINE_IN", label: "Makan di sini" }]} />
        </Field>
        {jenis === "DINE_IN" && <Input label="Nomor meja" type="number" min={1} value={meja} onChange={(e) => setMeja(e.target.value)} error={galat.tableNumber} />}
        <Field label="Panggil pelanggan lewat">
          <PilihanKartu nilai={notif} onChange={setNotif} pilihan={[{ value: "SOUND", label: "Bunyi" }, { value: "MESSAGE", label: "Pesan" }]} />
        </Field>

        {baris.length > 0 && (
          <ul className="divide-y divide-dashed divide-soga-200 border-t-2 border-soga-100">
            {baris.map((b) => (
              <li key={b.item.id} className="py-2">
                <div className="flex justify-between gap-2">
                  <span className="font-semibold">{b.quantity}× {b.item.name}</span>
                  <span className="font-display font-bold">{formatRupiah(b.item.price * b.quantity)}</span>
                </div>
                <input value={b.note} onChange={(e) => setKeranjang((k) => ({ ...k, [b.item.id]: { ...b, note: e.target.value } }))} placeholder="Catatan" maxLength={200} aria-label={`Catatan ${b.item.name}`} className="mt-1 w-full rounded-full border-2 border-soga-100 px-3 py-1 text-sm focus:border-emas-500 focus:outline-none" />
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-baseline justify-between border-t-2 border-soga-800 pt-3">
          <span className="font-display font-bold">Total tunai</span>
          <span className="font-display text-3xl font-extrabold">{formatRupiah(total)}</span>
        </div>
        <Button type="submit" ukuran="lg" className="w-full" loading={kirim} disabled={baris.length === 0}>
          Terima tunai dan buat pesanan
        </Button>
      </aside>
    </form>
  );
}
