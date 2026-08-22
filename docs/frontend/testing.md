# Testing

## Policy — IMPORTANT
Tests are **updated on request only**. They are NOT rewritten automatically when
app code changes. If a change breaks a test, that's a signal to review — decide
deliberately whether the code or the test is wrong, and change the test only when
you actually intend to.

## Stack
- **Vitest** (`vitest.config.ts`) with the **jsdom** environment (gives
  `localStorage` + DOM for the client modules).
- **React Testing Library** + **user-event** for component tests.
- `tests/setup.ts` loads jest-dom matchers and clears the DOM + `localStorage`
  after every test so mastery state never leaks between cases.
- `@` path alias resolves to the repo root (matches `tsconfig.json`).

## Run
```bash
npm test         # one-off run
npm run test:watch
```

## Layout (mirrors the source tree)
```
tests/
├── setup.ts
├── lib/
│   ├── mastery.test.ts       EWMA scoring, conceptScore, §29 metrics, reset
│   ├── recommend.test.ts     the 4 deterministic recommendation branches (§26)
│   └── curriculum.test.ts    graph integrity: valid edges, no self-loops, DAG
├── content/
│   └── content.test.ts       content-as-data contract for EVERY concept +
│                             review pool (chunks resolve, options/indices valid,
│                             fill-code has a blank, unique ids/orders, live
│                             roadmap nodes resolve to concepts)
└── components/
    ├── ActivityView.test.tsx MCQ correct/wrong, fill-code accept/reject, info
    │                         is ungraded
    └── SignalsPanel.test.tsx renders trigger → pattern cues
```

## What's covered
- **Logic:** mastery math + aggregate metrics, recommendation rules, curriculum
  graph invariants (including an acyclicity check via Kahn's algorithm).
- **Content integrity:** the `content.test.ts` suite runs `describe.each` over
  the whole registry, so a malformed lesson in any topic (bad chunk id, out-of-
  range `correctIndex`, missing fill-code blank, duplicate order…) fails here
  rather than at runtime. New topics are validated automatically.
- **Components:** a representative interaction test for the generic
  `ActivityView` (the one renderer behind every question type) and a render
  test for `SignalsPanel`.

## Adding tests (when asked)
- Put a file under `tests/**` named `*.test.ts(x)`; it's picked up automatically.
- Prefer testing **pure logic and the content contract** — highest value, least
  brittle. Keep component tests to real user interactions.
- For component tests, avoid activities carrying a `viz` unless necessary (keeps
  framer-motion out of the render and tests stable).
