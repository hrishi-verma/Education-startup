# Learning Design — The One Style Every Topic Follows

This is the canonical pedagogical template for **every** coding pattern on the
platform. The goal is two-fold and non-negotiable:

1. **Chunk-first mastery** — before a big problem, the learner has already made
   the reusable implementation/reasoning chunks *automatic*, so working memory
   is free for the genuinely new reasoning.
2. **Forward intuition** — the learner is deliberately trained to look at an
   unfamiliar problem and *anticipate* which pattern, subgoals, and chunks it
   will need — the skill an expert calls "seeing it."

Everything below is grounded in learning-science research (sources at the end).
When authoring a new topic, follow this template exactly. That consistency *is*
the "one coding style."

> **Implementation status (Session 5):** the full template is built and live on
> **Two Pointers** as the reference topic — subgoal labels, `reusedIn`
> forward-links, SIGNALS, FORWARD PLAN, COMPOSE, the scaffolding ladder,
> TRANSFER, and the interleaved discrimination pool at `/review`. New topics
> just author the same data shapes. See build-log.md Session 5.

---

## 1. The research this is built on

| Principle | What it says | How we use it |
|---|---|---|
| **Cognitive Load Theory / chunking** (Sweller) | Working memory holds only ~4 chunks; schema construction + automation is the point of learning. Don't spend WM on syntax recall. | Drill each chunk to fluency *before* composition. Keep text minimal, one idea per screen. |
| **Worked-example & guidance-fading effect** | Start from fully worked examples, then *fade* steps as skill grows (completion / Parsons problems). Fading beats jumping straight to open problems. | Our scaffolding ladder A→G. Each topic fades support step by step. |
| **Subgoal labeling** (Margulieux & Guzdial) | Labeling the *structural subgoal* of each group of steps improves learning, retention, **and transfer**, and cuts failure rates. Experts can't usually articulate these — so we must author them explicitly. | **NEW:** every chunk and every worked solution carries an explicit **subgoal label**. This is the single highest-leverage addition. |
| **Forward reasoning** (Newell & Simon) | Experts reason *forward* from givens, forming subgoals, because they have schemas. Novices flail with means-ends analysis. | **NEW:** a "forward-planning" step — predict the subgoal plan *before* implementing — trains the expert habit directly. |
| **Interleaving / discrimination** (Bjork, desirable difficulties) | Mixing problem *types* forces learners to notice the features that discriminate one pattern from another → pattern recognition. But **block first, then interleave** (blocked practice for initial acquisition). | **NEW:** a cross-topic "Which pattern?" discrimination drill, unlocked after a topic is learned in isolation. |
| **Retrieval practice + spacing** (testing effect) | Recalling beats reviewing; benefits grow when spaced with feedback. | Predict-before-reveal everywhere; chunks resurface on Day 1/3/7/14 (§16). |
| **Transfer (near → far)** | Far transfer is *rare* and must be engineered: same deep structure, varied surface. Teach the schema explicitly. | Transfer problems disguise the surface; the subgoal schema is what carries over. |

---

## 2. The canonical topic template (fixed sequence)

Every pattern is authored as this exact spine. Stages map to our existing
`stage` field; **★ = new mechanic this design adds.**

```
0. HOOK            One visual situation, minimal text. No explanation yet.
1. PREDICT         Commit to a guess before any reveal. (retrieval + generation)
2. CHUNK DRILLS    Each reusable chunk, drilled to fluency — BLOCKED practice.
                   ★ Each chunk shows its SUBGOAL LABEL + "you'll reuse this in ___".
3. SIGNALS         ★ The trigger features: "when you see X, think this pattern."
4. FORWARD PLAN    ★ Given a fresh problem, predict the SUBGOAL PLAN before coding.
                   (forward reasoning, not means-ends flailing)
5. COMPOSE         Arrange labeled chunks/subgoals into the structure. (Parsons)
6. PSEUDOCODE      Express structurally; scaffolding fades across attempts.
7. GUIDED IMPL     Faded worked example — fill the gaps.
8. INDEPENDENT     Minimal scaffolding; learner drives.
9. TRANSFER        Same deep structure, different surface. Unlabeled.
10. INTERLEAVE     ★ Mixed "which pattern / which chunk?" drill vs. prior topics.
                   (discrimination → pattern recognition) — unlocks after step 9.
11. SPACED REVISIT Chunks + signals resurface days later inside new contexts.
```

Steps 3, 4, and 10 are the **forward-intuition engine** — they are what makes a
learner able to face a *future* unseen problem and know where to start. Steps 0,
1, 5–9 are already largely in the Two Pointers slice; 2 gains subgoal labels.

---

## 3. What this changes in the codebase

### 3.1 Content schema additions (`lib/types.ts`)
- `Chunk.subgoalLabel: string` — the structural subgoal it accomplishes.
- `Chunk.reusedIn: string[]` — future topic ids that reuse this chunk (drives
  the "you'll need this later" forward-link and the roadmap payoff view).
