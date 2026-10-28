import { useMemo, useState } from "react";
import { menuApi } from "../../api";
import useAsync from "../../hooks/useAsync";
import MenuCard from "../../components/menu/MenuCard";
import EmptyState from "../../components/ui/EmptyState";
import Button, { Spinner } from "../../components/ui/Button";

export default function MenuPage() {
  const { data: menu, loading, error, muat } = useAsync(menuApi.getMenu, []);
  const [kat, setKat] = useState("semua");
  const [cari, setCari] = useState("");

  const tampil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return (menu || [])
      .filter((c) => kat === "semua" || String(c.id) === kat)
      .map((c) => ({
        ...c,
        items: c.items.filter((i) => !q || i.name.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q)),
      }))
      .filter((c) => c.items.length > 0);
  }, [menu, kat, cari]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold">Daftar menu</h1>
          <p className="mt-1 text-soga-500">Harga sudah termasuk semua, tanpa biaya tambahan.</p>
        </div>
        <input
          type="search"
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari masakan…"
          aria-label="Cari menu"
          className="w-full rounded-full border-2 border-soga-200 bg-white px-5 py-2.5 placeholder:text-soga-300 focus:border-emas-500 focus:outline-none md:w-72"
        />
      </div>

      {menu && (
        <div className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4" role="tablist" aria-label="Kategori">
          {[{ id: "semua", name: "Semua" }, ...menu].map((c) => {
            const aktif = kat === String(c.id);
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={aktif}
                onClick={() => setKat(String(c.id))}
                className={`shrink-0 rounded-full border-2 px-5 py-1.5 font-display font-semibold transition ${
                  aktif ? "border-soga-900 bg-soga-800 text-emas-300" : "border-soga-200 bg-white hover:border-soga-400"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="grid place-items-center py-24 text-soga-500">
          <Spinner />
        </div>
      )}
      {error && (
        <EmptyState judul="Menu belum bisa dimuat" aksi={<Button onClick={() => muat()}>Coba lagi</Button>}>
          {error.message}
        </EmptyState>
      )}
      {menu && tampil.length === 0 && <EmptyState judul="Menu tidak ditemukan">Coba kata kunci lain atau pilih kategori Semua.</EmptyState>}

      <div className="space-y-14">
        {tampil.map((c) => (
          <section key={c.id} aria-labelledby={`kat-${c.id}`}>
            <div className="mb-10 flex items-center gap-4">
              <h2 id={`kat-${c.id}`} className="text-3xl font-extrabold">
                {c.name}
              </h2>
              <span className="batik-parang h-3 flex-1 rounded-full bg-soga-800" aria-hidden="true" />
            </div>
            <div className="grid gap-x-6 gap-y-14 pt-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.items.map((i, idx) => (
                <MenuCard key={i.id} item={i} kategori={c.name} indeks={idx} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
