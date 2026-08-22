# Project instructions

## Docs
Start from `docs/README.md`. Key files: `docs/product/blueprint.md` (vision),
`docs/product/learning-design.md` (the 12-step template every topic follows),
`docs/frontend/design-system.md` (tokens/primitives — never hard-code colors),
`docs/frontend/testing.md`, `docs/backend/architecture.md`.
Keep `docs/build-log.md` updated with every change/install/decision + why.

## Tests
Update test files ONLY when the user explicitly asks — never automatically as a
side effect of code changes. Running them (`npm test`) anytime is fine.

## Graphify — use the codebase knowledge graph instinctively
This repo has a Graphify graph (`graphify-out/`, gitignored). Prefer it for
codebase navigation and impact analysis instead of reading whole files — it
saves tokens and scales as the codebase grows. The user should NOT need to type
`/graphify`; reach for it on your own when it helps.

When to use it:
- "What calls / imports / depends on X?", "what breaks if I change X?",
  tracing a flow across files, or locating where something lives.
- Commands: `graphify explain "Name"`, `graphify path "A" "B"`, or read
  `graphify-out/graph.json` / `GRAPH_REPORT.md`.

Rules (the graph is a snapshot — treat it as such):
1. **Rebuild after changes.** After completing code changes in a task (adding/
   removing/renaming files, functions, imports), run `graphify update .` (local
   AST, no API key) so the graph reflects the new state. Do this as the standard
   final step of a change, before reporting done — not lazily on next read.
2. **Verify before editing.** Always read the actual file before modifying it —
   use the graph to find and reason, the source to act.
3. **EXTRACTED edges are exact; INFERRED edges may be wrong** — confirm inferred
   relationships against source.
4. `graphify` lives on PATH via `~/.local/bin` (uv tool). If not found, prefix
   with `export PATH="/opt/homebrew/bin:$HOME/.local/bin:$PATH"`.
