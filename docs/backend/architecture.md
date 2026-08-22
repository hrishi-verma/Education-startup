# Backend Architecture

## Current state (MVP): one server route, no database

By design (blueprint §20, §21, §43) the MVP keeps infra minimal:

- **Persistence** — mastery/progress lives in the browser via `localStorage`
  (`lib/mastery.ts`). This is a deliberate stand-in for the future
  `StudentChunkMastery` / `StudentConceptMastery` tables (§25). No DB yet.
- **Code execution (LIVE)** — `code` activities run **real Python** in an
  isolated sandbox. `app/api/execute/route.ts` builds a test harness around the
  student's submission and forwards it to the sandbox; the client
  (`components/CodeRunner.tsx`, Monaco editor) shows per-test PASS/FAIL. Simpler
  `fill-code` activities are still checked locally by string match.
- **Content** — authored as typed data in `content/` and served statically;
  lesson routes are pre-rendered (`generateStaticParams`).

### Code-execution sandbox — current choice & caveats
- **Provider:** **Wandbox** (`https://wandbox.org/api/compile.json`, keyless).
  We originally targeted **Piston**, but its public instance became
  **whitelist-only on 2026-02-15** (returns 401). Wandbox is a keyless drop-in
  for the MVP.
- **How it works:** the route wraps the submission + test cases in a harness
  that `eval`s each `call`, compares `repr(result)` to the `expected` string,
  and prints `PASS/FAIL` + a `SUMMARY` line the route parses into JSON.
- **NOT production-ready:** no auth, no rate limiting, depends on a free public
  sandbox (occasional transient `crun: Resource temporarily unavailable` — the
  client can just re-run). **Before production:** self-host Piston or Judge0,
  add auth + rate limits + request quotas, and treat all submissions as
  malicious (§36). This route is the seam where that swap happens — only the
  provider URL + request/response shape change.

## Target stack when backend is needed (blueprint §21, §45)
- **API layer:** Next.js route handlers first; graduate to **FastAPI** only when
  complexity demands (§21).
- **Database:** **PostgreSQL** via **Prisma** ORM.
- **Cache/queue:** **Redis** when needed.
- **Auth:** managed provider (Clerk / Auth.js).
- **Object storage:** S3-compatible.
- **Analytics:** PostHog or equivalent (educational events, §28).

## Modular monolith first (blueprint §22)
Start as one deployable with clear internal modules; split to services only when
scale/security/isolation forces it. Suggested modules:
```
Auth · Users · Curriculum · Concepts · Chunks · Lessons · Questions ·
Visualization · Submissions · CodeExecution · Mastery · Recommendations ·
Analytics · ContentAuthoring
```
**Code Execution is the first thing to isolate** — student code is untrusted.

## Data model (blueprint §25) — migration target for localStorage
Core entities to model in Prisma when we add Postgres: `User`,
`StudentProfile`, `Concept`, `ConceptPrerequisite`, `Chunk`, `ConceptChunk`,
`LearningPath`, `Lesson`, `Activity`, `VisualizationState`, `Question`, `Hint`,
`CodeChallenge`, `TestCase`, `Submission`, `Execution`, `Misconception`,
`StudentChunkMastery`, `StudentConceptMastery`, `LearningEvent`,
`Recommendation`.

The current `lib/curriculum.ts` graph → `Concept` + `ConceptPrerequisite`;
`lib/mastery.ts` store → `StudentChunkMastery` + aggregate views.

## Code execution (blueprint §20, §36) — when we add real execution
Never run student code on the app server. Use an isolated provider
(**Judge0 / Piston / managed sandbox**) enforcing: CPU + memory limits,
timeouts, no network, no filesystem, process isolation, rate limits, cleanup.
Start with **Python only**. Treat all submitted code as malicious.

## Recommendation engine (blueprint §26)
Already implemented client-side as deterministic rules (`lib/recommend.ts`).
When it moves server-side, keep it **rule-based first** (no ML) — surface the
weakest chunk / push to transfer. This is the product differentiation (§40).

## Migration checklist (localStorage → real backend)
- [ ] Add auth; create `User` / `StudentProfile`.
- [ ] Prisma schema for the §25 entities; seed `Concept`/`Chunk` from
      `lib/curriculum.ts` + `content/`.
- [ ] Move mastery writes behind an API; mirror `lib/mastery.ts` math server-side.
- [ ] Emit `LearningEvent`s (§28) for the metrics that matter (§29).
- [ ] Add sandboxed execution + `TestCase`/`Submission`/`Execution` for real
      coding problems (replaces fill-in checks).
- [ ] Address the 3 npm audit advisories before any deploy.
