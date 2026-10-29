// The dot's colour follows the status, the same on every project; each
// project's own accent colour stays on its card border and links.
const DOTS = {
  SHIPPED: "bg-ok",
  COMPLETED: "bg-ok",
  "IN PROGRESS": "animate-pulse bg-amber",
};

export default function StatusBadge({ status }) {
  return (
    <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-inkmuted">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${DOTS[status] ?? "bg-inkmuted"}`}
      />
      {status}
    </span>
  );
}
