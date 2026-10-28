import { useCallback, useEffect, useMemo, useState } from "react";
import { cashierApi } from "../../api";
import useLiveEvents from "../../hooks/useLiveEvents";
import { hariIni } from "../../lib/format";
import { pesanError } from "../../lib/errors";
import AdminOrderCard from "../../components/order/AdminOrderCard";
import EmptyState from "../../components/ui/EmptyState";
import Button, { Spinner } from "../../components/ui/Button";

// Sesuaikan nama field & nilainya dengan data order dari backend kamu
const metodeBayar = (o) => String(o.paymentMethod ?? "").toUpperCase();
const bayarTunai = (o) => metodeBayar(o) === "CASH";
const bayarEwallet = (o) => metodeBayar(o) !== "CASH"; // selain tunai dianggap e-wallet/QRIS

// riwayat: true -> tampil di bagian "Riwayat hari ini" (di bawah papan utama)
const KOLOM = [
  {
    key: "tunai",
    label: "Bayar tunai",
    cocok: (o) => o.status === "PENDING" && bayarTunai(o),
    hint: "Terima uang di kasir, lalu tandai dibayar.",
  },
  {
    key: "ewallet",
    label: "Bayar e-wallet",
    cocok: (o) => o.status === "PENDING" && bayarEwallet(o),
    hint: "Menunggu pelanggan membayar lewat e-wallet.",
  },
  {
    key: "masak",
    label: "Dimasak",
    cocok: (o) => o.status === "PAID",
    hint: "Sudah dibayar, dapur mengerjakan.",
  },
  {
    key: "siap",
    label: "Siap diambil",
    cocok: (o) => o.status === "READY",
    hint: "Tunggu pelanggan, lalu selesaikan.",
  },
  {
    key: "selesai",
    label: "Selesai",
    riwayat: true,
    panel: "border-green-600/40 bg-green-50",
    header: "bg-green-700 text-white",
    badge: "bg-white text-green-800",
    ikon: "✓",
    cocok: (o) => o.status === "COMPLETED",
    hint: "Pesanan yang sudah diambil hari ini.",
  },
  {
    key: "kadaluarsa",
    label: "Kadaluarsa",
    riwayat: true,
    panel: "border-sambal-500/40 bg-sambal-100/60",
    header: "bg-sambal-500 text-white",
    badge: "bg-white text-sambal-500",
    ikon: "✕",
    cocok: (o) => o.status === "EXPIRED",
    hint: "Pembayaran tidak selesai tepat waktu.",
  },
];

