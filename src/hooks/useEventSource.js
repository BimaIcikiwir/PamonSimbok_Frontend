import { useEffect, useRef, useState } from "react";

/**
 * Berlangganan SSE dari BE. EventSource otomatis menyambung ulang (BE mengirim retry: 3000).
 * @param url      alamat stream, null untuk menonaktifkan
 * @param handlers { namaEvent: (data) => void }
 */
export default function useEventSource(url, handlers) {
  const ref = useRef(handlers);
  ref.current = handlers;
  const [terhubung, setTerhubung] = useState(false);

  useEffect(() => {
    if (!url) return;
    const es = new EventSource(url);
    es.onopen = () => setTerhubung(true);
    es.onerror = () => setTerhubung(false);

    const nama = Object.keys(ref.current);
    const pasang = nama.map((n) => {
      const fn = (e) => {
        try {
          ref.current[n]?.(JSON.parse(e.data));
        } catch {
          /* data bukan JSON */
        }
      };
      es.addEventListener(n, fn);
      return [n, fn];
    });

    return () => {
      pasang.forEach(([n, fn]) => es.removeEventListener(n, fn));
      es.close();
      setTerhubung(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, Object.keys(handlers).join(",")]);

  return terhubung;
}
