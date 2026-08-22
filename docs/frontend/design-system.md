# Design System

The one visual language for the whole platform. Every screen is built from the
same tokens and primitives so the product reads as a single system — the
consistency the research calls for. Read this before touching any UI.

## 1. Research the UI is built on

A learning interface has a job ordinary product UI doesn't: protect the
learner's limited working memory for the *material*, not the chrome. The revamp
follows the evidence.

| Principle | Source finding | How the UI applies it |
|---|---|---|
| **Coherence** (Mayer) | People learn better when extraneous material is removed — supported in **23/23** experiments, median effect size **0.86**. | Lessons run in a single **focus card**: one activity on screen, no sidebars, no decorative art, minimal text. Sticky header is quiet and translucent. |
| **Signaling** (Mayer) | Cues that highlight the *organization* of essential information reduce extraneous load. | Consistent **stage badges** (SEE, PREDICT…), one **progress rail** per player, a single **focus-ring** style, mastery-band colors on every progress bar. |
| **Spatial contiguity** (Mayer) | Words learn better *next to* their graphics, not separated. | Viz **captions** sit under the array; feedback and explanations render **inside** the activity card; stat hints sit on their tile. |
| **Accessibility / WCAG AA** | Body ≥15–16px; text contrast ≥4.5:1 (AA); visible focus; adjustable presentation. | Tokens are AA-contrast in **both** themes; base text is 16px+; every interactive element has a focus ring; light/dark/system toggle; `prefers-reduced-motion` honored. |
| **Gamification restraint** (blueprint §34) | Mastery should mean genuine ability, not streak-clicking. | Progress/mastery are shown as **competence** (chunk %, recognition), not points or streaks. |

Sources: Mayer, *Principles for Reducing Extraneous Processing in Multimedia
Learning* (coherence, signaling, spatial contiguity) —
[Cambridge Handbook ch.14](https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-reducing-extraneous-processing-in-multimedia-learning/F29A19FCD34C542806F736E0661C05F5),
[open PDF](https://edtechuvic.ca/wp-content/uploads/sites/11/2022/09/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles.pdf);
accessible typography & contrast —
[Accessibility.build WCAG typography](https://www.accessibility.build/guides/accessible-typography-wcag),
[WCAG color & contrast 2.2/APCA](https://humbldesign.io/blog-posts/color-accessibility-guide-wcag);
design-system accessibility & tokens —
[UXPin](https://www.uxpin.com/studio/blog/design-system-accessibility/);
edtech UX trends 2025 (clean layouts, gamified but focused) —
[Lollypop](https://lollypop.design/blog/2025/august/top-education-app-design-trends-2025/),
[Merge: best-designed edtech](https://merge.rocks/blog/7-best-designed-edtech-platforms-weve-seen-so-far).

## 2. Tokens

Defined as CSS custom properties in `app/globals.css` and exposed to Tailwind as
semantic color utilities in `tailwind.config.ts`. **Never hard-code hex or
`slate-*` in components** — use the semantic utility so it themes automatically.

### Color roles (utility → meaning)
| Utility | Role |
|---|---|
| `bg-bg` | page background |
| `bg-surface` | cards, raised elements |
| `bg-surface-2` | insets, code blocks, tracks |
| `border-line` | all borders / dividers |
| `text-fg` | primary text |
| `text-muted` | secondary text (AA) |
| `text-faint` | tertiary / captions |
| `bg-brand` / `text-brand` | primary accent (indigo) — actions, "live" |
| `text-brand-fg` | text on a brand fill |
| `success / warn / danger` | mastered / developing+hints / wrong |
| `accent` | violet — interleaved **review** surface |
| `info` | informational blue |

Alpha works on every token (`bg-brand/10`, `border-success/40`) because tokens
are stored as `R G B` triples.

### Other tokens
- **Radius:** `rounded-xl` = `--radius` (0.875rem); `rounded-2xl` a touch larger.
- **Shadow:** `shadow-card` (theme-aware soft elevation).
- **Type:** `font-sans` (system UI stack), `font-mono` (code). Base 16px.
  A branded webfont can later be added via `next/font` without other changes.
- **Width:** `max-w-content` (56rem) is the app's reading column.

## 3. Theming

- Light is the `:root` default. Dark applies via `@media (prefers-color-scheme:
  dark)` **and** an explicit `:root[data-theme="dark"]` set by the toggle.
- `components/ui/ThemeToggle.tsx` cycles system → light → dark, persists to
  `localStorage`, and stamps `data-theme` on `<html>`.
- `themeInitScript` (inlined in `app/layout.tsx` `<head>`) applies the saved
  theme **before first paint** — no flash of the wrong theme.

## 4. Primitives (`components/ui/`)

Compose screens from these, not ad-hoc markup:

| Component | Use |
|---|---|
| `Button` / `ButtonLink` | actions. Variants: `primary`, `accent`, `secondary`, `ghost`; sizes `sm`/`md`. |
| `Card` | surfaces. Tones: `default`, `brand`, `accent`, `success`. |
| `SectionHeading` | titled section with optional hint (signaling). |
| `Badge` | stage/tag/status pills. Tones + `mono` for stage codes. |
| `ProgressBar` | mastery bar; color **bands** proficiency (amber→brand→success); has `role="meter"`. |
| `StatTile` | KPI tile for the §29 metrics. |
| `ThemeToggle` | light/dark/system control. |

Domain UI also reuses `SignalsPanel` and `HintPanel`.

## 5. Layout patterns

- **Lesson / review player** = progress rail + a single **focus `Card`**
  (coherence). Everything for the current step lives inside that card.
- **Concept dashboard** = hero → recommendation `Card` → 5 `StatTile`s →
  Signals → chunk bars (with subgoal + reuse chips) → review CTA → journey list.
- **Roadmap** = dotted canvas, curved token-colored edges, node cards colored
  by state (live / start / soon) with a legend.

## 6. Accessibility checklist (do this for every new screen)
- [ ] Use semantic color tokens (AA in both themes) — no raw hex/`slate-*`.
- [ ] Body text ≥16px; never faint gray for essential copy.
- [ ] Interactive elements are real `<button>`/`<a>` and reach the focus ring.
- [ ] Meaningful `aria-label`s on icon-only controls and on the viz SVG.
- [ ] Animations degrade under `prefers-reduced-motion` (handled globally).
- [ ] Tap targets comfortable (≈36–44px min).

## 7. Extending it
- New color role → add a `--token` (light + both dark blocks) in `globals.css`,
  map it in `tailwind.config.ts`, use the utility.
- New reusable widget → add to `components/ui/` and document it in §4.
- Keep the **coherence** rule sacred: if an element doesn't help the learner do
  the current step, it doesn't belong on the screen.
