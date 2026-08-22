"use client";

// ---------------------------------------------------------------------------
// Mastery model (blueprint §13, §29). Multi-level, not "problems solved".
// Per-chunk scores updated by an exponential moving average toward the outcome
// of each attempt; hint usage discounts the outcome so hint-dependency is
// visible. Persisted to localStorage so the MVP runs with zero backend infra
// (a real build would move this into Postgres per §25 StudentChunkMastery).
// ---------------------------------------------------------------------------

const STORE_KEY = "chunk-mastery-v1";
const ALPHA = 0.45; // learning rate of the EWMA

export interface ChunkStat {
  score: number; // 0..1
  attempts: number;
  correct: number;
  hintsUsed: number; // cumulative hint reveals on this chunk
}

export interface MasteryStore {
  chunks: Record<string, ChunkStat>;
  completedLessons: string[];
  /** Aggregate signals for the metrics that matter (§29). */
  independentAttempts: number; // attempts made with zero hints
  independentCorrect: number;
}

const EMPTY: MasteryStore = {
  chunks: {},
  completedLessons: [],
  independentAttempts: 0,
  independentCorrect: 0,
};

export function loadStore(): MasteryStore {
  if (typeof window === "undefined") return structuredClone(EMPTY);
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return structuredClone(EMPTY);
    return { ...structuredClone(EMPTY), ...JSON.parse(raw) };
  } catch {
    return structuredClone(EMPTY);
  }
}

function save(store: MasteryStore) {
  window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event("mastery-change"));
}

/** Record the outcome of a single activity attempt against its chunks. */
export function recordAttempt(params: {
  chunks: string[];
  correct: boolean;
  hintsUsed: number;
}) {
  const { chunks, correct, hintsUsed } = params;
  const store = loadStore();

  // Correct-with-no-hints = full credit; each hint discounts; wrong = 0.
  const outcome = correct ? Math.max(0.35, 1 - 0.2 * hintsUsed) : 0;

  for (const id of chunks) {
    const prev: ChunkStat = store.chunks[id] ?? {
      score: 0.15,
      attempts: 0,
      correct: 0,
      hintsUsed: 0,
    };
    store.chunks[id] = {
      score: prev.score + ALPHA * (outcome - prev.score),
      attempts: prev.attempts + 1,
      correct: prev.correct + (correct ? 1 : 0),
      hintsUsed: prev.hintsUsed + hintsUsed,
    };
  }

  if (hintsUsed === 0) {
    store.independentAttempts += 1;
    if (correct) store.independentCorrect += 1;
  }

  save(store);
}

export function markLessonComplete(lessonId: string) {
  const store = loadStore();
  if (!store.completedLessons.includes(lessonId)) {
    store.completedLessons.push(lessonId);
    save(store);
  }
}

export function chunkScore(store: MasteryStore, chunkId: string): number {
  return store.chunks[chunkId]?.score ?? 0;
}

/** Concept mastery = mean of the mastery of chunks the student has touched. */
export function conceptScore(store: MasteryStore, chunkIds: string[]): number {
  const seen = chunkIds.filter((id) => store.chunks[id]);
  if (seen.length === 0) return 0;
  return seen.reduce((s, id) => s + store.chunks[id].score, 0) / seen.length;
}

/** §29 Hint Dependency: share of attempts that needed at least one hint. */
export function hintDependency(store: MasteryStore): number {
  const totalAttempts = Object.values(store.chunks).reduce((s, c) => s + c.attempts, 0);
  if (totalAttempts === 0) return 0;
  const independent = store.independentAttempts;
  return 1 - independent / totalAttempts;
}

/** §29 Independent Solve Rate: correct-with-no-hints / no-hint attempts. */
export function independentSolveRate(store: MasteryStore): number {
  if (store.independentAttempts === 0) return 0;
  return store.independentCorrect / store.independentAttempts;
}

export function resetMastery() {
  window.localStorage.removeItem(STORE_KEY);
  window.dispatchEvent(new Event("mastery-change"));
}
