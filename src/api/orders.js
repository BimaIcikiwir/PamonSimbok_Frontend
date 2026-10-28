import { API_URL, get, post } from "./client";

// Pelanggan
export const createOrder = (payload) => post("/orders", payload).then((r) => r.data);
export const getOrder = (code) => get(`/orders/${code}`).then((r) => r.data);
export const orderStreamUrl = (code) => `${API_URL}/orders/${code}/stream`;

// Simulator pembayaran QRIS (hanya aktif jika PAYMENT_PROVIDER=simulator)
export const simulatePayment = (code, result = "SUCCESS") =>
  post(`/payments/${code}/simulate`, { result }).then((r) => r.data);
