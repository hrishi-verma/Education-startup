"use client";

import { motion } from "framer-motion";
import type { HashVizState } from "@/lib/types";

// Hash map / set visualizer (blueprint §8, §9). Renders key→value cells (or
// keys only in set mode) as a row of chips, with an optional label above and a
// caption below — theme-aware via design tokens. New entries animate in.
export default function HashViz({ state }: { state: HashVizState }) {
  const { entries, mode = "map", label, caption } = state;

  return (
    <div className="w-full">
      {label && (
        <p className="mb-2 text-center font-mono text-sm text-muted">
          {label} = {mode === "set" ? "{ … }" : "{ … }"}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {entries.length === 0 && (
          <span className="rounded-lg border border-dashed border-line px-4 py-2 text-sm text-faint">
            empty
          </span>
        )}
        {entries.map((e) => (
          <motion.div
            key={e.key}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className={`flex items-stretch overflow-hidden rounded-lg border font-mono text-sm ${
              e.highlighted ? "border-brand bg-brand/15" : "border-line bg-surface-2"
            }`}
          >
            <span className="px-2.5 py-1.5 font-semibold text-fg">{e.key}</span>
            {mode === "map" && (
              <span className="border-l border-line bg-surface px-2.5 py-1.5 text-muted">
                {e.value ?? "—"}
              </span>
            )}
          </motion.div>
        ))}
      </div>
      {caption && (
        <p className="mt-3 text-center font-mono text-sm text-muted">{caption}</p>
      )}
    </div>
  );
}
