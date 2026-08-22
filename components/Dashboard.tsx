"use client";

import Link from "next/link";
import type { Concept } from "@/lib/types";
import { useMastery } from "@/lib/useMastery";
import {
  chunkScore,
  conceptScore,
  hintDependency,
  independentSolveRate,
  resetMastery,
} from "@/lib/mastery";
import SignalsPanel from "@/components/SignalsPanel";
import { Card, SectionHeading } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatTile } from "@/components/ui/StatTile";

function pct(x: number) {
  return `${Math.round(x * 100)}%`;
}

// The pattern entry page. Kept deliberately LEAN (coherence, §32): a learner who
// clicks into a pattern should see what it is and where to start — not a wall of
// analytics. Title → one Start/Continue action → the lesson path. All the
// metrics / signals / chunk-mastery detail lives in a collapsed "details"
// section for those who want it.
export default function Dashboard({ concept }: { concept: Concept }) {
  const store = useMastery();
  const chunkIds = concept.chunks.map((c) => c.id);
  const overall = conceptScore(store, chunkIds);
  const started = Object.keys(store.chunks).length > 0;

  const orderedLessons = [...concept.lessons].sort((a, b) => a.order - b.order);
  const doneCount = orderedLessons.filter((l) => store.completedLessons.includes(l.id)).length;
  const nextLesson = orderedLessons.find((l) => !store.completedLessons.includes(l.id)) ?? null;
  const allDone = !nextLesson;
  const nextPos = nextLesson ? orderedLessons.findIndex((l) => l.id === nextLesson.id) + 1 : 0;

  return (
    <div className="space-y-8">
      {/* hero */}
      <section>
        <Badge tone="brand" mono>
          Pattern
        </Badge>
        <h1 className="mt-2 text-3xl font-bold text-fg">{concept.title}</h1>
        <p className="mt-1 text-muted">{concept.tagline}</p>
      </section>

      {/* the single, obvious next action */}
      <Card tone="brand" className="p-6">
        {allDone ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Done</p>
            <h2 className="mt-1 text-xl font-bold text-fg">You finished all {orderedLessons.length} lessons</h2>
            <p className="mt-1 text-muted">Prove it holds up under mixed conditions.</p>
            <ButtonLink className="mt-4" href="/review" variant="accent">
              Mixed review →
            </ButtonLink>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              {started ? `Lesson ${nextPos} of ${orderedLessons.length}` : `${orderedLessons.length} lessons`}
            </p>
            <h2 className="mt-1 text-xl font-bold text-fg">{nextLesson!.title}</h2>
            <p className="mt-1 text-muted">{nextLesson!.subtitle}</p>
            <ButtonLink className="mt-4" href={`/lesson/${nextLesson!.id}`} variant="primary">
              {started ? "Continue →" : "Start learning →"}
            </ButtonLink>
          </>
        )}
      </Card>

      {/* the lesson path — the core of the page */}
      <section>
        <SectionHeading title="Lessons" />
        <ol className="space-y-2">
          {orderedLessons.map((l) => {
            const complete = store.completedLessons.includes(l.id);
            const isNext = l.id === nextLesson?.id;
            return (
              <li key={l.id}>
                <Link
                  href={`/lesson/${l.id}`}
                  className={`flex items-center gap-4 rounded-2xl border px-4 py-3 transition hover:border-muted ${
                    isNext ? "border-brand bg-brand/5" : "border-line bg-surface"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                      complete
                        ? "bg-success/15 text-success"
                        : isNext
                          ? "bg-brand text-brand-fg"
                          : "bg-surface-2 text-faint"
                    }`}
                  >
                    {complete ? "✓" : l.order}
                  </span>
                  <span className="flex-1 font-medium text-fg">{l.title}</span>
                  {isNext && <Badge tone="brand">{started ? "Continue" : "Start"}</Badge>}
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Everything else — progress, signals, chunk mastery — is reference, not
          required to start. Collapsed by default (native <details>). */}
      <details className="group rounded-2xl border border-line bg-surface">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-medium text-muted hover:text-fg">
          <span>
            Progress &amp; pattern details
            {started && <span className="ml-2 text-faint">· {pct(overall)} mastery · {doneCount}/{orderedLessons.length} done</span>}
          </span>
          <span className="text-faint transition group-open:rotate-180" aria-hidden>
            ▾
          </span>
        </summary>

        <div className="space-y-8 border-t border-line px-5 py-6">
          {/* metrics that matter (§29) */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <StatTile label="Concept mastery" value={pct(overall)} hint="Mean of touched chunks" />
            <StatTile label="Pattern recognition" value={pct(chunkScore(store, "pattern-recognition"))} hint="Spotting it unlabeled" />
            <StatTile label="Independent solve" value={pct(independentSolveRate(store))} hint="No-hint correct" />
            <StatTile label="Hint dependency" value={pct(hintDependency(store))} hint="Lower is better" />
            <StatTile label="Lessons done" value={`${doneCount}/${orderedLessons.length}`} hint="Journey progress" />
          </section>

          {/* signals — recognition cues */}
          {concept.signals && concept.signals.length > 0 && (
            <section>
              <SectionHeading title="Signals — when to reach for this" hint="Triggers that should bring this pattern to mind on an unseen problem." />
              <SignalsPanel signals={concept.signals} />
            </section>
          )}

          {/* chunk mastery */}
          <section>
            <SectionHeading title="Chunk mastery" hint="Each chunk's subgoal and where you'll reuse it." />
            <div className="space-y-4">
              {concept.chunks.map((c) => {
                const s = chunkScore(store, c.id);
                const touched = !!store.chunks[c.id];
                return (
                  <div key={c.id}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                      <span className="text-fg">
                        {c.label}
                        {c.subgoalLabel && <span className="ml-2 text-xs italic text-faint">— {c.subgoalLabel}</span>}
                      </span>
                      <span className={`tabular-nums ${touched ? "text-muted" : "text-faint"}`}>
                        {touched ? pct(s) : "—"}
                      </span>
                    </div>
                    <ProgressBar value={s} />
                    {c.reusedIn && c.reusedIn.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        <span className="text-[10px] uppercase tracking-wide text-faint">reused in</span>
                        {c.reusedIn.map((r) => (
                          <span key={r} className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="flex items-center justify-between">
            <Link href="/review" className="text-sm font-medium text-accent hover:underline">
              Mixed review →
            </Link>
            {started && (
              <Button variant="ghost" size="sm" onClick={resetMastery}>
                Reset progress
              </Button>
            )}
          </div>
        </div>
      </details>
    </div>
  );
}
