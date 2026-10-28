import { useCallback, useEffect, useRef, useState } from "react";

/** Muat data sekali (dan bisa dimuat ulang). fn harus stabil atau dibungkus useCallback. */
export default function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const muat = useCallback(async (diam = false) => {
    if (!diam) setLoading(true);
    try {
      setData(await fnRef.current());
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, setData, error, loading, muat };
}
