"use client";

import type { Hint } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

// Progressive hints (blueprint §15): revealed one level at a time, escalating
// nudge → direction → concept → structure → solution. Reveal count feeds hint
// dependency in the mastery model.
export default function HintPanel({
  hints,
  revealed,
  onReveal,
}: {
  hints: Hint[];
  revealed: number;
  onReveal: () => void;
}) {
  if (hints.length === 0) return null;
  const sorted = [...hints].sort((a, b) => a.level - b.level);

  return (
    <div className="mt-5">
      <div className="space-y-2">
        {sorted.slice(0, revealed).map((h) => (
          <div
            key={h.level}
            className="rounded-xl border border-warn/30 bg-warn/10 px-3 py-2 text-sm text-fg"
          >
            <Badge tone="warn" className="mr-2 align-middle">
              {h.kind}
            </Badge>
            {h.text}
          </div>
        ))}
      </div>
      {revealed < sorted.length && (
        <button
          type="button"
          onClick={onReveal}
          className="mt-2 text-sm font-medium text-warn underline-offset-2 hover:underline"
        >
          {revealed === 0 ? "Need a hint?" : "Show another hint"} ({revealed}/{sorted.length})
        </button>
      )}
    </div>
  );
}
