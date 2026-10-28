# Pawon Simbok – Frontend

React 19 + Vite + Tailwind CSS v4 + React Router. Terhubung ke BE `simbok_be` (Express + Prisma).

## Menjalankan

```bash
npm install
cp .env.example .env     # isi VITE_API_URL, default http://localhost:3000/api
npm run dev              # http://localhost:5173
```

Pastikan `CORS_ORIGIN` di `.env` BE memuat `http://localhost:5173` (sudah default).
Akun seed BE: `kasir / kasir123` dan `admin / admin123`.

## Struktur `src/`

```
api/          client.js (fetch + token + ApiError), auth, menu, tables, orders, cashier
assets/       logo.png
components/
  ui/         Button, Badge, Field, Modal, EmptyState
  ornaments/  ShapeDefs (clip-path), FoodImage (placeholder non-kotak), HeroArt, Gunungan, Uap, BatikBand
  menu/       MenuCard
  order/      CartDrawer, FloatingCart, OrderProgress, OrderItems, QrisPanel, StatusBadge, AdminOrderCard
context/      Auth, Cart, Toast, Live (satu koneksi SSE kasir)
hooks/        useAsync, useEventSource, useLiveEvents
layout/       Header, Footer, Sidebar, AdminHeader, CustomerLayout, AdminLayout
lib/          format, constants, errors, bunyi (Web Audio)
pages/
  customer/   Home, Menu, Checkout, Order (status realtime), Track
  admin/      Login, Dashboard, Orders, Pos (pesanan manual), MenuManage
```

## Rute

| Rute | Halaman |
|---|---|
| `/` , `/?meja=5` | Beranda (QR meja menyimpan nomor meja) |
| `/menu` | Daftar menu + keranjang |
| `/checkout` | Isi nama, jenis, meja, metode bayar, jenis notifikasi |
| `/pesanan/:code` | Status pesanan realtime (SSE), QRIS, bunyi/pesan saat siap |
| `/lacak` | Cari pesanan dengan kode |
| `/kasir` | Login petugas |
| `/kasir/dasbor`, `/kasir/pesanan`, `/kasir/buat-pesanan`, `/kasir/menu` | Panel kasir/admin |

Peran: `CASHIER` boleh menandai menu habis; hanya `ADMIN` yang bisa tambah/ubah menu (sesuai BE).
