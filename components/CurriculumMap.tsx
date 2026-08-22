"use client";

import Link from "next/link";
import {
  CANVAS_H,
  CANVAS_W,
  curriculumEdges,
  curriculumNodes,
  getNode,
} from "@/lib/curriculum";
import { conceptScore } from "@/lib/mastery";
import { useMastery } from "@/lib/useMastery";
import { arraysHashing } from "@/content/arrays-hashing";
import { twoPointers } from "@/content/two-pointers";
import { slidingWindow } from "@/content/sliding-window";
import { binarySearch } from "@/content/binary-search";
import { stack } from "@/content/stack";

const NODE_W = 170;
const NODE_H = 62;
const MASTERED = 0.8;

const BUILT_CHUNKS: Record<string, string[]> = {
  "arrays-hashing": arraysHashing.chunks.map((c) => c.id),
  "two-pointers": twoPointers.chunks.map((c) => c.id),
  "sliding-window": slidingWindow.chunks.map((c) => c.id),
  "binary-search": binarySearch.chunks.map((c) => c.id),
  stack: stack.chunks.map((c) => c.id),
};

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className={`h-3 w-3 rounded-full border ${className}`} />
      {label}
    </span>
  );
}

export default function CurriculumMap() {
  const store = useMastery();

  const progressOf = (conceptId?: string): number =>
    conceptId && BUILT_CHUNKS[conceptId] ? conceptScore(store, BUILT_CHUNKS[conceptId]) : 0;

  // Prerequisite gating is currently DISABLED — all patterns are kept unlocked
  // by request, so learners can explore the whole roadmap freely. (The
  // prereq-based gate is preserved below, commented, to re-enable later.)
  const isUnlocked = (_nodeId: string): boolean => true;
  // const isUnlocked = (nodeId: string): boolean => {
  //   const prereqs = prerequisitesOf(nodeId);
  //   if (prereqs.length === 0) return true;
  //   return prereqs.every((p) => progressOf(getNode(p)?.conceptId) >= MASTERED);
  // };

  return (
    <div>
      <section className="mb-5">
        <h1 className="text-3xl font-bold text-fg">Learning roadmap</h1>
        <p className="mt-1 text-muted">
          Everything's unlocked — explore freely. Five topics are live (Arrays &amp; Hashing, Two
          Pointers, Sliding Window, Binary Search, Stack); the rest of the graph is coming.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          <LegendDot className="border-brand bg-brand/40" label="Live — playable" />
          <LegendDot className="border-line bg-surface-2" label="Unlocked — coming soon" />
        </div>
      </section>

      <div className="overflow-auto rounded-2xl border border-line bg-[radial-gradient(circle,rgb(var(--line))_1px,transparent_1px)] [background-size:22px_22px]">
        <div className="relative" style={{ width: CANVAS_W, height: CANVAS_H }}>
          <svg width={CANVAS_W} height={CANVAS_H} className="absolute inset-0" aria-hidden="true">
            {curriculumEdges.map(([from, to]) => {
              const a = getNode(from)!;
              const b = getNode(to)!;
              const x1 = a.x;
              const y1 = a.y + NODE_H / 2;
              const x2 = b.x;
              const y2 = b.y - NODE_H / 2;
              const midY = (y1 + y2) / 2;
              return (
                <path
                  key={`${from}-${to}`}
                  d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                  fill="none"
                  className="stroke-[rgb(var(--line))]"
                  strokeWidth={2}
                />
              );
            })}
          </svg>

          {curriculumNodes.map((n) => {
            const live = !!n.conceptId;
            const unlocked = isUnlocked(n.id);
            const progress = progressOf(n.conceptId);
            const isRoot = n.id === "arrays-hashing";

            const card = (
              <div
                className={`flex h-full w-full flex-col justify-center rounded-xl border px-3 py-2 text-center shadow-card transition ${
                  live
                    ? "border-brand bg-brand/10 hover:bg-brand/20"
                    : isRoot
                      ? "border-success/50 bg-success/10"
                      : unlocked
                        ? "border-line bg-surface"
                        : "border-line bg-surface-2 opacity-70"
                }`}
              >
                <span
                  className={`text-sm font-semibold leading-tight ${
                    live || isRoot ? "text-fg" : unlocked ? "text-fg" : "text-faint"
                  }`}
                >
                  {n.label}
                </span>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={progress >= MASTERED ? "h-full bg-success" : "h-full bg-brand"}
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                {live ? (
                  <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-brand">
                    Live · {Math.round(progress * 100)}%
                  </span>
                ) : (
                  <span className="mt-1 text-[10px] uppercase tracking-wide text-faint">
                    {isRoot ? "Start" : "Soon"}
                  </span>
                )}
              </div>
            );

            const style = {
              left: n.x - NODE_W / 2,
              top: n.y - NODE_H / 2,
              width: NODE_W,
              height: NODE_H,
            } as const;

            return live ? (
              <Link key={n.id} href={`/concept/${n.conceptId}`} className="absolute block" style={style}>
                {card}
              </Link>
            ) : (
              <div
                key={n.id}
                className="absolute cursor-not-allowed"
                style={style}
                title={unlocked ? "Coming soon" : "Locked — finish prerequisites first"}
              >
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
