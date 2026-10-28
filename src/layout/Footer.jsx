import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import BatikBand from "../components/ornaments/BatikBand";

export default function Footer({ admin = false }) {
  return (
    <footer className={`mt-auto bg-soga-900 text-gading-100 ${admin ? "" : "pt-4"}`}>
      <BatikBand />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-6 text-center sm:flex-row sm:text-left">
        <img src={logo} alt="" className="h-14 w-14 rounded-full bg-emas-300 object-cover object-top" />
        <div className="flex-1">
          <p className="font-display text-lg font-bold text-emas-300">Pawon Simbok</p>
          <p className="text-sm text-soga-200">Masakan rumahan, dimasak pelan-pelan seperti di dapur simbok.</p>
        </div>
        {admin ? (
          <p className="text-sm text-soga-300">Panel kasir &amp; admin</p>
        ) : (
          <Link to="/kasir" className="rounded-full px-3 py-1 text-sm text-soga-300 hover:bg-soga-800 hover:text-emas-300">
            Masuk petugas
          </Link>
        )}
      </div>
      <p className="border-t border-soga-800 py-3 text-center text-xs text-soga-400">
        © {new Date().getFullYear()} Pawon Simbok. Matur nuwun sampun mampir.
      </p>
    </footer>
  );
}
