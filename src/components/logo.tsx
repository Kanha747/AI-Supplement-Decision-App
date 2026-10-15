export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill={light ? "#f6f1e8" : "#10241c"} />
        <path d="M7 21c4-7 14-7 18 0" fill="none" stroke={light ? "#1c6a48" : "#e7c7a4"} strokeWidth="1.7" />
        <circle cx="16" cy="12.5" r="3.1" fill="#c4622d" />
      </svg>
      <span className={`font-display text-2xl tracking-tight ${light ? "text-[#f6f1e8]" : "text-ink"}`}>
        Evidra
      </span>
    </span>
  );
}
