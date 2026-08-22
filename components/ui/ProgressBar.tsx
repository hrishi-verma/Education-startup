// Mastery-aware progress bar. Color signals proficiency band (signaling):
// amber (developing) → brand (proficient) → success (mastered). Always carries
// an ARIA meter role for screen readers (blueprint §35).
export function ProgressBar({
  value,
  className,
}: {
  value: number; // 0..1
  className?: string;
}) {
  const color =
    value >= 0.8 ? "bg-success" : value >= 0.55 ? "bg-brand" : "bg-warn";
  return (
    <div
      role="meter"
      aria-valuenow={Math.round(value * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-2 w-full overflow-hidden rounded-full bg-surface-2 ${className ?? ""}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.max(3, value * 100)}%` }}
      />
    </div>
  );
}
