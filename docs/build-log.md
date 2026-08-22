# Build Log

A sequential record of every change, install, and decision made while
implementing the product blueprint (`docs/product/blueprint.md`). Newest entries
at the bottom. Read top-to-bottom to reconstruct how and why the codebase got
here.

> Note: earlier entries reference doc files by their original root paths
> (`BUILD_LOG.md`, `LEARNING_DESIGN.md`, `coding_education_startup_blueprint.md`).
> As of Session 4 all docs moved under `docs/` — see that entry for the mapping.

Format for each entry:
- **What** — the change made
- **Why** — the reason / decision rationale
- **Refs** — blueprint section(s) it implements, when relevant

---

## Session 1 — 2026-08-15 — Two Pointers MVP slice

### Scope decision
- **What:** Chose to implement only the **Two Pointers** vertical slice as a
  fully runnable app, not the entire blueprint.
- **Why:** The blueprint is a ~1900-line product spec (months of work). It
  explicitly prescribes an MVP of two vertical slices (§37) and a phased build
  order (§43). User confirmed: option 1 ("Two Pointers MVP"), "fully working".
  Two Pointers first because it has the simplest visualization and exercises
  the whole core loop; BFS is deferred (would add React Flow graph/queue viz).
- **Refs:** §37, §43, §49.

### Stack decision
- **What:** Next.js (App Router) + React 19 + TypeScript + Tailwind v3 +
  Framer Motion. **No database, no code-execution sandbox** for this MVP —
  mastery is persisted in `localStorage`; "code" activities are fill-in-the-
  blank checked locally.
- **Why:** The blueprint calls for Next/React/TS/Tailwind/Motion (§21, §45) —
  followed as-is. Postgres/Prisma (§21) and Judge0/Piston execution (§20) need
  infra; blueprint says code-to-visual sync and real execution are optional for
  the first MVP (§10, §20). Dropping them keeps the app "fully working" with
  `npm install && npm run dev` and zero external services. Framer Motion =
  the blueprint's "Motion for React" (§8) for pointer animation.
- **Refs:** §8, §10, §20, §21, §45.

### Files created (in order)

**Project config**
- `package.json` — deps: next, react, react-dom, framer-motion; dev: typescript,
  tailwind, postcss, autoprefixer, types. Scripts: dev/build/start/lint.
- `tsconfig.json` — standard Next.js TS config; `@/*` path alias to repo root.
- `next.config.mjs` — React strict mode on.
- `postcss.config.mjs`, `tailwind.config.ts` — Tailwind v3 wiring; content globs
  for app/components/lib.
- `next-env.d.ts` — Next TS ambient types.
- `.gitignore` — ignore node_modules, .next, env files, etc.

**Domain / content-as-data** (blueprint §23: content must be separate from code)
- `lib/types.ts` — the content schema: `Chunk`, `VizState` (generic viz
  language, §9), `Activity` union (info / predict / mcq / ordering / fill-code,
  §7), `Hint` (§15), `Lesson`, `Concept`. Lessons are DATA the player
  interprets — no per-question React components (§9).
- `content/two-pointers.ts` — the full Two Pointers journey as a typed `Concept`:
  7 chunks + 8 lessons walking SEE → PREDICT → PRACTICE CHUNK → COMBINE →
  PSEUDOCODE → IMPLEMENT → SOLVE → TRANSFER (§39, §49). Running example:
  sorted `[2,4,7,9,12]`, find a pair summing to a target.
- `lib/content.ts` — content registry + lookup helpers. Adding BFS later is a
  data change here; player/viz/mastery stay concept-agnostic.

**Mastery + recommendation** (§13, §26, §29)
- `lib/mastery.ts` — multi-level mastery model. Per-chunk score via exponential
  moving average toward each attempt's outcome; hint usage discounts the
  outcome so hint-dependency is measurable. Persisted to localStorage (stands in
  for §25 `StudentChunkMastery`). Exposes `independentSolveRate`,
  `hintDependency` — the "metrics that matter" (§29), not "problems solved".
