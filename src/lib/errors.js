// Ubah error BE menjadi kalimat yang bisa dibaca orang
export function pesanError(e) {
  if (!e) return "Terjadi kesalahan";
  if (e.code === "VALIDATION_ERROR" && Array.isArray(e.errors) && e.errors.length) {
    return e.errors.map((x) => x.message).join(". ");
  }
  return e.message || "Terjadi kesalahan";
}

// { "body.customerName": "Nama wajib diisi" } agar bisa ditempel ke tiap kolom
export function errorPerKolom(e) {
  if (e?.code !== "VALIDATION_ERROR" || !Array.isArray(e.errors)) return {};
  return Object.fromEntries(e.errors.map((x) => [String(x.path).replace(/^body\./, ""), x.message]));
}
