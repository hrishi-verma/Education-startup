"use client";

import type { Signal } from "@/lib/types";

// Recognition cues (learning-design.md, SIGNALS step). Renders "when you see
// <trigger>, think <pattern>" pairs — the forward-intuition triggers a learner
// should pattern-match against future problems.
export default function SignalsPanel({ signals }: { signals: Signal[] }) {
  return (
    <div className="space-y-2">
      {signals.map((s, i) => (
        <div
          key={i}
          className="flex flex-col gap-1.5 rounded-xl border border-line bg-surface-2 p-3 sm:flex-row sm:items-center sm:gap-3"
        >
          <span className="flex-1 text-fg">
            <span className="mr-2 rounded bg-surface px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-faint">
              when you see
            </span>
            {s.trigger}
          </span>
          <span aria-hidden className="shrink-0 font-bold text-brand">
            →
          </span>
          <span className="flex-1 font-medium text-brand">{s.pattern}</span>
        </div>
      ))}
    </div>
  );
}
