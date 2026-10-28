import Gunungan from "../ornaments/Gunungan";

export default function EmptyState({ judul, children, aksi }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
      <Gunungan className="h-20 w-20 text-soga-200" />
      <h3 className="text-xl font-bold">{judul}</h3>
      {children && <p className="max-w-sm text-soga-500">{children}</p>}
      {aksi}
    </div>
  );
}
