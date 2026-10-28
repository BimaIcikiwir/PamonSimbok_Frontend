import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";

const MENU = [
  { to: "/", label: "Beranda", end: true },
  { to: "/menu", label: "Menu" },
  { to: "/lacak", label: "Lacak pesanan" },
];

const tautan = ({ isActive }) =>
  `rounded-full px-4 py-1.5 font-display font-semibold transition ${
    isActive ? "bg-emas-400 text-soga-900" : "text-gading-100 hover:bg-soga-700"
  }`;

export default function Header({ onBukaKeranjang }) {
  const { jumlah, meja } = useCart();
  const [buka, setBuka] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-soga-800 text-gading-50">
      <div className="batik-kawung-emas absolute inset-0 opacity-[0.07]" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Pawon Simbok, ke beranda">
          <img src={logo} alt="" className="h-12 w-12 rounded-full bg-emas-300 object-cover object-top ring-2 ring-emas-400" />
          <span className="hidden font-display text-xl font-extrabold leading-none sm:block">
            Pawon <span className="text-emas-300">Simbok</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Utama">
          {MENU.map((m) => (
            <NavLink key={m.to} {...m} className={tautan}>
              {m.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {meja && (
            <span className="rounded-full border-2 border-emas-400 px-3 py-1 font-display text-sm font-bold text-emas-300">
              Meja {meja}
            </span>
          )}
          <button
            onClick={onBukaKeranjang}
            className="relative flex items-center gap-2 rounded-full border-2 border-soga-900 bg-emas-400 px-4 py-2 font-display font-bold text-soga-900 shadow-timbul transition hover:bg-emas-300 active:translate-y-[3px] active:shadow-none"
            aria-label={`Buka keranjang, ${jumlah} item`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 9h16l-1.6 9.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8L4 9z" />
              <path d="M8 9V7a4 4 0 0 1 8 0v2" />
            </svg>
            Keranjang
            {jumlah > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-6 min-w-6 place-items-center rounded-full bg-sambal-500 px-1 text-xs text-white ring-2 ring-soga-800">
                {jumlah}
              </span>
            )}
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-soga-700 md:hidden"
            onClick={() => setBuka((b) => !b)}
            aria-expanded={buka}
            aria-label="Buka navigasi"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d={buka ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>
      </div>

      {buka && (
        <nav className="relative flex flex-col gap-1 border-t border-soga-700 px-4 pb-3 pt-2 md:hidden" aria-label="Utama (ponsel)">
          {MENU.map((m) => (
            <NavLink key={m.to} {...m} className={tautan} onClick={() => setBuka(false)}>
              {m.label}
            </NavLink>
          ))}
        </nav>
      )}
      <div className="tepi-ukir absolute inset-x-0 top-full" aria-hidden="true" />
    </header>
  );
}
