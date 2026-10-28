import { useState } from "react";
import { cashierApi } from "../../api";
import { useToast } from "../../context/ToastContext";
import { formatJam, formatRupiah, sisaWaktu } from "../../lib/format";
import { ORDER_TYPE, PAYMENT_METHOD } from "../../lib/constants";
import { pesanError } from "../../lib/errors";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import { Textarea } from "../ui/Field";
import StatusBadge from "./StatusBadge";

export default function AdminOrderCard({ order, now, onUbah }) {
  const toast = useToast();
  const [sibuk, setSibuk] = useState(false);
  const [catatan, setCatatan] = useState(false);
  const [teks, setTeks] = useState(order.internalNote || "");

  async function jalankan(fn, pesan) {
    setSibuk(true);
    try {
      const baru = await fn(order.code);
      onUbah(baru);
      toast.ok(pesan);
    } catch (e) {
      toast.gagal(pesanError(e));
    } finally {
      setSibuk(false);
    }
  }

  async function simpanCatatan() {
    setSibuk(true);
    try {
      onUbah(await cashierApi.saveNote(order.code, teks.trim() || null));
      toast.ok("Catatan disimpan");
      setCatatan(false);
    } catch (e) {
      toast.gagal(pesanError(e));
    } finally {
      setSibuk(false);
    }
  }

  const tunaiMenunggu = order.status === "PENDING" && order.paymentMethod === "CASH";
  const qrisMenunggu = order.status === "PENDING" && order.paymentMethod === "QRIS";

  return (
    <article className="rounded-[1.75rem] border-2 border-soga-200 bg-white p-4 shadow-kartu">
      <header className="flex items-start gap-3">
        <div className="grid h-14 min-w-14 place-items-center rounded-full border-2 border-soga-900 bg-emas-300 px-2 font-display text-lg font-extrabold">
          {order.queueLabel}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-bold leading-tight">{order.customerName}</p>
          <p className="text-sm text-soga-500">
            {ORDER_TYPE[order.orderType]}
            {order.tableNumber ? ` · Meja ${order.tableNumber}` : ""} · {formatJam(order.createdAt)}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <StatusBadge status={order.status} />
            <Badge nada={order.paymentMethod === "QRIS" ? "sogan" : "emas"}>{PAYMENT_METHOD[order.paymentMethod]}</Badge>
            {order.source === "CASHIER" && <Badge nada="netral">Manual</Badge>}
            <Badge nada="netral">{order.code}</Badge>
          </div>
        </div>
      </header>

      <ul className="mt-3 space-y-1 border-t border-dashed border-soga-200 pt-3">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between gap-2 text-sm">
            <span>
              <b>{i.quantity}×</b> {i.name}
              {i.note && <span className="block italic text-sambal-500">“{i.note}”</span>}
            </span>
            <span className="shrink-0 text-soga-500">{formatRupiah(i.subtotal)}</span>
          </li>
        ))}
      </ul>

      {order.internalNote && (
        <p className="mt-2 rounded-2xl bg-emas-100 px-3 py-1.5 text-sm">
          <b>Catatan:</b> {order.internalNote}
        </p>
      )}

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-sm text-soga-500">
          {order.status === "PENDING" && order.expiresAt ? `Batal otomatis ${sisaWaktu(order.expiresAt, now)}` : order.notifyPreference === "SOUND" ? "Notifikasi: bunyi" : "Notifikasi: pesan"}
        </span>
        <span className="font-display text-xl font-extrabold">{formatRupiah(order.total)}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {tunaiMenunggu && (
          <Button varian="emas" ukuran="sm" loading={sibuk} onClick={() => jalankan(cashierApi.payCash, "Pembayaran tunai diterima")}>
            Terima tunai
          </Button>
        )}
        {qrisMenunggu && <span className="rounded-full bg-soga-50 px-3 py-1.5 text-sm text-soga-500">Menunggu pembayaran QRIS</span>}
        {order.status === "PAID" && (
          <Button varian="daun" ukuran="sm" loading={sibuk} onClick={() => jalankan(cashierApi.markReady, `Pesanan ${order.queueLabel} siap diambil`)}>
            Tandai siap
          </Button>
        )}
        {order.status === "READY" && (
          <Button varian="soga" ukuran="sm" loading={sibuk} onClick={() => jalankan(cashierApi.markCompleted, "Pesanan selesai")}>
            Selesaikan
          </Button>
        )}
        <Button varian="hantu" ukuran="sm" onClick={() => setCatatan(true)}>
          {order.internalNote ? "Ubah catatan" : "Beri catatan"}
        </Button>
      </div>

      <Modal buka={catatan} onTutup={() => setCatatan(false)} judul={`Catatan ${order.queueLabel}`}>
        <Textarea label="Catatan internal (tidak terlihat pelanggan)" value={teks} onChange={(e) => setTeks(e.target.value)} maxLength={500} />
        <div className="mt-4 flex justify-end gap-2">
          <Button varian="garis" onClick={() => setCatatan(false)}>
            Batal
          </Button>
          <Button loading={sibuk} onClick={simpanCatatan}>
            Simpan catatan
          </Button>
        </div>
      </Modal>
    </article>
  );
}
