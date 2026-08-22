"use client";

import { useMemo, useState } from "react";
import type { ChoiceActivity } from "@/lib/types";
import ActivityView, { type AttemptResult } from "@/components/ActivityView";
import { recordAttempt } from "@/lib/mastery";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

// Runs the interleaved discrimination pool (learning-design.md, INTERLEAVE).
// A flat, shuffled sequence of "which pattern?" items — deliberately mixed so
// the learner must discriminate between techniques, not pattern-match a lesson.
export default function ReviewPlayer({ pool }: { pool: ChoiceActivity[] }) {
  const items = useMemo(() => {
    const arr = [...pool];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [pool]);

  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  function handleAnswered(r: AttemptResult) {
    recordAttempt({ chunks: items[index].chunks, correct: r.correct, hintsUsed: r.hintsUsed });
    if (r.correct) setCorrectCount((c) => c + 1);
  }

  function handleContinue() {
    if (index + 1 < items.length) setIndex(index + 1);
    else setDone(true);
  }

  if (done) {
    return (
      <Card tone="accent" className="p-8 text-center">
        <p className="text-4xl">🧠</p>
        <h2 className="mt-2 text-2xl font-bold text-fg">
          Recognition score: {correctCount}/{items.length}
        </h2>
        <p className="mt-1 text-muted">
          Interleaved drills are the real transfer test — spotting the technique with no label.
        </p>
        <ButtonLink className="mt-6" href="/" variant="accent">
          Back to roadmap →
        </ButtonLink>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-sm text-muted">
          <Badge tone="accent" mono>
            INTERLEAVE
          </Badge>
          <span className="tabular-nums">
            {index + 1} / {items.length}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${(index / items.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6 shadow-card sm:p-8">
        <ActivityView
          key={items[index].id}
          activity={items[index]}
          onAnswered={handleAnswered}
          onContinue={handleContinue}
        />
      </Card>
    </div>
  );
}