- `lib/useMastery.ts` — React hook subscribing components to the store via a
  `mastery-change` event.
- `lib/recommend.ts` — deterministic, rule-based recommender (§26): surfaces the
  weakest touched chunk, or pushes to the transfer problem once chunks are
  solid. **No ML** — matches §26/§40 ("we know what skill you're missing").

**Visualization engine** (§8, §9 — "generic engine, not a component per question")
- `components/viz/ArrayViz.tsx` — SVG array renderer; animates pointer moves with
  Framer Motion; ARIA label for screen readers (§35).
- `components/viz/VizRenderer.tsx` — dispatches a `VizState` by `type`. BFS graph
  viz would be a new case here, nothing else changes.

**Lesson player + activities** (§32 Lesson Engine / §43 Phase 4)
- `components/HintPanel.tsx` — progressive hint reveal, one level at a time (§15).
- `components/ActivityView.tsx` — one generic renderer for every question type
  (§7): info, predict/mcq, ordering (accessible ↑/↓ reorder), fill-code
  (inline blank, normalized local check). Reports graded attempts upward.
- `components/LessonPlayer.tsx` — walks a lesson's activities, records mastery,
  marks completion; concept-agnostic.

**Pages**
- `app/globals.css` — dark theme; `prefers-reduced-motion` override (§35).
- `app/layout.tsx` — shell/header.
- `app/page.tsx` + `components/Dashboard.tsx` — home dashboard: recommendation
  banner, the §29 metrics, per-chunk mastery bars (§13), lesson journey list
  with completion state, reset button.
- `app/lesson/[id]/page.tsx` — lesson route; `generateStaticParams` pre-renders
  every lesson from content (static, no DB).

### Deliberately NOT built (per §44 "what not to build initially")
- Custom IDE / Monaco, real code execution sandbox, database, auth, multiple
  languages, AI tutor, BFS slice, microservices, leaderboards, native mobile.
  Rationale: prove the learning-loop hypothesis first (§44), add infra later.

### Install + verification
- **What:** Ran `npm install` — added 108 packages (Next 15.5.23 resolved).
- **Note:** `npm audit` reports 3 high-severity advisories in the transitive
  dep tree. Left unpatched for now — `npm audit fix --force` would force a
  breaking Next major bump. Revisit before any real deployment.
- **What:** `npm run build` — compiled successfully, type-checked clean, all 12
  routes generated (home, not-found, 8 static lesson pages via
  `generateStaticParams`, + shared chunks). First-load JS ~109 kB home /
  145 kB lesson (Framer Motion).
- **What:** `npm run dev` smoke test — `/` and `/lesson/tp-2-predict` both 200;
  confirmed rendered HTML contains the dashboard (recommendation, chunk mastery,
  metrics, journey) and the predict activity. Server stopped after.

### How to run
```
npm install
npm run dev      # http://localhost:3000
# or: npm run build && npm run start
```

---

## Session 2 — 2026-08-16 — Curriculum graph (NeetCode roadmap)

### Decision: make the roadmap the backbone
- **What:** User supplied the NeetCode-style topic tree (Arrays & Hashing →
  Two Pointers → … → Math & Geometry) and asked to follow it. Encoded it as the
  platform's **curriculum graph** and made it the home screen.
- **Why:** This is exactly blueprint §6 (Learning Graph) and §41 (the curriculum
  graph is a core product moat). Organizing around a prerequisite DAG — not a
  flat topic list — is a central blueprint principle. Building the graph now
  (even mostly as placeholders) sets the structure everything else grows into.
- **Refs:** §6, §41.

