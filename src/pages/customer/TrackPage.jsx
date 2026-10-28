import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderApi } from "../../api";
import { Input } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { recentOrders } from "../../lib/constants";
import Gunungan from "../../components/ornaments/Gunungan";

export default function TrackPage() {
  const nav = useNavigate();
  const [kode, setKode] = useState("");
  const [galat, setGalat] = useState("");
  const [cek, setCek] = useState(false);
  const terakhir = recentOrders.get();

  async function submit(e) {
    e.preventDefault();
    const c = kode.trim().toUpperCase();
    if (c.length < 4) return setGalat("Kode pesanan minimal 4 karakter");
    setCek(true);
    setGalat("");
    try {
      await orderApi.getOrder(c);
      nav(`/pesanan/${c}`);
    } catch (err) {
      setGalat(err.status === 404 ? "Kode tidak ditemukan. Periksa lagi huruf dan angkanya." : err.message);
    } finally {
      setCek(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div className="text-center">
        <Gunungan className="mx-auto h-20 text-emas-400" />
        <h1 className="mt-3 text-4xl font-extrabold">Lacak pesanan</h1>
        <p className="mt-1 text-soga-500">Masukkan kode 6 karakter dari halaman pesananmu.</p>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-[2rem] border-2 border-soga-800 bg-white p-6 shadow-kartu">
        <Input label="Kode pesanan" value={kode} onChange={(e) => setKode(e.target.value.toUpperCase())} maxLength={12} placeholder="mis. K7M2QX" error={galat} className="text-center font-display text-2xl tracking-widest" />
        <Button type="submit" ukuran="lg" className="w-full" loading={cek}>
          Cari pesanan
        </Button>
      </form>

      {terakhir.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold">Pesanan terakhir di perangkat ini</h2>
          <ul className="space-y-2">
            {terakhir.map((r) => (
              <li key={r.code}>
                <Link to={`/pesanan/${r.code}`} className="flex items-center justify-between rounded-full border-2 border-soga-200 bg-white px-5 py-2.5 hover:border-soga-800">
                  <span className="font-display font-bold">{r.queueLabel}</span>
                  <span className="font-display tracking-widest text-soga-500">{r.code}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
