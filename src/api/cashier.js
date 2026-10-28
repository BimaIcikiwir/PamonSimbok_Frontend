import { API_URL, get, patch, post, tokenStore } from "./client";

const auth = { auth: true };

// GET /cashier/orders?status=PAID,READY&search=&orderType=&paymentMethod=&date=YYYY-MM-DD&limit=
// -> { data: Order[], meta: { total, date, limit } }
export const listOrders = (query) => get("/cashier/orders", { ...auth, query });
export const getOrder = (code) => get(`/cashier/orders/${code}`, auth).then((r) => r.data);
export const createManualOrder = (payload) => post("/cashier/orders", payload, auth).then((r) => r.data);
export const payCash = (code) => patch(`/cashier/orders/${code}/pay`, undefined, auth).then((r) => r.data);
export const markReady = (code) => patch(`/cashier/orders/${code}/ready`, undefined, auth).then((r) => r.data);
export const markCompleted = (code) => patch(`/cashier/orders/${code}/complete`, undefined, auth).then((r) => r.data);
export const saveNote = (code, internalNote) =>
  patch(`/cashier/orders/${code}/note`, { internalNote }, auth).then((r) => r.data);

// EventSource tidak bisa kirim header, jadi token lewat query (didukung BE)
export const cashierStreamUrl = () => `${API_URL}/cashier/stream?token=${encodeURIComponent(tokenStore.get() || "")}`;