### Files
- `lib/curriculum.ts` — 18 topic nodes with hand-laid x/y layout matching the
  roadmap image, 21 directed prerequisite edges, and helpers
  (`prerequisitesOf`, `getNode`). Only `two-pointers` has a `conceptId` (it's
  the one BUILT/playable node); the rest are placeholders. Adding a topic later
  = author content + set its `conceptId`.
- `components/CurriculumMap.tsx` — client map: SVG bezier edges + absolutely-
  positioned node cards with live progress bars. Gating rule: a topic unlocks
  when every prerequisite concept is ≥80% mastered; unbuilt prereqs never count
  as mastered, so downstream stays locked until shipped (self-gating graph, §6).
  Live nodes link to their concept; others show "Soon"/"Start".

### Routing restructure
- **What:** `/` is now the roadmap map (was the Two Pointers dashboard). Concept
  dashboards moved to `/concept/[id]`. Lesson back-links and the completion CTA
  now return to `/concept/{id}` instead of `/`.
- **Why:** With multiple topics the home must be the map; each concept needs its
  own stable URL. `app/concept/[id]/page.tsx` added with `generateStaticParams`.

### Gotcha logged
- **What:** `next start` threw `Cannot find module './833.js'` (500s on some
  routes) after overlapping dev/start servers left a **corrupted `.next`
  cache**. Fix: `rm -rf .next && npm run build`. Also hit `EADDRINUSE` on 3000
  from a lingering server — kill with `lsof -ti:3000 | xargs kill -9`.
- **Why noted:** Likely to recur during iteration; clean-rebuild is the remedy.

### Verified
- Clean `npm run build` → 13 routes. `npm run start`: `/`, `/concept/two-pointers`,
  `/lesson/tp-2-predict` all 200; roadmap renders with all topic nodes.

---

## Session 3 — 2026-08-16 — Learning-design standard (research)

### Decision: one research-backed pedagogical template for every topic
- **What:** User asked for a single consistent "coding style" = every pattern
  must (a) drill reusable chunks first, and (b) deliberately train *forward
  intuition* (anticipate which pattern/subgoals a future problem needs).
  Researched the learning science, then wrote `LEARNING_DESIGN.md` — the
  canonical 12-step topic template every concept follows.
- **Why:** Consistency across dozens of future topics needs a documented,
  evidence-based standard, not per-topic improvisation. Directly serves
  blueprint §3 (chunk-first), §5 (stage sequence), §41 (learning sequences as
  moat), §47 (independent problem solving).
- **Research pulled (via WebSearch):** Cognitive Load Theory / chunking
  (Sweller), worked-example & guidance-fading effect, **subgoal labeling**
  (Margulieux & Guzdial — highest-leverage new idea; improves transfer + cuts
  failure), forward reasoning (Newell & Simon), interleaving/discrimination &
  desirable difficulties (Bjork; block-then-interleave), retrieval + spacing,
  near/far transfer. Sources cited in `LEARNING_DESIGN.md`.

### The template (fixed spine per topic)
HOOK → PREDICT → CHUNK DRILLS (blocked, + subgoal labels + "reused in") →
SIGNALS → FORWARD PLAN → COMPOSE → PSEUDOCODE → GUIDED → INDEPENDENT →
TRANSFER → INTERLEAVE (cross-topic discrimination) → SPACED REVISIT.
The forward-intuition engine = SIGNALS + FORWARD PLAN + INTERLEAVE.

### Planned code changes (not yet implemented — plan only)
- `lib/types.ts`: `Chunk.subgoalLabel`, `Chunk.reusedIn[]`, `Concept.signals[]`,
  new activity kinds `forward-plan` and `discriminate`, a shared review pool.
- Components: `SignalsPanel`, `ForwardPlanActivity`, `DiscriminateActivity`
  (+ a `/review` route for interleaved drills); chunk cards show subgoal labels.
- `lib/mastery.ts`: formal `recognition` + forward-planning dimensions;
  interleaved-drill accuracy = real Transfer Rate metric.

