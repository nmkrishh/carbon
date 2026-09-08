const statusStyles = {
  pending: "bg-gray-100 text-gray-600",
  verified: "bg-green-50 text-green-700",
  listed: "bg-emerald-50 text-emerald-700",
  retired: "bg-slate-200 text-slate-700",
  };
  
  export default function StatusBadge({ status }) {
  return (
  <span
  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
          statusStyles[status] || statusStyles.pending
        }`}
  >
  {status} </span>
  );
  }
  