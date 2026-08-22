# Frontend Architecture

Everything the browser runs. The frontend is the whole product surface today —
the app is a Next.js modular monolith (blueprint §22) and there is no separate
backend service yet (see [../backend/architecture.md](../backend/architecture.md)).

> **Styling:** all visual language (tokens, primitives, theming, the UI
> research) lives in [design-system.md](design-system.md). Use semantic color
> utilities (`bg-surface`, `text-fg`, `bg-brand`…) — never raw hex or `slate-*`.

## Stack (blueprint §21, §45)
- **Next.js (App Router)** + **React 19** + **TypeScript**
- **Tailwind CSS v3** for styling (dark theme)
- **Framer Motion** — the blueprint's "Motion for React" (§8), used for pointer
  animation and state transitions

## Directory map
```
app/                       # routes (App Router)
  page.tsx                 # "/"  → the curriculum roadmap (map)
  concept/[id]/page.tsx    # "/concept/:id" → a topic dashboard
  lesson/[id]/page.tsx     # "/lesson/:id"  → the lesson player
  layout.tsx, globals.css  # shell + dark theme + reduced-motion (§35)
components/
  ui/                      # design-system primitives (Button, Card, Badge,
                           #   ProgressBar, StatTile, ThemeToggle) — see
                           #   design-system.md
  CurriculumMap.tsx        # the roadmap graph (SVG edges + node cards)
  Dashboard.tsx            # per-concept mastery + recommendation + journey
  LessonPlayer.tsx         # walks a lesson's activities (focus card)
  ReviewPlayer.tsx         # interleaved discrimination drills (/review)
  ActivityView.tsx         # ONE renderer for every question type (§7)
  HintPanel.tsx            # progressive hints (§15)
  SignalsPanel.tsx         # recognition cues (SIGNALS step)
  CodeRunner.tsx           # Monaco editor + Run-tests against the sandbox
  viz/
    VizRenderer.tsx        # dispatches a VizState by type
    ArrayViz.tsx           # SVG array + animated pointers
    HashViz.tsx            # hash map / set chips (Arrays & Hashing)
    StackViz.tsx           # LIFO stack (Stack topic)
lib/
  types.ts                 # content schema (the data lessons are authored in)
  content.ts               # content registry + lookups
  curriculum.ts            # the prerequisite graph (nodes + edges)
  mastery.ts               # localStorage mastery model (client)
  useMastery.ts            # React hook subscribing to the store
  recommend.ts             # deterministic "what to do next" (§26)
content/
  two-pointers.ts          # a topic authored as DATA, not components
```

## Core principles (do not break these)
1. **Content is data, not components (blueprint §9, §23).** A lesson is a plain
   `Concept`/`Lesson`/`Activity` object in `content/`. Components *interpret*
   it. Never create `TwoPointerQuestion1.tsx`-style per-question components.
2. **One generic visualization engine (§9).** New visuals = a new `VizState`
   variant + a case in `VizRenderer`, never a bespoke widget per lesson.
3. **The player is concept-agnostic.** `LessonPlayer` / `ActivityView` know
   nothing about Two Pointers. Adding a topic must require zero player changes.
4. **Client/server boundary.** Anything touching `localStorage` or React state
   is a Client Component (`"use client"`): the whole `lib/mastery` +
   `useMastery` path, `Dashboard`, `CurriculumMap`, `LessonPlayer`,
   `ActivityView`. Route files (`app/**/page.tsx`) stay Server Components and
   pass serializable content data down.

## Conventions
- **Path alias** `@/*` → repo root (see `tsconfig.json`).
- **Blueprint-referenced comments.** Non-obvious design choices cite the
  blueprint section they implement (e.g. `// (§15)`), so intent is traceable.
- **Accessibility (§35).** Viz has ARIA labels; `prefers-reduced-motion` is
  honored in `globals.css`; interactions are keyboard-operable.
- **Tailwind only** for styling — no CSS modules or inline style objects except
  for computed geometry (node positions, progress widths).

## How to add a new topic (frontend side)
1. Author `content/<topic>.ts` as a `Concept` (follow
   [../product/learning-design.md](../product/learning-design.md)).
2. Register it in `lib/content.ts`.
3. Set its `conceptId` on the matching node in `lib/curriculum.ts` to make it
   live on the roadmap.
No new components should be needed unless the topic introduces a genuinely new
visualization (then extend `VizRenderer`).

## Graphify — codebase knowledge graph (dev tooling)
The repo uses **Graphify** so AI coding assistants navigate by structure instead
of reading whole files (big token savings at scale — the project targets a very
large codebase). It is **dev tooling, not part of the product**; it does not
ship to users and is unrelated to the in-product curriculum graph
(`lib/curriculum.ts`).

- Install (one-time, per machine): `uv tool install graphifyy` then
  `graphify install --platform claude`.
- Build / refresh the graph (local AST, no API key): `graphify update .`
  — run after significant code changes; `graphify watch .` auto-rebuilds.
- Query: `graphify explain "ActivityView"`, `graphify path "A" "B"`, or `/graphify`
  in the assistant. Output lives in `graphify-out/` (**gitignored** — regenerate
  on clone; avoids per-commit churn).
- Only local AST parsing is used (code). Doc/PDF/image semantic passes would need
  an LLM API key and are not enabled.

## Deliberately not here yet (blueprint §44)
Monaco editor, real code execution UI, auth screens, native mobile. See the
backend doc for the server-side counterparts.
