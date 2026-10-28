import Badge from "../ui/Badge";
import { STATUS } from "../../lib/constants";

export default function StatusBadge({ status, className }) {
  const s = STATUS[status] || STATUS.PENDING;
  return (
    <Badge nada={s.tone} className={className}>
      {s.short}
    </Badge>
  );
}
