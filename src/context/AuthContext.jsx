import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, tokenStore, setUnauthorizedHandler } from "../api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [siap, setSiap] = useState(false); // sudah selesai cek token?

  const keluar = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(keluar);
    if (!tokenStore.get()) {
      setSiap(true);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setSiap(true));
  }, [keluar]);

  const masuk = useCallback(async (username, password) => {
    const { token, user } = await authApi.login(username, password);
    tokenStore.set(token);
    setUser(user);
    return user;
  }, []);

  const value = useMemo(
    () => ({ user, siap, masuk, keluar, isAdmin: user?.role === "ADMIN" }),
    [user, siap, masuk, keluar],
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
