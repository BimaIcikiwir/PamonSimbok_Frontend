import { formatRupiah } from "../../lib/format";

export default function OrderItems({ order }) {
  return (
    <div>
      <ul className="divide-y divide-dashed divide-soga-200">
        {order.items.map((i) => (
          <li key={i.id} className="flex items-start justify-between gap-3 py-2.5">
            <div>
              <p className="font-semibold">
                {i.quantity}× {i.name}
              </p>
              {i.note && <p className="text-sm italic text-soga-500">“{i.note}”</p>}
            </div>
            <p className="shrink-0 font-display font-bold">{formatRupiah(i.subtotal)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-baseline justify-between border-t-2 border-soga-800 pt-3">
        <span className="font-display font-bold">Total</span>
        <span className="font-display text-2xl font-extrabold">{formatRupiah(order.total)}</span>
      </div>
    </div>
  );
}