- `Concept.signals: { trigger: string; pattern: string }[]` — the recognition
  cues for step 3.
- New activity kinds:
  - `forward-plan` — student orders/selects the subgoal plan for a *new* problem
    before implementing (step 4). Reuses the ordering UI over **subgoal labels**.
  - `discriminate` — an interleaved "which pattern fits?" item drawing from a
    shared pool across topics (step 10).
- A **review pool**: activities tagged for interleaving so the spaced/mixed
  drills can pull from every learned topic.

### 3.2 New/changed components
- `SignalsPanel` — renders the trigger→pattern cues.
- `ForwardPlanActivity` — thin variant of `ActivityView` ordering mode, graded
  on the subgoal plan.
- `DiscriminateActivity` — cross-topic MCQ; lives at a new `/review` route.
- Chunk cards on the concept dashboard show the subgoal label + `reusedIn` chips.

### 3.3 Mastery additions (`lib/mastery.ts`)
- Track **pattern-recognition** and **forward-planning** as first-class mastery
  dimensions (they already exist as chunks like `pattern-recognition`; formalize
  a `recognition` score fed by `discriminate` + `signals` items).
- Interleaved-drill accuracy becomes the real **Transfer Rate** metric (§29).

---

## 4. Authoring checklist (per new topic)

Before a topic goes live it must have:
- [ ] 5–8 chunks, each with a **subgoal label** and `reusedIn` links.
- [ ] A HOOK visual + at least one PREDICT.
- [ ] Blocked chunk drills (fluency) for every chunk.
- [ ] 3–5 **signals** (trigger → pattern).
- [ ] One **forward-plan** activity on a fresh problem.
- [ ] A COMPOSE (Parsons) over subgoal labels.
- [ ] Faded pseudocode → guided → independent ladder.
- [ ] One **transfer** problem (disguised surface, same schema).
- [ ] ≥2 items contributed to the shared **interleaving/discrimination pool**.
- [ ] Spaced-revisit tags so chunks resurface later.

---

## 5. Why this produces "forward thinking"

A novice asks *"what do I do?"* and gropes backward from the answer. We flip it:
by drilling chunks to automaticity (free WM), attaching **subgoal labels**
(schema), teaching **signals** (recognition cues), and forcing a **forward plan
before code** — then **interleaving** so the learner must *discriminate* which
pattern applies — the learner rehearses exactly the expert move: look at a new
problem, recognize its shape, and reason forward from the givens. That is the
intuition, and it is trainable — not innate.

---

## Sources

- Cognitive load / worked examples / fading — [Renkl & Atkinson, fading worked steps](https://link.springer.com/article/10.1023/B:TRUC.0000021815.74806.f6); [Faded worked examples (ERIC)](https://files.eric.ed.gov/fulltext/EJ1086007.pdf); [CLT teacher guide](https://www.structural-learning.com/post/cognitive-load-theory-a-teachers-guide)
- Scaffolding & Parsons problems in programming — [Scaffolding CT & cognitive load](https://link.springer.com/article/10.1007/s10639-024-13104-0); [Parsons problems to scaffold code writing](https://arxiv.org/pdf/2311.18115)
- Subgoal labeling — [Margulieux & Guzdial, subgoal-labeled materials improve transfer](https://www.semanticscholar.org/paper/Subgoal-labeled-instructional-material-improves-and-Margulieux-Guzdial/a32496bc36a7a8673b0e04721ac0debd1caa04c1); [Reducing failure rates with subgoal-labeled worked examples (STEM Ed J)](https://stemeducationjournal.springeropen.com/articles/10.1186/s40594-020-00222-7); [Guzdial's overview](https://computinged.wordpress.com/tag/subgoal-labeling/)
- Forward reasoning / subgoals — [Backward strategy & subgoal learning in a logic tutor](https://link.springer.com/article/10.1007/s40593-023-00338-1); [Intuition vs. analysis by experience level](https://link.springer.com/article/10.3758/MC.36.3.554)
- Transfer — [Near & far transfer meta-analysis](https://online.ucpress.edu/collabra/article/5/1/18/113004/Near-and-Far-Transfer-in-Cognitive-Training-A); [Transfer of learning guide](https://www.structural-learning.com/post/transfer-learning-complete-guide-teachers)
- Interleaving / spacing / desirable difficulties — [Bjork's desirable difficulties](https://www.structural-learning.com/post/desirable-difficulties); [Bjork & Bjork, introducing desirable difficulties (PDF)](https://www.unh.edu/teaching-learning-resource-hub/sites/default/files/media/2023-06/itow-introducing-desirable-difficulties-into-practice-and-instruction-bjork-and-bjork.pdf); [Spaced learning/interleaving/retrieval systematic review](https://www.sciencedirect.com/science/article/pii/S1546144023006464); [Blocked-before-interleaved caveat](https://onlinelibrary.wiley.com/doi/10.1111/lang.12659)
