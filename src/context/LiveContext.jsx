import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import { cashierApi } from "../api";
import useEventSource from "../hooks/useEventSource";
import { bunyiMasuk } from "../lib/bunyi";
import { useToast } from "./ToastContext";

const LiveCtx = createContext(null);

const EVENTS = ["order.pending_cash", "order.paid", "order.ready", "order.completed", "order.expired", "menu.updated"];

/** Satu koneksi SSE kasir untuk seluruh panel. Halaman mendaftar lewat useLive(). */
export function LiveProvider({ children }) {
  const subs = useRef(new Set());
  const toast = useToast();

  const sebar = useCallback(
    (event, data) => {
      if (event === "order.pending_cash") {
        bunyiMasuk();
        toast.ok(`Pesanan baru ${data.queueLabel} – ${data.customerName} (bayar tunai)`);
      } else if (event === "order.paid" && data.source === "CUSTOMER") {
        bunyiMasuk();
        toast.ok(`Pesanan ${data.queueLabel} – ${data.customerName} sudah dibayar`);
      }
      subs.current.forEach((fn) => fn(event, data));
    },
    [toast],
  );

  const handlers = useMemo(
    () => Object.fromEntries(EVENTS.map((e) => [e, (d) => sebar(e, d)])),
    [sebar],
  );
  const terhubung = useEventSource(cashierApi.cashierStreamUrl(), handlers);

  const subscribe = useCallback((fn) => {
    subs.current.add(fn);
    return () => subs.current.delete(fn);
  }, []);

  const value = useMemo(() => ({ terhubung, subscribe }), [terhubung, subscribe]);
  return <LiveCtx.Provider value={value}>{children}</LiveCtx.Provider>;
}

export const useLive = () => useContext(LiveCtx);
