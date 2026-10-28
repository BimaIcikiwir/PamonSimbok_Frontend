import { useEffect, useRef } from "react";
import { useLive } from "../context/LiveContext";

/** Dengarkan event realtime kasir: fn(event, data). */
export default function useLiveEvents(fn) {
  const { subscribe } = useLive();
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => subscribe((e, d) => ref.current(e, d)), [subscribe]);
}
