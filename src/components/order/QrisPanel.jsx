import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { formatRupiah, sisaWaktu } from "../../lib/format";

/** Kode QRIS + hitung mundur sampai kedaluwarsa. */
export default function QrisPanel({ order }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const p = order.payment;
  if (!p?.qrString && !p?.qrUrl) return null;
  const sisa = sisaWaktu(p.expiresAt, now);

  return (
    <div className="mx-auto flex max-w-xs flex-col items-center gap-3 rounded-[2rem] border-2 border-soga-800 bg-white p-5 text-center shadow-kartu">
      <p className="font-display text-lg font-bold">Pindai dengan aplikasi pembayaran</p>
      <div className="rounded-3xl border-2 border-dashed border-soga-300 bg-white p-3">
        {p.qrUrl ? (
          <img src={p.qrUrl} alt="Kode QRIS" className="h-48 w-48" />
        ) : (
          <QRCodeSVG value={p.qrString} size={192} level="M" fgColor="#3e1b0c" title="Kode QRIS" />
        )}
      </div>
      <p className="font-display text-2xl font-extrabold">{formatRupiah(p.amount)}</p>
      {sisa && (
        <p className="text-sm text-soga-500">
          Berlaku <span className="font-display font-bold text-sambal-500">{sisa}</span> lagi
        </p>
      )}
    </div>
  );
}