### Status
- Deliverable was the PLAN (per user's ask). No app code changed this session;
  build still green from Session 2. Implementation of the schema/components is
  the proposed next step, pending user go-ahead.

---

## Session 4 — 2026-08-16 — Docs reorganized into `docs/`

### Decision: one docs folder, segregated by usage
- **What:** Moved all Markdown documentation into a single `docs/` folder,
  split by usage. Mapping:
  - `coding_education_startup_blueprint.md` → `docs/product/blueprint.md`
  - `LEARNING_DESIGN.md` → `docs/product/learning-design.md`
  - `BUILD_LOG.md` → `docs/build-log.md`
  - **new** `docs/frontend/architecture.md` — FE stack, structure, conventions.
  - **new** `docs/backend/architecture.md` — BE plan / data model / execution
    (MVP has no backend; localStorage stands in).
  - **new** `docs/README.md` — index of all docs.
  - root `README.md` rewritten as a slim signpost → `docs/` (root README kept
    by convention; all substantive docs now live under `docs/`).
- **Why:** User asked to keep all md files in one folder and segregate them by
  usage (frontend vs backend, etc.). Improves navigability as docs grow.
- **Note:** No code imports these files, so moving them is safe; build unaffected.
  Earlier log entries still name the old root paths — see header note + this
  mapping.

---

## Session 5 — 2026-08-16 — Implemented the learning-design template

Implemented the plan from `docs/product/learning-design.md`, with Two Pointers
as the reference topic. User approved: "if the plan is solid go ahead."

### Schema (`lib/types.ts`)
- `Chunk.subgoalLabel` + `Chunk.reusedIn[]` (subgoal labeling + forward-links).
- `Signal { trigger, pattern }` type; `Concept.signals[]`.
- New activity kinds: `signals` (ungraded recognition cues), `discriminate`
  (folded into `ChoiceActivity`), `forward-plan` (folded into `OrderingActivity`).

### Content (`content/two-pointers.ts`)
- Every chunk got a `subgoalLabel` + `reusedIn`. Added a `forward-planning`
  chunk. Added concept-level `signals`.
- New lessons inserted + renumbered to the full spine: **SIGNALS** (tp-4-signals:
  cue panel + a discriminate check) and **FORWARD PLAN** (tp-5-forward: arrange
  the subgoal plan before coding). Journey is now 10 lessons in template order.

### Interleaving (`content/review.ts`, `/review`)
- `reviewPool` — 4 cross-technique `discriminate` items (two-pointer vs. hash
  map vs. sliding window), including same-surface/different-structure traps.
- `components/ReviewPlayer.tsx` shuffles the pool; `/review` route runs it and
  feeds the `pattern-recognition` mastery dimension.

### Components
- `SignalsPanel.tsx` — renders trigger→pattern cues (reused on dashboard + in
  the SIGNALS lesson).
- `ActivityView.tsx` — handles the 3 new kinds (signals ungraded like info;
  discriminate like choice; forward-plan like ordering, button reads "Check plan").
- `Dashboard.tsx` — chunk cards now show subgoal label (italic) + "reused in"
  chips; added a Signals section, a "Pattern recognition" metric, and a Mixed
  Review CTA to `/review`.

### Verified
- Clean `npm run build` → 16 routes (10 lessons + `/review` + concept), types
  clean. `npm run start`: tp-4-signals, tp-5-forward, /review, concept page all
  200 with the expected new content.

### Notes / small calls
- Signals + info activities are **ungraded** on purpose (they teach; the paired
  discriminate item does the grading). Forward-intuition mastery flows through
  the `pattern-recognition` + `forward-planning` chunks.
- Lesson **ids** renumbered to match new order (tp-7-combine … tp-10-transfer);
  inner activity ids left as-is (unique within each lesson — cosmetic only).

---

## Session 6 — 2026-08-16 — UI/UX research + full design-system revamp

### Decision: token-based design system, research-driven
- **What:** Researched UI/UX for visual learning platforms, then rebuilt the
  entire UI on a semantic design-token system with reusable primitives, plus
  light/dark/system theming. Documented in `docs/frontend/design-system.md`.
- **Why:** User asked to research how such a site should look and revamp the UI.
  Ad-hoc `slate-*` classes don't scale to a consistent product; the research
  (Mayer's coherence 0.86 effect size + signaling; WCAG AA; token systems)
  points to a focused, consistent, accessible interface.
- **Research (WebSearch):** Mayer's multimedia principles (coherence, signaling,
  spatial contiguity), WCAG AA typography/contrast, design-system accessibility
  & tokens, 2025 edtech UX trends. Sources cited in design-system.md.

### Tokens & theming
- `app/globals.css`: semantic CSS-variable tokens (bg, surface, surface-2, line,
  fg, muted, faint, brand, brand-fg, success, warn, danger, accent, info) as
  `R G B` triples; light default + dark via `prefers-color-scheme` and
  `[data-theme]`; global focus ring, reduced-motion, quiet scrollbars.
- `tailwind.config.ts`: maps tokens to utilities (`bg-surface`, `text-fg`,
  `bg-brand`…), adds radius/shadow/font/max-w-content.
- `components/ui/ThemeToggle.tsx` (+ inline `themeInitScript` in layout head to
  prevent FOUC).

### Primitives (`components/ui/`)
- `Button`/`ButtonLink`, `Card`+`SectionHeading`, `Badge`, `ProgressBar`
  (role=meter, proficiency-band color), `StatTile`.

### Screens refactored onto the system
- `app/layout.tsx` — sticky translucent header, nav (Roadmap/Review), theme
  toggle, footer.
- `LessonPlayer` + `ReviewPlayer` — distraction-free **focus card** (coherence).
- `ActivityView` — token colors, lettered option chips, clearer feedback.
- `Dashboard` — StatTiles, Cards, SectionHeadings, progress meters.
- `CurriculumMap` — token colors + a legend.
- `ArrayViz` — theme-aware cell fills via token utilities (framer-motion still
  drives pointer movement).
- `HintPanel`, `SignalsPanel`, and the three route pages — token colors.

### Verified
- Clean `npm run build` → 16 routes, types clean. `npm run start`: `/`,
  `/concept/two-pointers`, `/lesson/tp-1-see`, `/review` all 200; theme init
  script + `text-fg` utilities present in output.

### Docs
- New `docs/frontend/design-system.md`; index + `architecture.md` updated to
  point at it and forbid raw hex/`slate-*` in components.

---

## Session 7 — 2026-08-16 — Arrays & Hashing topic + unlock all patterns

### Built the roadmap root as a real concept
- **What:** Authored `content/arrays-hashing.ts` — the Arrays & Hashing topic on
  the full 12-step template (7 chunks incl. subgoal labels + reuse links, 4
  signals, 10 lessons SEE→TRANSFER). Big idea: hash map/set = O(1) lookups turn
  an O(n²) scan into one pass, trading O(n) memory. Examples: Contains-Duplicate
  (set) and Two-Sum on unsorted input (value→index map).
- **Wiring:** registered in `lib/content.ts`; set `conceptId` on the
  `arrays-hashing` node in `lib/curriculum.ts`; added its chunks to the map's
  `BUILT_CHUNKS` so its node shows live progress.
- **Why:** User asked to build Arrays & Hashing first — it's the root of the
  roadmap and every branch descends from it (blueprint §6). Proves a second
  topic needs **zero new components** (validates §9/§23 content-as-data).

### Unlocked all patterns (per request)
- **What:** Disabled prerequisite gating in `CurriculumMap` — `isUnlocked()`
  now always returns `true` (the mastery-based gate is preserved commented-out
  to re-enable later). Updated legend + intro copy; live topics (Arrays &
  Hashing, Two Pointers) are clickable, unbuilt ones show "coming soon" but are
  no longer dimmed/locked.
- **Note:** Unbuilt nodes remain non-clickable (no content yet); "unlocked"
  here means the graph no longer blocks exploration.

### Verified
- Clean `npm run build` → 24 routes (20 lessons: 10 AH + 10 TP, 2 concept pages,
  home, review, not-found), types clean. `npm run start`: arrays-hashing concept
  + ah-1/ah-5/ah-10 lessons + roadmap all 200 with expected content.

---

## Session 8 — 2026-08-16 — Sequential lesson 1→n progression

### Problem found
- On finishing a lesson, the player only offered "Back to dashboard" — no direct
  hand-off to the next lesson. The step-by-step "lesson 1..n" flow was broken:
  you had to return to the dashboard and re-pick each lesson.

### Fix
- `app/lesson/[id]/page.tsx`: computes the lesson's position in the ordered
  journey and its prev/next neighbours; shows **"Lesson X of N"** + a stage
  badge in the header; passes `prev`/`next` to the player.
- `components/LessonPlayer.tsx`: completion card now hands **straight to the next
  lesson** ("Next: <title> →"); on the final lesson it shows "Topic complete!"
  and routes to mixed review. Added quiet prev / "Skip to next" links under the
  focus card (non-distracting).
- `components/Dashboard.tsx`: the journey list highlights the **next incomplete
  lesson** (brand border + "Start"/"Continue" badge), so the sequential entry
  point is obvious.

### Verified
- Clean build. `npm run start`: ah-1 shows "Lesson 1 of 10" + next→"Predict the
  hit" (no prev); ah-5 shows "Lesson 5 of 10" + prev→"Read the signals" +
  next→"The trade-off"; ah-10 "Lesson 10 of 10" (no next); dashboard shows the
  Start/Continue highlight. (SSR injects HTML comment markers between dynamic
  values — strip them when grep-verifying rendered numbers.)

---

## Session 9 — 2026-08-16 — Test suite (Vitest)

### Policy (user instruction)
- Tests are **update-on-request only** — never rewritten automatically on code
  changes. Documented in `docs/frontend/testing.md` and saved as a memory.

### Setup
- Added dev deps: `vitest`, `@vitejs/plugin-react`, `jsdom`,
  `@testing-library/react` + `user-event` + `jest-dom`.
- `vitest.config.ts` (jsdom env, `@`→root alias), `tests/setup.ts` (jest-dom
  matchers; clears DOM + localStorage after each test). Scripts: `npm test`,
  `npm run test:watch`.

### Tests written (41 tests, 6 files — all passing)
- `tests/lib/mastery.test.ts` (13) — EWMA scoring, conceptScore, independent-
  solve/hint-dependency metrics, lesson completion, reset.
- `tests/lib/recommend.test.ts` (4) — the four deterministic recommend branches.
- `tests/lib/curriculum.test.ts` (7) — graph integrity incl. acyclicity (Kahn).
- `tests/content/content.test.ts` (11) — content-as-data contract across the
  WHOLE registry via `describe.each` (chunks resolve, option/index bounds,
  fill-code blank present, unique ids/orders, live nodes resolve) + review pool.
- `tests/components/ActivityView.test.tsx` (5) — MCQ correct/wrong, fill-code
  accept/reject, info ungraded.
- `tests/components/SignalsPanel.test.tsx` (1) — renders cues.

### Note
- npm audit now reports more advisories (jsdom/vite dev-only tree). Dev-only;
  address the app-facing ones before deploy. Content-integrity suite means new
  topics are validated automatically without new test code.

---

## Session 10 — 2026-08-16 — UI declutter (visual review in browser)

### What
- Drove Chrome to actually look at the lesson screen. Found redundant stacked
  metadata: a **"STEP 1 / 1"** progress rail (with a full progress bar) rendered
  right under the lesson title on single-activity lessons — pure noise, since
  most lessons have one activity.
- Fix: `LessonPlayer` now renders the step rail **only when `total > 1`**.
  Confirmed visually — gone on tp-1-see (1 step), still present + meaningful on
  tp-3-chunks ("STEP 1 / 3").

### Why
- Coherence principle (design-system.md): remove anything that doesn't help the
  learner with the current step. A 1/1 progress bar is decoration.

### Verified
- Browser screenshots before/after; `npm test` still 41/41 green (tests
  untouched, per the update-on-request policy).

### Follow-up declutter (same session)
- Removed the repeated **footer tagline** ("Chunk — built around the core
  loop…") from `app/layout.tsx` — decorative, on every screen.
- Removed the decorative **lesson subtitle** line from the lesson header
  (`app/lesson/[id]/page.tsx`); header is now just badge + title + "Lesson X of
  N". (Subtitles still shown on the dashboard journey list where they add
  context.) Verified in browser — lesson screen goes straight from a two-line
  header into content.

---

## Session 11 — 2026-08-20 — 3 topics, 2 visualizers, real code execution

Big near-term push (user: "need all this implemented"). Tracked as 3 tasks.

### 1. New visualizers (HashViz + StackViz)
- `lib/types.ts`: added `HashVizState` (map/set) and `StackVizState`; `VizState`
  is now a union; new `code` activity kind (Monaco + sandbox).
- `components/viz/HashViz.tsx` (key→value / set chips, animated) and
  `StackViz.tsx` (LIFO, top marked), wired into `VizRenderer`.
- Retrofit Arrays & Hashing intro + duplicate-hit reveal to use HashViz set.

### 2. Three new topics (data only — no new player/engine code)
- `content/sliding-window.ts` (reuses ArrayViz: window = highlighted range + L/R),
  `content/binary-search.ts` (lo/mid/hi pointers), `content/stack.ts` (StackViz).
  Each on the full 12-step template with a real `code` challenge at IMPLEMENT.
- Registered in `content.ts`; set `conceptId` on their curriculum nodes; added to
  `CurriculumMap` BUILT_CHUNKS. **5 topics now live** on the roadmap.
- Proves the content-as-data thesis: a topic = a data file + 3 one-line wirings.

### 3. Real code execution (Monaco + sandbox)
- `app/api/execute/route.ts`: wraps submission + tests in a harness, runs it in
  an isolated sandbox, parses PASS/FAIL + SUMMARY into JSON.
- `components/CodeRunner.tsx`: Monaco (dynamic import, ssr:false) + Run-tests +
  per-case results; each run is a graded mastery attempt. Wired into ActivityView.
- **Sandbox gotcha:** targeted Piston first, but its public API went
  **whitelist-only 2026-02-15 → 401**. Switched to **Wandbox** (keyless).
  Verified end-to-end in the browser: `pass` starter → "0/5 tests passed" with
  per-case detail; correct solution → all pass (via curl). Wandbox occasionally
  returns a transient container error; client can re-run. NOT production infra —
  self-host + auth + rate limits before prod (see backend/architecture.md).

### Deps + verification
- Added `@monaco-editor/react`. Also (earlier) the vitest toolchain.
- `npx tsc` clean; `npm run build` green (64 routes incl. 40 lesson pages +
  `/api/execute`); **`npm test` 50/50** (content suite auto-validated the 3 new
  topics, +9 tests). Visuals confirmed in Chrome (StackViz, HashViz, code run).

---

## Session 12 — 2026-08-20 — Pattern entry page: lean, not an archive

### Problem (user)
- Clicking into a pattern showed a wall of analytics first — recommendation box,
  5 metric tiles, signals, chunk-mastery bars, review CTA — before the lessons.
  It read like an archive/stats dashboard, not "here's the pattern, start."

### Fix (`components/Dashboard.tsx`, full rewrite)
- Lean-by-default entry (coherence): **title + tagline → one Start/Continue card
  (the next lesson, "Lesson X of N") → the lesson path**. That's the whole
  above-the-fold.
- Everything else — the 5 StatTiles, Signals, chunk-mastery bars, mixed-review
  link, reset — moved into a single collapsed native `<details>` ("Progress &
  pattern details · N% mastery · x/y done"), one click away, closed by default.
- Dropped the always-on `recommend()` banner from the entry; the primary action
  is now simple sequential Continue (the "lesson 1..n" model the user liked).
  (recommend() is still used elsewhere; can resurface inside details later.)

### Verified
- Browser: entry page is now hero + Continue card + lesson list, ending in the
  collapsed details row; expanding it reveals all metrics/signals/mastery.
- `npx tsc` clean; `npm test` 50/50 (Dashboard has no unit test; untouched).

---

## Session 13 — 2026-08-21 — Graphify (codebase knowledge graph) set up

### Context
- User asked about "graphiphy" for knowledge graphs + lower AI token usage.
  Identified it as **Graphify** (`Graphify-Labs/graphify`, pip pkg `graphifyy`,
  double-y — verified legit on PyPI, v0.9.48, points to official repo). It's a
  CLI/skill that turns the CODEBASE into a queryable graph so AI assistants
  navigate by structure instead of reading whole files (~70× fewer tokens/query
  at scale). NOT an npm pkg; NOT related to the in-product curriculum graph.
- Advised it's overkill for a 4k-line repo, but user's goal is a millions-of-LOC
  startup → set it up now as a forward investment.

### What was done
- `brew install uv`; `uv tool install graphifyy` (installs `graphify` +
  `graphify-mcp`).
- Built the graph: `graphify update .` → 537 nodes, 728 edges, 46 communities
  (local AST only, no API key). Verified with `graphify explain "ActivityView"`
  — returns imports/calls/contains with EXTRACTED tags + line numbers.
- `graphify install --platform claude` → skill at ~/.claude/skills/graphify/;
  it also **created a global `~/.claude/CLAUDE.md`** (loads in ALL projects) that
  just maps `/graphify` to the skill — reviewed, benign.
- gitignored `/graphify-out` (860KB, regenerable, churns every commit; rebuild
  with `graphify update .` on clone).
- Documented in `docs/frontend/architecture.md` (Graphify section).

### Notes / caveats
- Value is marginal at current size; pays off as the codebase grows.
- Keep the graph fresh (`graphify update .` / `graphify watch .`) or answers go
  stale. INFERRED edges can be wrong (EXTRACTED are exact).
- Only code (AST) extraction enabled; doc/PDF semantic passes need an LLM key.

---

## Session 13b — 2026-08-21 — Graphify set to instinctive use

- User chose "instinctive" use of the graph. Created project **`CLAUDE.md`** with
  a standing rule: prefer the graphify graph for codebase navigation / impact
  analysis (no need to type `/graphify`), rebuild with `graphify update .` if
  stale, verify against source before editing, trust EXTRACTED over INFERRED.
- Also folded existing standing rules into CLAUDE.md (docs entry point, keep
  build-log updated, tests are update-on-request only) so they load every session.

### Pending / next ideas
- Self-host the execution sandbox (Piston/Judge0) + auth + rate limits (§20,§36).
- Persistence + auth → Postgres/Prisma (§25); analytics events (§28).
- Linked List topic; Graphs → add a `graph` VizRenderer case (React Flow, §8).
- Spaced-repetition scheduling (§16); failure classification (§14).
- Consider a dedicated hash-map/set visualizer (AH currently reuses ArrayViz +
  captions for map state).
- Re-enable prerequisite gating once more topics ship (gate code is preserved).
- Real code execution (Judge0/Piston) + Monaco to replace fill-in checks (§20).
- Move mastery from localStorage to Postgres/Prisma (§25) once auth exists.
- Address the 3 npm audit advisories before deploying.
