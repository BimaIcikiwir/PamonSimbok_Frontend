import { useEffect, useRef } from "react";

export default function Modal({ buka, onTutup, judul, children, lebar = "max-w-lg" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (buka && !el.open) el.showModal();
    if (!buka && el.open) el.close();
  }, [buka]);

  return (
    <dialog
      ref={ref}
      onClose={onTutup}
      onClick={(e) => e.target === ref.current && onTutup()}
      className={`m-auto w-[calc(100%-2rem)] ${lebar} overflow-hidden rounded-[2rem] border-2 border-soga-800 bg-gading-50 p-0 text-soga-800 shadow-kartu backdrop:bg-soga-900/60 backdrop:backdrop-blur-[2px]`}
    >
      {buka && (
        <div>
          <div className="batik-parang h-3 bg-soga-800" aria-hidden="true" />
          <div className="flex items-center justify-between px-6 pt-5">
            <h2 className="text-2xl font-bold">{judul}</h2>
            <button onClick={onTutup} aria-label="Tutup" className="grid h-9 w-9 place-items-center rounded-full text-xl hover:bg-soga-100">
              ×
            </button>
          </div>
          <div className="px-6 pb-6 pt-3">{children}</div>
        </div>
      )}
    </dialog>
  );
}
