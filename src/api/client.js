// Klien HTTP tunggal untuk semua request ke BE Pawon Simbok.
// Format sukses BE : { success: true, message, data, meta? }
// Format gagal BE  : { success: false, code, message, errors? }
//
// VITE_API_URL cukup berisi domain BE saja (tanpa slash di akhir, tanpa /api).
// Contoh: VITE_API_URL=https://be-kamu.onrender.com
// Prefix /api ditambahkan otomatis oleh klien ini.

export const API_URL = (import.meta.env.VITE_API_URL || "")
  .replace(/\/+$/, "")
  .replace(/\/api$/, ""); // jaga-jaga kalau env terlanjur diisi ...onrender.com/api

// Semua endpoint BE berawalan /api. Kalau path sudah berawalan /api, tidak ditambah lagi.
const withApiPrefix = (path) => {
  const p = path.startsWith("/") ? path : `/${path}`;
  return p === "/api" || p.startsWith("/api/") ? p : `/api${p}`;
};

const TOKEN_KEY = "simbok.token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(status, code, message, errors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

// Dipanggil saat BE membalas 401 pada request yang memakai token (token kedaluwarsa)
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

export async function request(
  path,
  { method = "GET", body, query, auth = false, signal } = {},
) {
  const url = new URL(API_URL + withApiPrefix(path));
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    });
  }

  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = tokenStore.get();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      signal,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Tidak bisa terhubung ke server. Periksa koneksi atau alamat API.",
    );
  }

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* body kosong / bukan JSON */
  }

  if (!res.ok || json?.success === false) {
    if (res.status === 401 && auth && onUnauthorized) onUnauthorized();
    throw new ApiError(
      res.status,
      json?.code || "UNKNOWN",
      json?.message || "Terjadi kesalahan",
      json?.errors,
    );
  }
  return json; // { success, message, data, meta }
}

export const get = (path, opts) => request(path, { ...opts, method: "GET" });
export const post = (path, body, opts) =>
  request(path, { ...opts, method: "POST", body });
export const patch = (path, body, opts) =>
  request(path, { ...opts, method: "PATCH", body });
