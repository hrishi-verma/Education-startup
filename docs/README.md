# Documentation

All project documentation lives here, segregated by usage. (The repo root keeps
only a slim `README.md` pointing here — everything substantive is in `docs/`.)

```
docs/
├── product/                Product & pedagogy (the "what" and "why")
│   ├── blueprint.md         The full product blueprint / spec
│   └── learning-design.md   The research-backed template EVERY topic follows
├── frontend/               The browser app (the "how", client side)
│   ├── architecture.md
│   ├── design-system.md     Tokens, primitives, theming, UI research
│   └── testing.md           Vitest suite + the update-on-request policy
├── backend/                Server/data/execution (mostly plan — MVP has none)
│   └── architecture.md
└── build-log.md            Sequential log of every change, install & decision
```

## Where to look
- **Understand the product / vision** → [product/blueprint.md](product/blueprint.md)
- **How lessons are designed (chunking + forward intuition)** → [product/learning-design.md](product/learning-design.md)
- **Working on the UI / adding a topic** → [frontend/architecture.md](frontend/architecture.md)
- **Styling / colors / components / theming** → [frontend/design-system.md](frontend/design-system.md)
- **Tests (and the update-on-request policy)** → [frontend/testing.md](frontend/testing.md)
- **Data model, persistence, code execution, scaling** → [backend/architecture.md](backend/architecture.md)
- **What changed and why, in order** → [build-log.md](build-log.md)

## Conventions
- `product/` = pedagogy and product decisions.
- `frontend/` = anything the browser runs.
- `backend/` = anything server/data/execution (planned until infra lands).
- `build-log.md` is project-wide (not FE/BE specific); append newest at the
  bottom, recording what changed, why, and the blueprint section it serves.
