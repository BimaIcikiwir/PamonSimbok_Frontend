import { get, post } from "./client";

export const login = (username, password) => post("/auth/login", { username, password }).then((r) => r.data);
export const me = () => get("/auth/me", { auth: true }).then((r) => r.data);
