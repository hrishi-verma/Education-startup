"use client";

import { motion } from "framer-motion";
import type { StackVizState } from "@/lib/types";

// Stack visualizer (blueprint §8, §9). Renders values bottom→top with the top
// element on top and marked; pushes/pops animate. Theme-aware via tokens.
export default function StackViz({ state }: { state: StackVizState }) {
  const { values, label, highlightTop, caption } = state;
  const topIndex = values.length - 1;

  return (
    <div className="flex w-full flex-col items-center">
      {label && <p className="mb-2 font-mono text-sm text-muted">{label}</p>}
      <div className="flex w-40 flex-col-reverse gap-1">
        {values.length === 0 && (
          <span className="rounded-lg border border-dashed border-line px-4 py-2 text-center text-sm text-faint">
            empty
          </span>
        )}
        {values.map((v, i) => {
          const isTop = i === topIndex;
          return (
            <motion.div
              key={`${i}-${v}`}
              layout
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={`relative rounded-lg border px-3 py-2 text-center font-mono text-sm ${
                isTop && highlightTop
                  ? "border-brand bg-brand/15 text-fg"
                  : "border-line bg-surface-2 text-fg"
              }`}
            >
              {v}
              {isTop && (
                <span className="absolute -right-14 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wide text-brand">
                  ← top
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
      {caption && <p className="mt-3 text-center font-mono text-sm text-muted">{caption}</p>}
    </div>
  );
}
