import { describe, it, expect, beforeEach } from "vitest";
import {
  loadStore,
  recordAttempt,
  markLessonComplete,
  chunkScore,
  conceptScore,
  hintDependency,
  independentSolveRate,
  resetMastery,
} from "@/lib/mastery";

// The EWMA math (see lib/mastery.ts): ALPHA=0.45, a fresh chunk starts at 0.15,
// outcome = correct ? max(0.35, 1 - 0.2*hints) : 0.
beforeEach(() => {
  localStorage.clear();
});

describe("recordAttempt / chunkScore", () => {
  it("raises a fresh chunk toward 1 on a correct, hint-free attempt", () => {
    recordAttempt({ chunks: ["a"], correct: true, hintsUsed: 0 });
    // 0.15 + 0.45*(1 - 0.15) = 0.5325
    expect(chunkScore(loadStore(), "a")).toBeCloseTo(0.5325, 4);
  });

  it("pulls the score down toward 0 on a wrong attempt", () => {
    recordAttempt({ chunks: ["a"], correct: false, hintsUsed: 0 });
    // 0.15 + 0.45*(0 - 0.15) = 0.0825
    expect(chunkScore(loadStore(), "a")).toBeCloseTo(0.0825, 4);
  });

  it("discounts a correct answer by hints used", () => {
    recordAttempt({ chunks: ["a"], correct: true, hintsUsed: 1 }); // outcome 0.8
    // 0.15 + 0.45*(0.8 - 0.15) = 0.4425
    expect(chunkScore(loadStore(), "a")).toBeCloseTo(0.4425, 4);
  });

  it("updates every chunk named in the attempt", () => {
    recordAttempt({ chunks: ["a", "b"], correct: true, hintsUsed: 0 });
    const s = loadStore();
    expect(chunkScore(s, "a")).toBeCloseTo(0.5325, 4);
    expect(chunkScore(s, "b")).toBeCloseTo(0.5325, 4);
  });

  it("converges upward with repeated correct attempts", () => {
    recordAttempt({ chunks: ["a"], correct: true, hintsUsed: 0 });
    recordAttempt({ chunks: ["a"], correct: true, hintsUsed: 0 });
    // 0.5325 + 0.45*(1 - 0.5325) ≈ 0.7429
    expect(chunkScore(loadStore(), "a")).toBeCloseTo(0.7429, 3);
  });

  it("returns 0 for an untouched chunk", () => {
    expect(chunkScore(loadStore(), "never")).toBe(0);
  });
});

describe("conceptScore", () => {
  it("averages only the chunks the student has touched", () => {
    recordAttempt({ chunks: ["a"], correct: true, hintsUsed: 0 }); // 0.5325
    recordAttempt({ chunks: ["b"], correct: false, hintsUsed: 0 }); // 0.0825
    // untouched "c" is excluded from the mean
    const avg = conceptScore(loadStore(), ["a", "b", "c"]);
    expect(avg).toBeCloseTo((0.5325 + 0.0825) / 2, 4);
  });

  it("is 0 when no chunk has been touched", () => {
    expect(conceptScore(loadStore(), ["a", "b"])).toBe(0);
  });
});

describe("aggregate metrics (§29)", () => {
  it("independentSolveRate counts only hint-free attempts", () => {
    recordAttempt({ chunks: ["a"], correct: true, hintsUsed: 0 });
    recordAttempt({ chunks: ["a"], correct: false, hintsUsed: 0 });
    recordAttempt({ chunks: ["a"], correct: true, hintsUsed: 2 }); // hinted → ignored
    expect(independentSolveRate(loadStore())).toBeCloseTo(0.5, 4); // 1 of 2 hint-free
  });

  it("hintDependency is the share of attempts that used a hint", () => {
    recordAttempt({ chunks: ["a"], correct: true, hintsUsed: 0 });
    recordAttempt({ chunks: ["a"], correct: true, hintsUsed: 1 });
    // total per-chunk attempts = 2, hint-free = 1 → dependency = 1 - 1/2 = 0.5
    expect(hintDependency(loadStore())).toBeCloseTo(0.5, 4);
  });

  it("both metrics are 0 with no attempts", () => {
    const s = loadStore();
    expect(independentSolveRate(s)).toBe(0);
    expect(hintDependency(s)).toBe(0);
  });
});

describe("lesson completion + reset", () => {
  it("records completed lessons without duplicates", () => {
    markLessonComplete("l1");
    markLessonComplete("l1");
    markLessonComplete("l2");
    expect(loadStore().completedLessons).toEqual(["l1", "l2"]);
  });

  it("resetMastery clears everything", () => {
    recordAttempt({ chunks: ["a"], correct: true, hintsUsed: 0 });
    markLessonComplete("l1");
    resetMastery();
    const s = loadStore();
    expect(s.chunks).toEqual({});
    expect(s.completedLessons).toEqual([]);
    expect(s.independentAttempts).toBe(0);
  });
});
