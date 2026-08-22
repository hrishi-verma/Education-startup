import { describe, it, expect, beforeEach } from "vitest";
import { recommend } from "@/lib/recommend";
import { loadStore, recordAttempt } from "@/lib/mastery";
import { twoPointers } from "@/content/two-pointers";

beforeEach(() => localStorage.clear());

describe("recommend (deterministic rules, §26)", () => {
  it("sends a brand-new student to visual intuition first", () => {
    const rec = recommend(twoPointers, loadStore());
    expect(rec.headline).toMatch(/visual intuition/i);
    expect(rec.lessonId).toBe(twoPointers.lessons[0].id);
  });

  it("recommends practicing the weakest touched chunk", () => {
    recordAttempt({ chunks: ["initialize-pointers"], correct: false, hintsUsed: 0 }); // ~0.08
    const rec = recommend(twoPointers, loadStore());
    expect(rec.headline).toMatch(/Practice:/);
    expect(rec.headline).toContain("Initialize pointers");
    // points at the first lesson that exercises that chunk
    const lesson = twoPointers.lessons.find((l) =>
      l.activities.some((a) => a.chunks.includes("initialize-pointers")),
    );
    expect(rec.lessonId).toBe(lesson!.id);
  });

  it("pushes to a transfer problem once chunks are solid but recognition lags", () => {
    // two correct attempts → ~0.74 (>= 0.6), pattern-recognition still untouched (0)
    recordAttempt({ chunks: ["initialize-pointers"], correct: true, hintsUsed: 0 });
    recordAttempt({ chunks: ["initialize-pointers"], correct: true, hintsUsed: 0 });
    const rec = recommend(twoPointers, loadStore());
    expect(rec.headline).toMatch(/transfer problem/i);
    const transfer = twoPointers.lessons.find((l) => l.stage === "TRANSFER");
    expect(rec.lessonId).toBe(transfer!.id);
  });

  it("congratulates when even recognition is mastered", () => {
    // three correct → ~0.86 (>= 0.8) on pattern-recognition, nothing else weak
    for (let i = 0; i < 3; i++) {
      recordAttempt({ chunks: ["pattern-recognition"], correct: true, hintsUsed: 0 });
    }
    const rec = recommend(twoPointers, loadStore());
    expect(rec.headline).toMatch(/Strong across the board/i);
    expect(rec.lessonId).toBeUndefined();
  });
});
