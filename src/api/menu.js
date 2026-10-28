import { get, post, patch } from "./client";

// Publik: [{ id, name, sortOrder, items: [{ id, categoryId, name, description, price, imageUrl, isAvailable }] }]
export const getMenu = () => get("/menu").then((r) => r.data);

// Kasir + Admin
export const setAvailability = (id, isAvailable) =>
  patch(`/cashier/menu-items/${id}/availability`, { isAvailable }, { auth: true }).then((r) => r.data);

// Admin saja
export const createMenuItem = (payload) =>
  post("/cashier/menu-items", payload, { auth: true }).then((r) => r.data);
export const updateMenuItem = (id, payload) =>
  patch(`/cashier/menu-items/${id}`, payload, { auth: true }).then((r) => r.data);
