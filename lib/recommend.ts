import type { Concept } from "@/lib/types";
import { chunkScore, type MasteryStore } from "@/lib/mastery";

export interface Recommendation {
  headline: string;
  detail: string;
  lessonId?: string;
}

// ---------------------------------------------------------------------------
// Deterministic, rule-based recommendation engine (blueprint §26, §40).
// No ML — just "what skill is weakest, practice it next". This is the product
// differentiation: name the missing skill, not another random problem.
// ---------------------------------------------------------------------------
export function recommend(concept: Concept, store: MasteryStore): Recommendation {
  const MASTERED = 0.8;

  // Weakest touched chunk drives the primary recommendation.
  const touched = concept.chunks
    .map((c) => ({ chunk: c, score: chunkScore(store, c.id) }))
    .filter((x) => store.chunks[x.chunk.id]);

  if (touched.length === 0) {
    return {
      headline: "Start with visual intuition",
      detail: `Begin the ${concept.title} journey — see the setup before any code.`,
      lessonId: concept.lessons[0]?.id,
    };
  }

  touched.sort((a, b) => a.score - b.score);
  const weakest = touched[0];

  if (weakest.score < 0.6) {
    // Find the earliest lesson that exercises the weak chunk.
    const lesson = concept.lessons.find((l) =>
      l.activities.some((a) => a.chunks.includes(weakest.chunk.id)),
    );
    return {
      headline: `Practice: ${weakest.chunk.label}`,
      detail: `Your weakest skill here (${Math.round(weakest.score * 100)}%). ${weakest.chunk.description} Drill this before moving on.`,
      lessonId: lesson?.id,
    };
  }

  // Strong on the fundamentals → push toward transfer (§26 second rule).
  const transfer = concept.lessons.find((l) => l.stage === "TRANSFER");
  if (transfer && chunkScore(store, "pattern-recognition") < MASTERED) {
    return {
      headline: "Try a transfer problem",
      detail: "Your chunks are solid. The real test is recognizing the pattern with no label attached.",
      lessonId: transfer.id,
    };
  }

  return {
    headline: "Strong across the board",
    detail: `You're above ${Math.round(MASTERED * 100)}% on every ${concept.title} chunk. Revisit later for spaced retention (§16).`,
  };
}
