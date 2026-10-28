import { useId } from "react";

const dasar =
  "w-full rounded-2xl border-2 border-soga-200 bg-white px-4 py-2.5 text-soga-800 placeholder:text-soga-300 focus:border-emas-500 focus:outline-none";

export function Field({ label, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block font-display text-sm font-semibold text-soga-700">{label}</label>}
      {children}
      {hint && !error && <p className="text-xs text-soga-400">{hint}</p>}
      {error && <p className="text-xs font-semibold text-sambal-500">{error}</p>}
    </div>
  );
}

export function Input({ label, hint, error, className = "", ...rest }) {
  const id = useId();
  return (
    <Field label={label && <span>{label}</span>} hint={hint} error={error}>
      <input id={id} className={`${dasar} ${error ? "border-sambal-500" : ""} ${className}`} {...rest} />
    </Field>
  );
}

export function Textarea({ label, hint, error, className = "", ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      <textarea rows={3} className={`${dasar} ${className}`} {...rest} />
    </Field>
  );
}

export function Select({ label, hint, error, className = "", children, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      <select className={`${dasar} ${className}`} {...rest}>
        {children}
      </select>
    </Field>
  );
}

// Pilihan bergaya tombol (radio): dipakai untuk jenis pesanan, metode bayar, dll.
export function PilihanKartu({ nilai, onChange, pilihan, kolom = 2 }) {
  return (
    <div role="radiogroup" className={`grid gap-2.5 ${kolom === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {pilihan.map((p) => {
        const aktif = nilai === p.value;
        return (
          <button
            key={p.value}
            type="button"
            role="radio"
            aria-checked={aktif}
            onClick={() => onChange(p.value)}
            className={`rounded-2xl border-2 px-3 py-3 text-left transition ${
              aktif ? "border-soga-800 bg-emas-200 shadow-timbul" : "border-soga-200 bg-white hover:border-soga-400"
            }`}
          >
            <span className="block font-display font-semibold">{p.label}</span>
            {p.desc && <span className="mt-0.5 block text-xs text-soga-500">{p.desc}</span>}
          </button>
        );
      })}
    </div>
  );
}
