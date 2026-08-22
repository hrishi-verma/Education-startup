// ---------------------------------------------------------------------------
// Content schema (blueprint §23, §25). Lessons are DATA, not React components,
// so instructors can author without shipping frontend code. The lesson player
// interprets these structures generically.
// ---------------------------------------------------------------------------

/** A reusable implementation/reasoning unit (blueprint §4 Level 1). */
export interface Chunk {
  id: string;
  label: string;
  description: string;
  /**
   * The STRUCTURAL subgoal this chunk accomplishes — subgoal labeling
   * (Margulieux & Guzdial). Labeling the goal of a step, not just its syntax,
   * is the highest-leverage lever for transfer. See learning-design.md.
   */
  subgoalLabel?: string;
  /** Future topics that reuse this chunk — the "you'll need this later" link. */
  reusedIn?: string[];
}

/** A recognition cue: "when you see <trigger>, think <pattern>" (forward intuition). */
export interface Signal {
  trigger: string;
  pattern: string;
}

/**
 * Generic visualization state — the "reusable educational visualization
 * language" from blueprint §9. The engine renders whatever `type` describes;
 * new question kinds reuse the same renderer instead of a bespoke component.
 */
export interface ArrayVizState {
  type: "array";
  values: number[];
  pointers?: { name: string; index: number; color?: string }[];
  /** Indices to highlight (e.g. the pair currently under consideration). */
  highlighted?: number[];
  /** Optional per-lesson caption shown under the array. */
  caption?: string;
}

/** Hash map / set state (Arrays & Hashing). `mode:"set"` renders keys only. */
export interface HashVizState {
  type: "hashmap";
  mode?: "map" | "set";
  /** Name shown above the structure, e.g. "seen" or "counts". */
  label?: string;
  entries: { key: string; value?: string; highlighted?: boolean }[];
  caption?: string;
}

/** Stack state. `values[last]` is the top of the stack (rendered on top). */
export interface StackVizState {
  type: "stack";
  label?: string;
  values: string[];
  /** Highlight the top element (e.g. the one about to be popped). */
  highlightTop?: boolean;
  caption?: string;
}

export type VizState = ArrayVizState | HashVizState | StackVizState;

/** Progressive hint (blueprint §15). Order = escalation level. */
export interface Hint {
  level: number;
  kind: "nudge" | "direction" | "concept" | "structure" | "solution";
  text: string;
}

interface ActivityBase {
  id: string;
  /** Chunks this activity exercises — drives mastery signals (§13). */
  chunks: string[];
  prompt: string;
  hints?: Hint[];
  /** Shown after the student answers, regardless of correctness. */
  explanation?: string;
}

/** Read-only visual intuition step (blueprint stage 1). */
export interface InfoActivity extends ActivityBase {
  kind: "info";
  viz?: VizState;
}

/** Recognition cues for a pattern (SIGNALS step). Ungraded; teaches triggers. */
export interface SignalsActivity extends ActivityBase {
  kind: "signals";
  signals: Signal[];
}

/**
 * Predict / multiple-choice / discriminate (blueprint stages 1–2, §7).
 * - "predict": commit before a viz reveal (generation effect).
 * - "mcq": plain single-answer question.
 * - "discriminate": "which pattern fits?" — the interleaved recognition drill
 *   that builds forward intuition (see learning-design.md, INTERLEAVE step).
 */
export interface ChoiceActivity extends ActivityBase {
  kind: "predict" | "mcq" | "discriminate";
  viz?: VizState;
  options: string[];
  correctIndex: number;
  /** For "predict": the viz state to reveal after the student commits. */
  revealViz?: VizState;
}

/**
 * Order steps into a valid structure (blueprint stage 4, §7).
 * - "ordering": arrange code/pseudocode steps (COMPOSE).
 * - "forward-plan": arrange SUBGOAL labels into a plan for a *fresh* problem,
 *   BEFORE writing code — trains expert forward reasoning (FORWARD PLAN step).
 */
export interface OrderingActivity extends ActivityBase {
  kind: "ordering" | "forward-plan";
  /** Items shown shuffled; correct order is the array order given here. */
  items: string[];
}

/**
 * Fill-in code (blueprint stage 3 / scaffolding stage A–B). We check the
 * normalized answer locally — real sandboxed execution (Judge0/Piston, §20)
 * is deliberately out of scope for a no-infra MVP.
 */
export interface FillCodeActivity extends ActivityBase {
  kind: "fill-code";
  /** Template lines; a line containing `___` marks the editable blank. */
  template: string[];
  /** Accepted answers for the blank (normalized: trimmed, spaces collapsed). */
  accepted: string[];
  viz?: VizState;
}

/**
 * Full coding challenge (blueprint §7 "Full coding problem", §20 execution).
 * The student writes real code in Monaco; it runs against `tests` in an
 * isolated sandbox (Piston) via /api/execute. Correct = all tests pass.
 */
export interface CodeActivity extends ActivityBase {
  kind: "code";
  language: "python";
  /** Starter code shown in the editor. */
  starter: string;
  /** Each test evaluates `call` and compares its printed value to `expected`. */
  tests: { call: string; expected: string }[];
  viz?: VizState;
}

export type Activity =
  | InfoActivity
  | SignalsActivity
  | ChoiceActivity
  | OrderingActivity
  | FillCodeActivity
  | CodeActivity;

/** A structured learning experience (blueprint §25 Lesson). */
export interface Lesson {
  id: string;
  conceptId: string;
  order: number;
  title: string;
  subtitle: string;
  /** Stage in the core loop (§49) this lesson represents. */
  stage: string;
  activities: Activity[];
}

export interface Concept {
  id: string;
  title: string;
  tagline: string;
  chunks: Chunk[];
  /** Recognition cues surfaced on the dashboard and in the SIGNALS lesson. */
  signals?: Signal[];
  lessons: Lesson[];
}
