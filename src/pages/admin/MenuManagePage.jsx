import { useState } from "react";
import { menuApi } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import useAsync from "../../hooks/useAsync";
import useLiveEvents from "../../hooks/useLiveEvents";
import { formatRupiah } from "../../lib/format";
import { errorPerKolom, pesanError } from "../../lib/errors";
import Button, { Spinner } from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Input, Select, Textarea } from "../../components/ui/Field";
import FoodImage from "../../components/ornaments/FoodImage";
import Badge from "../../components/ui/Badge";

const BENTUK = ["bulat", "bunga", "batu", "gunungan"];
const KOSONG = { categoryId: "", name: "", description: "", price: "", imageUrl: "", isAvailable: true };

function Saklar({ aktif, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={aktif}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!aktif)}
      className={`relative h-7 w-12 shrink-0 rounded-full border-2 border-soga-900 transition disabled:opacity-50 ${aktif ? "bg-daun-500" : "bg-soga-200"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${aktif ? "left-[1.35rem]" : "left-0.5"}`} />
    </button>
  );
}

export default function MenuManagePage() {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const { data: menu, setData, loading, muat } = useAsync(menuApi.getMenu, []);
  const [form, setForm] = useState(null); // null = tutup; { id?, ...nilai }
  const [galat, setGalat] = useState({});
  const [simpan, setSimpan] = useState(false);
  const [sibukId, setSibukId] = useState(null);

  useLiveEvents((e) => e === "menu.updated" && muat(true));

  async function ubahStok(item, isAvailable) {
    setSibukId(item.id);
    try {
      await menuApi.setAvailability(item.id, isAvailable);
      setData((m) => m.map((c) => ({ ...c, items: c.items.map((i) => (i.id === item.id ? { ...i, isAvailable } : i)) })));
      toast.ok(`${item.name} ditandai ${isAvailable ? "tersedia" : "habis"}`);
    } catch (e) {
      toast.gagal(pesanError(e));
    } finally {
      setSibukId(null);
    }
  }

  function buka(item, categoryId) {
    setGalat({});
    setForm(item ? { ...item, description: item.description || "", imageUrl: item.imageUrl || "" } : { ...KOSONG, categoryId: categoryId ?? menu?.[0]?.id ?? "" });
  }

  async function submit(e) {
    e.preventDefault();
    setSimpan(true);
    setGalat({});
    const payload = {
      categoryId: Number(form.categoryId),
      name: form.name.trim(),
      price: Number(form.price),
      isAvailable: form.isAvailable,
    };
    try {
      if (form.id) {
        // PATCH: kosongkan -> null agar BE menghapus nilainya
        await menuApi.updateMenuItem(form.id, { ...payload, description: form.description.trim() || null, imageUrl: form.imageUrl.trim() || null });
        toast.ok("Menu diperbarui");
      } else {
        await menuApi.createMenuItem({ ...payload, ...(form.description.trim() ? { description: form.description.trim() } : {}), ...(form.imageUrl.trim() ? { imageUrl: form.imageUrl.trim() } : {}) });
        toast.ok("Menu ditambahkan");
      }
      setForm(null);
      muat(true);
    } catch (err) {
      setGalat(errorPerKolom(err));
      toast.gagal(pesanError(err));
    } finally {
      setSimpan(false);
    }
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl font-extrabold">Kelola menu</h1>
          <p className="text-soga-500">{isAdmin ? "Tambah, ubah, dan tandai menu yang habis." : "Tandai menu yang habis agar pelanggan tidak memesannya."}</p>
        </div>
        {isAdmin && <Button onClick={() => buka(null)}>Tambah menu</Button>}
      </div>

      {loading && <Spinner className="mx-auto my-16 block text-soga-500" />}

      {(menu || []).map((c) => (
        <section key={c.id} className="rounded-[2rem] border-2 border-soga-200 bg-white p-5">
          <h2 className="mb-3 text-2xl font-bold">{c.name}</h2>
          {c.items.length === 0 && <p className="text-soga-400">Belum ada menu di kategori ini.</p>}
          <ul className="divide-y divide-dashed divide-soga-200">
            {c.items.map((i, idx) => (
              <li key={i.id} className="flex items-center gap-4 py-3">
                <FoodImage src={i.imageUrl} alt={i.name} kategori={c.name} aksen={idx} shape={BENTUK[idx % 4]} className="w-16 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-bold leading-tight">{i.name}</p>
                  <p className="truncate text-sm text-soga-500">{i.description || "Tanpa deskripsi"}</p>
                  <p className="font-display font-extrabold text-soga-700">{formatRupiah(i.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge nada={i.isAvailable ? "daun" : "sambal"} className="hidden sm:inline-flex">
                    {i.isAvailable ? "Tersedia" : "Habis"}
                  </Badge>
                  <Saklar aktif={i.isAvailable} disabled={sibukId === i.id} onChange={(v) => ubahStok(i, v)} label={`${i.name} tersedia`} />
                  {isAdmin && (
                    <Button varian="garis" ukuran="sm" onClick={() => buka(i)}>
                      Ubah
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <Modal buka={!!form} onTutup={() => setForm(null)} judul={form?.id ? "Ubah menu" : "Tambah menu"}>
        {form && (
          <form onSubmit={submit} className="space-y-4">
            <Select label="Kategori" value={form.categoryId} onChange={set("categoryId")} required error={galat.categoryId}>
              {(menu || []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <Input label="Nama menu" value={form.name} onChange={set("name")} maxLength={80} required error={galat.name} />
            <Textarea label="Deskripsi" value={form.description} onChange={set("description")} maxLength={300} error={galat.description} />
            <Input label="Harga (Rp)" type="number" min={0} step={500} value={form.price} onChange={set("price")} required error={galat.price} />
            <Input label="Alamat gambar (opsional)" type="url" value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://…" hint="Kosongkan untuk memakai gambar contoh." error={galat.imageUrl} />
            <label className="flex items-center gap-3 font-display font-semibold">
              <Saklar aktif={form.isAvailable} onChange={(v) => setForm((f) => ({ ...f, isAvailable: v }))} label="Tersedia" />
              Tersedia untuk dipesan
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" varian="garis" onClick={() => setForm(null)}>Batal</Button>
              <Button type="submit" loading={simpan}>Simpan menu</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
