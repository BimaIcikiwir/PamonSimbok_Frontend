import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [list, setList] = useState([]);

  const tampil = useCallback((pesan, nada = "ok") => {
    const id = crypto.randomUUID();
    setList((l) => [...l, { id, pesan, nada }]);
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 4000);
  }, []);

  const value = useMemo(
    () => ({ tampil, ok: (m) => tampil(m, "ok"), gagal: (m) => tampil(m, "gagal") }),
    [tampil],
  );

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4">
        {list.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto max-w-md rounded-full border-2 px-5 py-2.5 font-display font-semibold shadow-kartu ${
              t.nada === "gagal" ? "border-soga-900 bg-sambal-500 text-white" : "border-soga-900 bg-soga-800 text-emas-300"
            }`}
          >
            {t.pesan}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
