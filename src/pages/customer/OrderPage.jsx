import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderApi } from "../../api";
import useEventSource from "../../hooks/useEventSource";
import { bunyiSiap, siapkanBunyi } from "../../lib/bunyi";
import { formatJam, sisaWaktu } from "../../lib/format";
import { ORDER_TYPE, PAYMENT_METHOD, recentOrders } from "../../lib/constants";
import { useToast } from "../../context/ToastContext";
import { pesanError } from "../../lib/errors";
import Button, { Spinner } from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/order/StatusBadge";
import OrderProgress from "../../components/order/OrderProgress";
import OrderItems from "../../components/order/OrderItems";
import QrisPanel from "../../components/order/QrisPanel";
import Uap from "../../components/ornaments/Uap";
import Gunungan from "../../components/ornaments/Gunungan";

export default function OrderPage() {
  const { code } = useParams();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [sibuk, setSibuk] = useState(false);
  const statusLama = useRef(null);
  const bunyiTimer = useRef(null);

  // Muat awal (SSE juga mengirim state awal, ini cadangan bila stream terlambat)
  useEffect(() => {
    setOrder(null);
    setError(null);
    orderApi
      .getOrder(code)
      .then((o) => {
        setOrder(o);
        recentOrders.add(o);
      })
      .catch(setError);
  }, [code]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const terhubung = useEventSource(
    orderApi.orderStreamUrl(code),
    { "order.updated": useCallback((o) => setOrder(o), []) },
  );

  // Saat status berubah menjadi READY: bunyikan (jika dipilih) dan ulangi sampai ditutup
  useEffect(() => {
    if (!order) return;
    const berubahKeSiap = statusLama.current && statusLama.current !== "READY" && order.status === "READY";
    statusLama.current = order.status;
    if (order.status === "READY" && order.notifyPreference === "SOUND" && berubahKeSiap) {
      bunyiSiap(2);
      bunyiTimer.current = setInterval(() => bunyiSiap(2), 6000);
    }
    if (order.status !== "READY") clearInterval(bunyiTimer.current);
    return undefined;
  }, [order]);
  useEffect(() => () => clearInterval(bunyiTimer.current), []);

  async function simulasi(hasil) {
    setSibuk(true);
    try {
      setOrder(await orderApi.simulatePayment(code, hasil));
    } catch (e) {
      toast.gagal(pesanError(e));
    } finally {
      setSibuk(false);
    }
  }

  if (error)
    return (
      <EmptyState judul={error.status === 404 ? "Pesanan tidak ditemukan" : "Pesanan belum bisa dimuat"} aksi={<Link to="/lacak" className="rounded-full border-2 border-soga-900 bg-emas-400 px-6 py-2.5 font-display font-bold shadow-timbul">Cek kode lain</Link>}>
        {error.message}
      </EmptyState>
    );
  if (!order)
    return (
      <div className="grid place-items-center py-24 text-soga-500">
        <Spinner />
      </div>
    );

  const o = order;
  const siap = o.status === "READY";
  const qris = o.paymentMethod === "QRIS";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Antrean */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-soga-900 bg-soga-800 px-6 py-8 text-center text-gading-50">
        <div className="batik-kawung-emas absolute inset-0 opacity-[0.08]" aria-hidden="true" />
        <Gunungan className="absolute -left-6 -bottom-6 h-40 text-soga-700" />
        <Gunungan className="absolute -right-6 -bottom-6 h-40 text-soga-700" />
        <div className="relative">
          <p className="text-soga-200">Nomor antreanmu</p>
          <p className="font-display text-7xl font-extrabold text-emas-300 sm:text-8xl">{o.queueLabel}</p>
          <p className="mt-1 text-lg font-semibold">{o.customerName}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <StatusBadge status={o.status} />
            <span className="rounded-full bg-soga-700 px-3 py-0.5 text-xs font-bold">
              Kode {o.code}
            </span>
            <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${terhubung ? "bg-daun-500 text-white" : "bg-soga-700 text-soga-200"}`}>
              {terhubung ? "Terpantau langsung" : "Menyambung…"}
            </span>
          </div>
        </div>
      </section>

      {/* Siap diambil */}
      {siap && (
        <section role="alert" className="relative overflow-hidden rounded-[2rem] border-2 border-soga-900 bg-emas-400 p-6 text-center shadow-timbul">
          <Uap className="mx-auto h-12 w-12 text-soga-800" />
          <h2 className="mt-1 text-3xl font-extrabold">Pesanan {o.queueLabel} sudah siap!</h2>
          <p className="mt-1 font-semibold">
            {o.orderType === "DINE_IN" ? `Mohon tunggu, pesanan diantar ke Meja ${o.tableNumber}.` : "Silakan ambil di kasir."}
          </p>
          {o.notifyPreference === "SOUND" && (
            <Button
              className="mt-4"
              varian="soga"
              onClick={() => {
                clearInterval(bunyiTimer.current);
                siapkanBunyi();
              }}
            >
              Matikan bunyi
            </Button>
          )}
        </section>
      )}

      {/* Aksi sesuai tahap */}
      {o.status === "PENDING" && qris && (
        <>
          <QrisPanel order={o} />
          {o.payment?.isSimulated && (
            <div className="rounded-[2rem] border-2 border-dashed border-soga-400 bg-gading-100 p-5 text-center">
              <p className="font-display font-bold">Mode uji pembayaran</p>
              <p className="mb-3 text-sm text-soga-500">Server berjalan dengan simulator, jadi pembayaran bisa dicoba tanpa uang sungguhan.</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button varian="daun" loading={sibuk} onClick={() => simulasi("SUCCESS")}>
                  Simulasikan berhasil bayar
                </Button>
                <Button varian="garis" loading={sibuk} onClick={() => simulasi("EXPIRE")}>
                  Simulasikan kedaluwarsa
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {o.status === "PENDING" && !qris && (
        <section className="rounded-[2rem] border-2 border-soga-800 bg-white p-6 text-center shadow-kartu">
          <h2 className="text-2xl font-bold">Bayar tunai di kasir</h2>
          <p className="mt-1 text-soga-500">Sebutkan nomor antrean atau kode ini kepada kasir.</p>
          <p className="mx-auto mt-4 w-fit rounded-full border-2 border-dashed border-soga-400 px-8 py-3 font-display text-4xl font-extrabold tracking-widest">{o.code}</p>
          <p className="mt-3 text-sm text-soga-500">
            Batas waktu <span className="font-display font-bold text-sambal-500">{sisaWaktu(o.expiresAt, now)}</span>
          </p>
        </section>
      )}

      {o.status === "PAID" && (
        <section className="rounded-[2rem] border-2 border-soga-200 bg-white p-6 text-center">
          <Uap className="mx-auto h-12 w-12 text-soga-300" />
          <h2 className="text-2xl font-bold">Pesananmu sedang dimasak</h2>
          <p className="text-soga-500">Tetap buka halaman ini. Kami kabari saat pesanan siap.</p>
        </section>
      )}

      {o.status === "EXPIRED" && (
        <section role="alert" className="rounded-[2rem] border-2 border-sambal-500 bg-sambal-100 p-6 text-center">
          <h2 className="text-2xl font-bold text-sambal-500">Batas waktu pembayaran habis</h2>
          <p className="mb-4 text-soga-600">Pesanan ini dibatalkan otomatis. Kamu bisa memesan lagi dari menu.</p>
          <Link to="/menu" className="rounded-full border-2 border-soga-900 bg-emas-400 px-6 py-2.5 font-display font-bold shadow-timbul">
            Pesan lagi
          </Link>
        </section>
      )}

      {o.status === "COMPLETED" && (
        <section className="rounded-[2rem] border-2 border-daun-500 bg-daun-100 p-6 text-center">
          <h2 className="text-2xl font-bold text-daun-700">Pesanan selesai</h2>
          <p className="text-soga-600">Matur nuwun, semoga kenyang dan senang.</p>
        </section>
      )}

      {o.status !== "EXPIRED" && (
        <section className="rounded-[2rem] border-2 border-soga-200 bg-white p-6">
          <OrderProgress status={o.status} />
        </section>
      )}

      <section className="rounded-[2rem] border-2 border-soga-200 bg-white p-6">
        <h2 className="mb-1 text-xl font-bold">Rincian pesanan</h2>
        <p className="mb-3 text-sm text-soga-500">
          {ORDER_TYPE[o.orderType]}
          {o.tableNumber ? `, Meja ${o.tableNumber}` : ""} · {PAYMENT_METHOD[o.paymentMethod]} · dibuat {formatJam(o.createdAt)}
        </p>
        <OrderItems order={o} />
      </section>
    </div>
  );
}
