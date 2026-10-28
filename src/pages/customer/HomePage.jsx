import { Link } from "react-router-dom";
import { menuApi } from "../../api";
import useAsync from "../../hooks/useAsync";
import { useCart } from "../../context/CartContext";
import logo from "../../assets/logo.png";
import FoodImage from "../../components/ornaments/FoodImage";
import Gunungan from "../../components/ornaments/Gunungan";
import { formatRupiah } from "../../lib/format";

/*
  Gambar background hero (panjang, ujung ke ujung layar).
  Taruh file-nya di  src/assets/  dengan nama  bg-home.png  (atau .jpg / .jpeg / .webp / .avif).
  Kalau file belum ada, hero memakai latar batik polos sebagai cadangan.
*/
const bgModules = import.meta.glob(
  "../../assets/bg-home.{png,jpg,jpeg,webp,avif}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);
const bgHome = Object.values(bgModules)[0];

// Bentuk berbasis border-radius saja, supaya pasti bulat/lengkung di semua browser
const BENTUK = ["bulat", "kori", "batu", "bulat"];

// Logo di dalam bentuk gunungan kuning. Hanya itu, tanpa gambar makanan/minuman.
function LogoGunungan() {
  return (
    <div className="relative mx-auto mb-12 aspect-[100/130] w-full max-w-[17rem] sm:max-w-sm">
      {/* Gunungan + isi krem digeser turun bersama-sama, pucuk jadi lebih rendah */}
      <div className="absolute inset-0 translate-y-[6%]">
        <Gunungan className="absolute inset-0 h-full w-full text-emas-400 drop-shadow-[0_16px_22px_rgb(62_27_12/0.28)]" />
        <div
          className="absolute inset-x-[14%] bottom-[8%] top-[16%] bg-gading-50"
          style={{ clipPath: "url(#klip-gunungan)" }}
        />
      </div>

      {/* Logo tetap di posisinya, menimpa gunungan */}
      <img
        src={logo}
        alt="Simbok Pawon Simbok tersenyum menyapa"
        className="absolute bottom-[-8%] left-1/2 w-[125%] max-w-none -translate-x-1/2 drop-shadow-[0_10px_14px_rgb(62_27_12/0.3)]"
      />
    </div>
  );
}

export default function HomePage() {
  const { data: menu } = useAsync(menuApi.getMenu, []);
  const { meja } = useCart();

  const unggulan = (menu || [])
    .flatMap((c) =>
      c.items
        .filter((i) => i.isAvailable)
        .map((i) => ({ ...i, kategori: c.name })),
    )
    .slice(0, 4);

  return (
    <div className="space-y-20">
      {/* Hero: gambar background penuh dari tepi kiri ke tepi kanan layar */}
      <section
        aria-label="Selamat datang"
        className="relative left-1/2 -mt-8 w-screen -translate-x-1/2 overflow-hidden bg-gading-100"
      >
        {bgHome ? (
          <img
            src={bgHome}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div
            className="batik-kawung absolute inset-0 opacity-30"
            aria-hidden="true"
          />
        )}
        {/* Lapisan pudar agar tulisan tetap terbaca di atas gambar apa pun */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-gading-50/90 via-gading-50/70 to-gading-50/20 md:bg-gradient-to-r md:from-gading-50/95 md:via-gading-50/65 md:to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid min-h-[34rem] max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <p className="mb-3 inline-block rounded-full bg-daun-100 px-4 py-1 font-display font-semibold text-daun-700">
              {meja
                ? `Sugeng rawuh, Meja ${meja}`
                : "Sugeng rawuh, monggo pinarak"}
            </p>
            <h1 className="text-5xl font-extrabold leading-[1.02] text-soga-800 sm:text-6xl">
              Masakan simbok, langsung dari pawon ke mejamu.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-soga-700">
              Pilih menu, bayar lewat QRIS atau tunai di kasir, lalu tunggu
              panggilan dari layar. Tidak perlu antre di depan kasir.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center rounded-full border-2 border-soga-900 bg-emas-400 px-7 py-3.5 font-display text-lg font-bold text-soga-900 shadow-timbul transition hover:bg-emas-300 active:translate-y-[3px] active:shadow-none"
              >
                Mulai pesan
              </Link>
              <Link
                to="/lacak"
                className="inline-flex items-center rounded-full border-2 border-soga-400 bg-gading-50/80 px-7 py-3.5 font-display text-lg font-semibold text-soga-800 hover:bg-gading-50"
              >
                Lacak pesanan
              </Link>
            </div>
          </div>

          <LogoGunungan />
        </div>
      </section>

      {/* Cara memesan: urutan nyata */}
      <section aria-labelledby="cara">
        <h2 id="cara" className="mb-8 text-center text-3xl font-extrabold">
          Cara memesan
        </h2>
        <ol className="grid gap-6 sm:grid-cols-3">
          {[
            [
              "Pilih menu",
              "Buka daftar menu, tekan Pesan pada masakan yang kamu mau.",
            ],
            [
              "Isi nama dan bayar",
              "Bayar QRIS dari ponsel, atau pilih tunai dan bayar di kasir.",
            ],
            [
              "Tunggu dipanggil",
              "Layar ini memberi tahu saat pesananmu siap diambil.",
            ],
          ].map(([judul, isi], i) => (
            <li
              key={judul}
              className="relative rounded-[2rem] border-2 border-soga-200 bg-white px-6 pb-6 pt-10 text-center shadow-kartu"
            >
              <span className="absolute left-1/2 top-0 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-soga-900 bg-emas-400 font-display text-xl font-extrabold shadow-timbul">
                {i + 1}
              </span>
              <h3 className="text-xl font-bold">{judul}</h3>
              <p className="mt-1.5 text-soga-500">{isi}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Menu pilihan */}
      {unggulan.length > 0 && (
        <section
          aria-labelledby="pilihan"
          className="relative overflow-hidden rounded-[3rem] bg-soga-800 px-6 py-12 text-gading-50 sm:px-12"
        >
          <div
            className="batik-kawung-emas absolute inset-0 opacity-[0.08]"
            aria-hidden="true"
          />
          <Gunungan className="absolute -right-10 -top-10 h-56 text-soga-700" />
          <div className="relative">
            <h2 id="pilihan" className="text-3xl font-extrabold text-emas-300">
              Dari pawon hari ini
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
              {unggulan.map((m, i) => (
                <li
                  key={m.id}
                  className="flex flex-col items-center text-center"
                >
                  <FoodImage
                    src={m.imageUrl}
                    alt={m.name}
                    kategori={m.kategori}
                    aksen={i}
                    shape={BENTUK[i % 4]}
                    className="w-32 border-[3px] border-emas-400"
                  />
                  <p className="mt-3 font-display text-lg font-bold">
                    {m.name}
                  </p>
                  <p className="text-emas-300">{formatRupiah(m.price)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-center">
              <Link
                to="/menu"
                className="inline-flex rounded-full border-2 border-soga-900 bg-emas-400 px-6 py-2.5 font-display font-bold text-soga-900 shadow-[0_3px_0_0_var(--color-soga-900)] hover:bg-emas-300"
              >
                Lihat semua menu
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
