import { Link } from "react-router-dom";
import Gunungan from "../components/ornaments/Gunungan";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-gading-50 px-4 text-center">
      <div>
        <Gunungan className="mx-auto h-32 text-emas-400" />
        <h1 className="mt-4 text-5xl font-extrabold">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-soga-500">Alamat yang kamu buka tidak ada di pawon ini.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full border-2 border-soga-900 bg-emas-400 px-7 py-3 font-display text-lg font-bold shadow-timbul">
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
