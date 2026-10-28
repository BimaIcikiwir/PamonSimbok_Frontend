import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import BatikBand from "../components/ornaments/BatikBand";

const ikon = {
  dasbor: "M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6v-9h-6v9zm0-16v5h6V4h-6z",
  pesanan: "M6 3h12v18l-3-2-3 2-3-2-3 2V3zm3 5h6M9 12h6",
  kasir: "M12 5v14M5 12h14",
  menu: "M5 4h14v4H5zM5 10h14v4H5zM5 16h14v4H5z",
  toko: "M4 10l1-5h14l1 5M5 10v9h14v-9M9 19v-5h6v5",
};

const LINKS = [
  { to: "/kasir/dasbor", label: "Dasbor", ikon: "dasbor" },
  { to: "/kasir/pesanan", label: "Pesanan masuk", ikon: "pesanan" },
  { to: "/kasir/buat-pesanan", label: "Pesanan manual", ikon: "kasir" },
  { to: "/kasir/menu", label: "Kelola menu", ikon: "menu" },
];

export default function Sidebar({ buka, onTutup }) {
  const { user } = useAuth();
  return (
    <>
      {buka && <div className="fixed inset-0 z-40 bg-soga-900/60 lg:hidden" onClick={onTutup} aria-hidden="true" />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-soga-800 text-gading-50 transition-transform lg:static lg:translate-x-0 ${
          buka ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="batik-kawung-emas pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden="true" />
        <div className="relative flex items-center gap-3 px-5 py-5">
          <img src={logo} alt="" className="h-14 w-14 rounded-full bg-emas-300 object-cover object-top ring-2 ring-emas-400" />
          <div>
            <p className="font-display text-lg font-extrabold leading-tight">Pawon</p>
            <p className="font-display text-lg font-extrabold leading-tight text-emas-300">Simbok</p>
          </div>
        </div>
        <BatikBand className="!bg-soga-900" />

        <nav className="relative flex-1 space-y-1 px-3 py-4" aria-label="Panel kasir">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={onTutup}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-full px-4 py-2.5 font-display font-semibold transition ${
                  isActive ? "bg-emas-400 text-soga-900 shadow-[0_3px_0_0_var(--color-soga-900)]" : "text-gading-100 hover:bg-soga-700"
                }`
              }
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={ikon[l.ikon]} />
              </svg>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/" onClick={onTutup} className="mt-4 flex items-center gap-3 rounded-full px-4 py-2.5 font-display font-semibold text-soga-200 hover:bg-soga-700">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={ikon.toko} />
            </svg>
            Lihat halaman pelanggan
          </NavLink>
        </nav>

        {user && (
          <div className="relative border-t border-soga-700 px-5 py-4 text-sm">
            <p className="font-display font-bold">{user.name}</p>
            <p className="text-soga-300">{user.role === "ADMIN" ? "Admin" : "Kasir"}</p>
          </div>
        )}
      </aside>
    </>
  );
}
