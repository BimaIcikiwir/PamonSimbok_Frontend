import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLive } from "../context/LiveContext";
import { bunyiMasuk, siapkanBunyi } from "../lib/bunyi";
import { formatTanggal } from "../lib/format";
import Button from "../components/ui/Button";

export default function AdminHeader({ onBukaSidebar }) {
  const { keluar } = useAuth();
  const { terhubung } = useLive();
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b-2 border-soga-200 bg-gading-50/95 px-4 py-3 backdrop-blur lg:px-8">
      <button onClick={onBukaSidebar} className="grid h-10 w-10 place-items-center rounded-full hover:bg-soga-100 lg:hidden" aria-label="Buka menu samping">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <div className="min-w-0">
        <p className="truncate font-display text-lg font-bold">{formatTanggal(new Date())}</p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => {
            siapkanBunyi();
            bunyiMasuk();
          }}
          className="hidden rounded-full border-2 border-soga-200 px-3 py-1 text-sm font-semibold hover:bg-soga-50 sm:block"
          title="Browser perlu satu klik dulu agar bunyi notifikasi bisa dimainkan"
        >
          Tes bunyi
        </button>
        <span
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${
            terhubung ? "bg-daun-100 text-daun-700" : "bg-sambal-100 text-sambal-500"
          }`}
          role="status"
        >
          <span className={`h-2.5 w-2.5 rounded-full ${terhubung ? "bg-daun-500" : "bg-sambal-500"}`} />
          {terhubung ? "Terhubung langsung" : "Menyambung ulang…"}
        </span>
        <Button
          varian="garis"
          ukuran="sm"
          onClick={() => {
            keluar();
            nav("/kasir");
          }}
        >
          Keluar
        </Button>
      </div>
    </header>
  );
}
