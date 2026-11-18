const styles = {
  LOST: "bg-red-100 text-red-700",
  FOUND: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
};

const dots = {
  LOST: "bg-red-500",
  FOUND: "bg-emerald-500",
  PENDING: "bg-amber-500",
  APPROVED: "bg-emerald-500",
  REJECTED: "bg-red-500",
};

const StatusBadge = ({ status, className = "" }) => {
  const key = String(status || "").toUpperCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
        styles[key] || "bg-slate-100 text-slate-700"
      } ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dots[key] || "bg-slate-400"}`}
      />
      {status}
    </span>
  );
};

export default StatusBadge;