function Kolom({ k, tab, now, onUbah, riwayat }) {
  const visibilitas = `${tab === k.key ? "block" : "hidden"} min-w-0 xl:block`;

  if (riwayat) {
    // Setiap grup riwayat dibungkus panel berwarna sendiri supaya jelas batasnya
    return (
      <section
        className={`${visibilitas} rounded-3xl border-2 p-4 ${k.panel}`}
        aria-label={k.label}
      >
        <header
          className={`mb-4 flex items-center gap-2 rounded-full px-4 py-2 ${k.header}`}
        >
          <span aria-hidden="true" className="font-bold">
            {k.ikon}
          </span>
          <h2 className="flex-1 font-display text-lg font-bold">{k.label}</h2>
          <span
            className={`grid h-7 min-w-7 place-items-center rounded-full px-2 font-display font-bold ${k.badge}`}
          >
            {k.items.length}
          </span>
        </header>
        {k.items.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-current/20 bg-white/60 px-4 py-8 text-center text-sm text-soga-400">
            {k.hint}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {k.items.map((o) => (
              <AdminOrderCard key={o.id} order={o} now={now} onUbah={onUbah} />
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className={visibilitas} aria-label={k.label}>
      <header className="mb-3 flex items-center gap-2 rounded-full bg-soga-800 px-4 py-2 text-gading-50">
        <h2 className="flex-1 font-display text-lg font-bold">{k.label}</h2>
        <span className="grid h-7 min-w-7 place-items-center rounded-full bg-emas-400 px-2 font-display font-bold text-soga-900">
          {k.items.length}
        </span>
      </header>
      {k.items.length === 0 ? (
        <p className="rounded-3xl border-2 border-dashed border-soga-200 px-4 py-8 text-center text-sm text-soga-400">
          {k.hint}
        </p>
      ) : (
        <div className="space-y-4">
          {k.items.map((o) => (
            <AdminOrderCard key={o.id} order={o} now={now} onUbah={onUbah} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function OrdersPage() {
  const [tanggal, setTanggal] = useState(hariIni());
  const [cari, setCari] = useState("");
  const [orders, setOrders] = useState(null);
  const [galat, setGalat] = useState("");
  const [tab, setTab] = useState("tunai");
  const [now, setNow] = useState(Date.now());

  const muat = useCallback(() => {
    cashierApi
      .listOrders({
        date: tanggal,
        limit: 200,
        search: cari.trim() || undefined,
      })
      .then((r) => {
        setOrders(r.data);
        setGalat("");
      })
      .catch((e) => setGalat(pesanError(e)));
  }, [tanggal, cari]);

  useEffect(() => {
    setOrders(null);
    const t = setTimeout(muat, cari ? 350 : 0);
    return () => clearTimeout(t);
  }, [muat, cari]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const upsert = useCallback((o) => {
    setOrders((list) => {
      if (!list) return list;
      const ada = list.some((x) => x.id === o.id);
      const baru = ada
        ? list.map((x) => (x.id === o.id ? o : x))
        : [...list, o];
      return baru.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });
  }, []);

  // Event realtime: hanya berlaku untuk tanggal hari ini & tanpa kata kunci pencarian
  useLiveEvents((event, data) => {
    if (event === "menu.updated") return;
    if (tanggal !== hariIni() || cari) return;
    upsert(data);
  });

  const perKolom = useMemo(() => {
    const list = orders || [];
    return KOLOM.map((k) => ({ ...k, items: list.filter(k.cocok) }));
  }, [orders]);

  const aktif = perKolom.filter((k) => !k.riwayat);
  const riwayat = perKolom.filter((k) => k.riwayat);
  const tabAktif = aktif.some((k) => k.key === tab);
  const tabRiwayat = riwayat.some((k) => k.key === tab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold">Pesanan masuk</h1>
          <p className="text-soga-500">
            Urutan dari yang paling lama, supaya dapur adil.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama, kode, atau #antrean"
            aria-label="Cari pesanan"
            className="w-64 rounded-full border-2 border-soga-200 bg-white px-5 py-2 focus:border-emas-500 focus:outline-none"
          />
          <input
            type="date"
            value={tanggal}
            max={hariIni()}
            onChange={(e) => e.target.value && setTanggal(e.target.value)}
            aria-label="Tanggal"
            className="rounded-full border-2 border-soga-200 bg-white px-4 py-2 focus:border-emas-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Tab untuk layar kecil */}
      <div
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 xl:hidden"
        role="tablist"
      >
        {perKolom.map((k) => (
          <button
            key={k.key}
            role="tab"
            aria-selected={tab === k.key}
            onClick={() => setTab(k.key)}
            className={`shrink-0 rounded-full border-2 px-4 py-1.5 font-display font-semibold ${tab === k.key ? "border-soga-900 bg-soga-800 text-emas-300" : "border-soga-200 bg-white"}`}
          >
            {k.label}{" "}
            <span className="ml-1 rounded-full bg-emas-300 px-2 text-sm text-soga-900">
              {k.items.length}
            </span>
          </button>
        ))}
      </div>

      {galat && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-2xl border-2 border-sambal-500 bg-sambal-100 px-4 py-3 font-semibold text-sambal-500"
        >
          {galat}
          <Button ukuran="sm" varian="garis" onClick={muat}>
            Coba lagi
          </Button>
        </div>
      )}

      {!orders && !galat && (
        <div className="grid place-items-center py-20 text-soga-500">
          <Spinner />
        </div>
      )}

      {orders && (
        <>
          {/* Papan utama: 4 kolom yang perlu ditangani kasir & dapur */}
          <div
            className={`${tabAktif ? "grid" : "hidden"} gap-5 xl:grid xl:grid-cols-4`}
          >
            {aktif.map((k) => (
              <Kolom key={k.key} k={k} tab={tab} now={now} onUbah={upsert} />
            ))}
          </div>

          {/* Riwayat: selesai & kadaluarsa, dipisah dari papan utama */}
          <div className={`${tabRiwayat ? "block" : "hidden"} xl:block`}>
            <div className="mb-4 hidden items-center gap-3 xl:flex">
              <h2 className="font-display text-2xl font-extrabold">
                Riwayat hari ini
              </h2>
              <div className="h-0.5 flex-1 rounded-full bg-soga-200" />
            </div>
            <div className="grid items-start gap-6 xl:grid-cols-2">
              {riwayat.map((k) => (
                <Kolom
                  key={k.key}
                  k={k}
                  tab={tab}
                  now={now}
                  onUbah={upsert}
                  riwayat
                />
              ))}
            </div>
          </div>
        </>
      )}
      {orders && orders.length === 0 && !galat && (
        <EmptyState judul="Belum ada pesanan">
          Pesanan pelanggan akan muncul di sini secara langsung.
        </EmptyState>
      )}
    </div>
  );
}
