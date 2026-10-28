import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cashierApi } from "../../api";
import { useAuth } from "../../context/AuthContext";
import useLiveEvents from "../../hooks/useLiveEvents";
import { formatRupiah } from "../../lib/format";
import { Spinner } from "../../components/ui/Button";
import Gunungan from "../../components/ornaments/Gunungan";
import Uap from "../../components/ornaments/Uap";
import StatusBadge from "../../components/order/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";

function Angka({ label, nilai, warna, bentuk }) {
  return (
    <div className="flex items-center gap-4 rounded-[2rem] border-2 border-soga-200 bg-white p-4 shadow-kartu">
      <div className={`grid h-16 w-16 shrink-0 place-items-center font-display text-2xl font-extrabold text-white ${bentuk}`} style={{ background: warna }}>
        {nilai}
      </div>
      <p className="font-display text-lg font-bold leading-tight">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);

  const muat = useCallback(() => {
    cashierApi
      .listOrders({ limit: 200 })
      .then((r) => setOrders(r.data))
      .catch(() => setOrders([]));
  }, []);
  useEffect(muat, [muat]);
  useLiveEvents(muat);

  const s = useMemo(() => {
    const list = orders || [];
    const hitung = (st) => list.filter((o) => o.status === st).length;
    const lunas = list.filter((o) => ["PAID", "READY", "COMPLETED"].includes(o.status));
    const pendapatan = lunas.reduce((n, o) => n + o.total, 0);
    const qris = lunas.filter((o) => o.paymentMethod === "QRIS").reduce((n, o) => n + o.total, 0);

    const menu = new Map();
    lunas.forEach((o) => o.items.forEach((i) => menu.set(i.name, (menu.get(i.name) || 0) + i.quantity)));
    const terlaris = [...menu.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    return {
      total: list.length,
      tunai: list.filter((o) => o.status === "PENDING" && o.paymentMethod === "CASH").length,
      dimasak: hitung("PAID"),
      siap: hitung("READY"),
      selesai: hitung("COMPLETED"),
      pendapatan,
      qris,
      tunaiRp: pendapatan - qris,
      terlaris,
      antrean: list.filter((o) => ["PAID", "READY"].includes(o.status)).slice(0, 6),
    };
  }, [orders]);

  if (!orders)
    return (
      <div className="grid place-items-center py-24 text-soga-500">
        <Spinner />
      </div>
    );

  const maxTerlaris = s.terlaris[0]?.[1] || 1;

  return (
    <div className="space-y-8">
      {/* Sambutan */}
      <section className="relative overflow-hidden rounded-[3rem] bg-soga-800 px-7 py-8 text-gading-50 sm:px-10">
        <div className="batik-kawung-emas absolute inset-0 opacity-[0.08]" aria-hidden="true" />
        <Gunungan className="absolute -right-4 -top-6 h-52 text-emas-400" />
        <Uap className="absolute right-24 top-4 hidden h-12 w-12 text-soga-300 sm:block" />
        <div className="relative max-w-xl">
          <p className="font-display text-lg text-emas-300">Sugeng enjang, {user?.name}</p>
          <h1 className="mt-1 text-4xl font-extrabold">Hari ini {s.total} pesanan masuk</h1>
          <p className="mt-2 text-soga-200">
            Pendapatan terkumpul <b className="text-emas-300">{formatRupiah(s.pendapatan)}</b>
            {s.dimasak + s.siap > 0 ? `, ${s.dimasak + s.siap} pesanan masih berjalan.` : ", semua pesanan sudah beres."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/kasir/pesanan" className="rounded-full border-2 border-soga-900 bg-emas-400 px-5 py-2 font-display font-bold text-soga-900 shadow-[0_3px_0_0_var(--color-soga-900)] hover:bg-emas-300">
              Buka pesanan masuk
            </Link>
            <Link to="/kasir/buat-pesanan" className="rounded-full border-2 border-emas-400 px-5 py-2 font-display font-bold text-emas-300 hover:bg-soga-700">
              Buat pesanan manual
            </Link>
          </div>
        </div>
      </section>

      {/* Angka */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan hari ini">
        <Angka label="Menunggu bayar tunai" nilai={s.tunai} warna="#c98512" bentuk="bentuk-batu" />
        <Angka label="Sedang dimasak" nilai={s.dimasak} warna="#8a4f25" bentuk="rounded-full" />
        <Angka label="Siap diambil" nilai={s.siap} warna="#4b7226" bentuk="bentuk-daun" />
        <Angka label="Selesai" nilai={s.selesai} warna="#6e3a17" bentuk="bentuk-kori" />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Antrean aktif */}
        <section className="rounded-[2rem] border-2 border-soga-200 bg-white p-6">
          <h2 className="mb-3 text-2xl font-bold">Antrean berjalan</h2>
          {s.antrean.length === 0 ? (
            <EmptyState judul="Belum ada antrean">Pesanan yang sudah dibayar muncul di sini.</EmptyState>
          ) : (
            <ul className="space-y-2">
              {s.antrean.map((o) => (
                <li key={o.id} className="flex items-center gap-3 rounded-full border-2 border-soga-100 bg-gading-50 py-1.5 pl-1.5 pr-4">
                  <span className="grid h-10 min-w-12 place-items-center rounded-full bg-emas-300 px-2 font-display font-extrabold">{o.queueLabel}</span>
                  <span className="flex-1 truncate font-semibold">{o.customerName}</span>
                  <StatusBadge status={o.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Terlaris + pembayaran */}
        <section className="rounded-[2rem] border-2 border-soga-200 bg-white p-6">
          <h2 className="mb-3 text-2xl font-bold">Menu terlaris hari ini</h2>
          {s.terlaris.length === 0 ? (
            <p className="py-6 text-center text-soga-500">Belum ada penjualan.</p>
          ) : (
            <ul className="space-y-3">
              {s.terlaris.map(([nama, qty]) => (
                <li key={nama}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{nama}</span>
                    <span>{qty} porsi</span>
                  </div>
                  <div className="mt-1 h-3 overflow-hidden rounded-full bg-soga-100">
                    <div className="h-full rounded-full bg-emas-400" style={{ width: `${(qty / maxTerlaris) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t-2 border-dashed border-soga-200 pt-4 text-center">
            <div className="rounded-3xl bg-soga-50 p-3">
              <p className="text-sm text-soga-500">QRIS</p>
              <p className="font-display text-xl font-extrabold">{formatRupiah(s.qris)}</p>
            </div>
            <div className="rounded-3xl bg-emas-100 p-3">
              <p className="text-sm text-soga-500">Tunai</p>
              <p className="font-display text-xl font-extrabold">{formatRupiah(s.tunaiRp)}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
