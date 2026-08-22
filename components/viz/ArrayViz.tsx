"use client";

import { motion } from "framer-motion";
import type { ArrayVizState } from "@/lib/types";

// ---------------------------------------------------------------------------
// Generic array visualizer (blueprint §8 React+SVG, §9 visualization language).
// Renders whatever ArrayVizState it's handed and animates pointer moves with
// Motion. Theme-aware: cell fills use design tokens (fill-[rgb(var(--…))]) so
// it reads correctly in light and dark. Pointer colors come from content.
// ---------------------------------------------------------------------------

const CELL = 60;
const GAP = 12;
const STRIDE = CELL + GAP;

export default function ArrayViz({ state }: { state: ArrayVizState }) {
  const { values, pointers = [], highlighted = [], caption } = state;
  const width = values.length * STRIDE - GAP;
  const cellY = 40;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={width}
        height={cellY + CELL + 62}
        viewBox={`-4 0 ${width + 8} ${cellY + CELL + 62}`}
        role="img"
        aria-label={`Array ${values.join(", ")}. ${pointers
          .map((p) => `${p.name} at index ${p.index}, value ${values[p.index]}`)
          .join(". ")}`}
        className="mx-auto"
      >
        {values.map((_, i) => (
          <text
            key={`idx-${i}`}
            x={i * STRIDE + CELL / 2}
            y={26}
            textAnchor="middle"
            className="fill-[rgb(var(--faint))] text-xs"
          >
            {i}
          </text>
        ))}

        {values.map((v, i) => {
          const isHot = highlighted.includes(i);
          return (
            <g key={`cell-${i}`}>
              <rect
                x={i * STRIDE}
                y={cellY}
                width={CELL}
                height={CELL}
                rx={12}
                strokeWidth={2}
                className={`transition-colors duration-300 ${
                  isHot
                    ? "fill-[rgb(var(--brand)/0.18)] stroke-[rgb(var(--brand))]"
                    : "fill-[rgb(var(--surface-2))] stroke-[rgb(var(--line))]"
                }`}
              />
              <text
                x={i * STRIDE + CELL / 2}
                y={cellY + CELL / 2 + 7}
                textAnchor="middle"
                className="fill-[rgb(var(--fg))] text-xl font-semibold"
              >
                {v}
              </text>
            </g>
          );
        })}

        {pointers.map((p) => {
          const color = p.color ?? "rgb(var(--brand))";
          return (
            <motion.g
              key={`ptr-${p.name}`}
              initial={false}
              animate={{ x: p.index * STRIDE }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <path
                d={`M ${CELL / 2} ${cellY + CELL + 6} l -7 12 l 14 0 z`}
                fill={color}
              />
              <text
                x={CELL / 2}
                y={cellY + CELL + 40}
                textAnchor="middle"
                fill={color}
                className="text-sm font-bold"
              >
                {p.name}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {caption && (
        <p className="mt-1 text-center font-mono text-sm text-muted">{caption}</p>
      )}
    </div>
  );
}
