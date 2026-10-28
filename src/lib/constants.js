export const STATUS = {
  PENDING: { label: "Menunggu pembayaran", short: "Menunggu bayar", tone: "emas" },
  PAID: { label: "Sedang dimasak", short: "Dimasak", tone: "sogan" },
  READY: { label: "Siap diambil", short: "Siap", tone: "daun" },
  COMPLETED: { label: "Selesai", short: "Selesai", tone: "netral" },
  EXPIRED: { label: "Kedaluwarsa", short: "Kedaluwarsa", tone: "sambal" },
};

export const ORDER_TYPE = { DINE_IN: "Makan di sini", TAKE_AWAY: "Bawa pulang" };
export const PAYMENT_METHOD = { QRIS: "QRIS", CASH: "Tunai di kasir" };
export const NOTIFY = { SOUND: "Bunyi di layar", MESSAGE: "Pesan di layar" };

// Warna aksen per kategori untuk placeholder gambar
export const KATEGORI_AKSEN = ["#c98512", "#4b7226", "#a56a3a", "#c4402f", "#6e3a17"];

const RECENT_KEY = "simbok.pesanan-terakhir";
export const recentOrders = {
  get: () => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
    } catch {
      return [];
    }
  },
  add: (o) => {
    const list = recentOrders.get().filter((x) => x.code !== o.code);
    list.unshift({ code: o.code, queueLabel: o.queueLabel, at: Date.now() });
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 8)));
  },
};
