import { Card } from "./Card";

// KPI tile for the "metrics that matter" (blueprint §29). Big number, label,
// one-line hint. Spatial-contiguity: hint sits with its metric, not elsewhere.
export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="p-4">
      <p className="text-2xl font-bold tabular-nums text-fg">{value}</p>
      <p className="text-sm font-medium text-fg">{label}</p>
      <p className="mt-0.5 text-xs text-faint">{hint}</p>
    </Card>
  );
}
