"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lesson } from "@/lib/types";
import ActivityView, { type AttemptResult } from "@/components/ActivityView";
import { markLessonComplete, recordAttempt } from "@/lib/mastery";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

type LessonRef = { id: string; title: string } | null;

// The generic lesson player (blueprint §32 Lesson Engine / Phase 4). It walks a
// data-defined lesson's activities in a distraction-free focus card (coherence),
// records mastery, and — crucially for the step-by-step feel — hands straight
// off to the NEXT lesson (1..n) when this one finishes. Concept-agnostic.
export default function LessonPlayer({
  lesson,
  conceptId,
  prev,
  next,
}: {
  lesson: Lesson;
  conceptId: string;
  prev?: LessonRef;
  next?: LessonRef;
}) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const total = lesson.activities.length;
  const activity = lesson.activities[index];

  function handleAnswered(r: AttemptResult) {
    if (activity.chunks.length > 0) {
      recordAttempt({ chunks: activity.chunks, correct: r.correct, hintsUsed: r.hintsUsed });
    }
  }

  function handleContinue() {
    if (index + 1 < total) {
      setIndex(index + 1);
    } else {
      markLessonComplete(lesson.id);
      setDone(true);
    }
  }

  if (done) {
    return (
      <Card tone="success" className="p-8 text-center">
        <p className="text-4xl">{next ? "✅" : "🎉"}</p>
        <h2 className="mt-2 text-2xl font-bold text-fg">
          {next ? "Lesson complete" : "Topic complete!"}
        </h2>
        <p className="mt-1 text-muted">
          {next
            ? "Mastery updated. Keep the momentum — straight on to the next step."
            : "You finished every lesson in this topic. Now prove it under mixed conditions."}
        </p>

        <div className="mt-6 flex flex-col items-center gap-3">
          {next ? (
            <ButtonLink href={`/lesson/${next.id}`} variant="primary">
              Next: {next.title} →
            </ButtonLink>
          ) : (
            <ButtonLink href="/review" variant="accent">
              Go to mixed review →
            </ButtonLink>
          )}
          <Link href={`/concept/${conceptId}`} className="text-sm text-muted hover:text-fg">
            Back to dashboard
          </Link>
        </div>
      </Card>
    );
  }

  const pctDone = (index / total) * 100;

  return (
    <div>
      {/* Step progress rail — only meaningful when a lesson has multiple steps.
          For single-step lessons it's just noise, so we omit it (coherence). */}
      {total > 1 && (
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between text-sm text-muted">
            <span className="uppercase tracking-wide text-faint">Step</span>
            <span className="tabular-nums">
              {index + 1} / {total}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${pctDone}%` }} />
          </div>
        </div>
      )}

      {/* the single focus card */}
      <Card className="p-6 shadow-card sm:p-8">
        <ActivityView
          key={activity.id}
          activity={activity}
          onAnswered={handleAnswered}
          onContinue={handleContinue}
        />
      </Card>

      {/* quiet sequential nav (does not distract from the task) */}
      <div className="mt-4 flex items-center justify-between text-sm">
        {prev ? (
          <Link href={`/lesson/${prev.id}`} className="text-muted hover:text-fg">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/lesson/${next.id}`} className="text-muted hover:text-fg">
            Skip to {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
