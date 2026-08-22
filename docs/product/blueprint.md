# Visual, Chunk-Based Coding Education Platform

## Product Vision, Learning System, Architecture, and MVP Blueprint

## 1. Product Vision

The platform should teach students **how to think, decompose, recognize
patterns, and implement solutions**, rather than simply giving them a
large collection of coding problems.

The core learning journey is:

**Chunks → Pattern → Guided Composition → Main Problem → Independent
Problem → Transfer Problem → Spaced Revision**

A student should encounter a main algorithmic problem only after
practicing the reusable implementation and reasoning chunks needed to
approach it confidently.

The platform should be:

-   Visual-first
-   Low-text
-   Interactive
-   Structured
-   Progressive
-   Focused on critical thinking
-   Focused on reusable mental models
-   Adaptive to student weaknesses
-   Designed around mastery rather than problem count

------------------------------------------------------------------------

## 2. The Core Problem

Traditional coding-practice platforms often follow this model:

**Learn topic → See explanation → Solve many problems**

This creates several issues:

-   Students randomly jump between problems.
-   They may understand an algorithm conceptually but cannot implement
    it.
-   Small implementation difficulties consume their working memory.
-   Students memorize solutions rather than recognize patterns.
-   Problem statements can be unnecessarily long.
-   Students often do not know *why* they failed.
-   Solving more questions does not necessarily produce transferable
    skill.

This platform should instead build the student's abilities
progressively.

------------------------------------------------------------------------

## 3. Core Learning Philosophy

### 3.1 Practice chunks before the main problem

Suppose the eventual problem requires BFS.

Before the student encounters the main BFS problem, they should already
have practiced:

-   Creating an adjacency list
-   Adding an edge
-   Iterating through neighbors
-   Creating a queue
-   Queue push/pop operations
-   Creating a visited structure
-   Marking nodes visited
-   Basic traversal logic

The main problem can then focus on the genuinely new reasoning
challenge.

### Important constraint

Do **not** pre-teach every detail of the final solution.

If every exact step is practiced beforehand, the student is merely
assembling memorized pieces.

A good main problem should contain:

-   Mostly familiar implementation chunks
-   A familiar or partially familiar pattern
-   At least one meaningful new reasoning challenge

The goal is to reduce irrelevant implementation difficulty while
preserving actual problem solving.

------------------------------------------------------------------------

## 4. Three Levels of Learning

### Level 1: Chunks

Small reusable units of reasoning or implementation.

Examples:

#### Arrays

-   Iterate through an array
-   Maintain a running maximum
-   Swap two values
-   Use an index
-   Build a frequency map

#### Two Pointers

-   Initialize left/right pointers
-   Compare values
-   Move the left pointer
-   Move the right pointer
-   Maintain a pointer invariant

#### Graphs

-   Create adjacency list
-   Add edge
-   Get neighbors
-   Mark visited
-   Queue operations
-   Stack operations
-   Boundary checking

#### Dynamic Programming

-   Identify state
-   Define base case
-   Write recurrence
-   Memoize state
-   Build DP table
-   Perform state transition

Chunks should become sufficiently fluent that students do not spend most
of their mental capacity recalling syntax.

------------------------------------------------------------------------

### Level 2: Patterns

Chunks combine into recognizable algorithmic structures.

Examples:

-   Two Pointers
-   Sliding Window
-   Binary Search
-   BFS
-   DFS
-   Backtracking
-   Prefix Sum
-   Greedy
-   Dynamic Programming
-   Union Find

Students should learn:

1.  What the pattern does
2.  Why it works
3.  When it applies
4.  What signals suggest it
5.  Which chunks compose it

------------------------------------------------------------------------

### Level 3: Problems

Students combine known chunks and patterns to solve new situations.

Problems should progress through:

1.  Guided problem
2.  Semi-guided problem
3.  Independent problem
4.  Transfer problem

A transfer problem should look different on the surface while requiring
the same underlying reasoning.

------------------------------------------------------------------------

## 5. Recommended Learning Sequence

For each concept:

### Stage 1: Visual intuition

Introduce the idea visually with minimal text.

Example for Two Pointers:

``` text
[2] [4] [7] [9] [12]
 ^                ^
 L                R
```

Ask:

> The sum is too large. Which pointer should move?

Do not immediately explain.

------------------------------------------------------------------------

### Stage 2: Prediction

Before showing an animation, require the student to predict what
happens.

Examples:

-   Which pointer moves next?
-   Which node is visited next?
-   What enters the queue?
-   Which DP cell changes?
-   What value does this variable contain?

This prevents visualization from becoming passive entertainment.

------------------------------------------------------------------------

### Stage 3: Chunk practice

Practice individual components.

Example:

``` python
def add_edge(graph, u, v):
    # Student completes this
```

Later:

``` python
def get_neighbors(graph, node):
    # Student completes this
```

Then:

``` python
def bfs(graph, start):
    # Student combines known chunks
```

------------------------------------------------------------------------

### Stage 4: Chunk combination

Give students several known chunks and ask them to determine their
order.

Example:

``` text
[Mark visited]
[Create queue]
[Process node]
[Add neighbors]
[Remove from queue]
```

The student arranges them into a valid BFS structure.

------------------------------------------------------------------------

### Stage 5: Pseudocode

Before full implementation, require the student to express the solution
structurally.

Example:

``` text
build graph
create queue
mark starting node visited

while queue is not empty:
    remove node
    process node

    for each neighbor:
        if neighbor not visited:
            mark visited
            add neighbor to queue
```

The platform should gradually reduce pseudocode scaffolding.

------------------------------------------------------------------------

### Stage 6: Guided main problem

The student encounters a real problem.

Some structure may still be provided.

------------------------------------------------------------------------

### Stage 7: Independent problem

No chunk labels and minimal hints.

The student must:

-   Recognize the pattern
-   Decompose the problem
-   Choose chunks
-   Construct pseudocode
-   Implement
-   Debug

------------------------------------------------------------------------

### Stage 8: Transfer problem

Give a problem that appears different but requires the same underlying
idea.

This tests actual understanding.

------------------------------------------------------------------------

### Stage 9: Spaced revision

Weak chunks and patterns should return later.

If a student repeatedly struggles with graph construction,
graph-building exercises can appear days later inside different graph
contexts.

------------------------------------------------------------------------

## 6. Learning Graph

Do not organize the platform as simply:

``` text
Topic
  └── Problems
```

Use a prerequisite graph.

Example:

``` text
Arrays
  ↓
Traversal
  ↓
Two Pointers
  ↓
Sliding Window
```

Another branch:

``` text
Recursion
  ↓
Repeated Subproblems
  ↓
Memoization
  ↓
Dynamic Programming
  ├── 1D DP
  ├── 2D DP
  └── Knapsack Patterns
```

Graph branch:

``` text
Arrays / Lists
  ↓
Graph Representation
  ↓
Neighbor Traversal
  ↓
Visited Tracking
  ↓
BFS / DFS
  ↓
Connected Components
  ↓
Cycle Detection
  ↓
Shortest Paths
```

Each concept should define:

-   Prerequisites
-   Required chunks
-   Learning objectives
-   Visual demonstrations
-   Common misconceptions
-   Guided exercises
-   Independent exercises
-   Transfer exercises
-   Mastery criteria

------------------------------------------------------------------------

## 7. Question Types

Do not make every exercise a full coding problem.

Support micro-interactions such as:

-   Predict next step
-   Select correct pointer
-   Select next node
-   Drag steps into order
-   Fill one line of code
-   Complete one function
-   Trace code
-   Identify a bug
-   Choose an invariant
-   Select a data structure
-   Modify pseudocode
-   Build a chunk
-   Combine chunks
-   Identify the algorithmic pattern
-   Optimize an existing approach
-   Full coding problem

This creates variety while keeping cognitive load controlled.

------------------------------------------------------------------------

## 8. Visualization System

Visualization should be a first-class platform feature.

### Recommended stack

#### React + SVG

Use for:

-   Arrays
-   Strings
-   Pointers
-   Stacks
-   Queues
-   DP tables
-   Variables
-   Comparisons
-   Simple recursion/state diagrams

#### Motion for React

Use for:

-   Pointer movement
-   Swaps
-   Highlight transitions
-   Queue insertion/removal
-   Node state changes
-   DP state transitions
-   Smooth educational animations

#### React Flow

Use primarily for:

-   Graphs
-   Trees
-   Traversal visualization
-   Node-edge structures
-   Interactive graph construction

#### Konva

Use only when advanced Canvas rendering becomes necessary.

Do not add it to the MVP unless SVG/React becomes insufficient.

#### Monaco Editor

Use for the embedded coding editor.

------------------------------------------------------------------------

## 9. Build a Generic Visualization Engine

Do not create a custom visualization component for every individual
question.

Avoid:

``` text
TwoPointerQuestion1.tsx
TwoPointerQuestion2.tsx
BFSQuestion1.tsx
BFSQuestion2.tsx
...
```

Instead, lessons should describe visualization state.

Example:

``` json
{
  "type": "array",
  "values": [2, 4, 7, 9, 12],
  "pointers": [
    {"name": "left", "index": 0},
    {"name": "right", "index": 4}
  ],
  "highlighted": [0, 4]
}
```

The visualization engine renders this state.

A later state might be:

``` json
{
  "type": "array",
  "values": [2, 4, 7, 9, 12],
  "pointers": [
    {"name": "left", "index": 1},
    {"name": "right", "index": 4}
  ],
  "highlighted": [1, 4]
}
```

Motion animates the transition.

This creates a reusable educational visualization language.

------------------------------------------------------------------------

## 10. Code-to-Visualization Synchronization

A powerful long-term feature is synchronizing code execution with visual
state.

For example:

``` python
visited[node] = True
```

should visually mark the corresponding node.

When:

``` python
queue.append(neighbor)
```

executes, the visualization can show the node entering the queue.

For Two Pointers:

``` python
left += 1
```

should move the visual left pointer.

For DP:

``` python
dp[i] = dp[i - 1] + dp[i - 2]
```

should highlight the source cells and destination cell.

This connects:

**Code → State Change → Visual Meaning**

Do not make this mandatory for the first MVP if it significantly slows
development.

------------------------------------------------------------------------

## 11. Visualization Must Be Interactive

Avoid simply playing algorithm animations.

Bad:

``` text
Student clicks Play
→ watches BFS
→ clicks Next
```

Better:

``` text
Show state
→ ask student what happens next
→ student predicts
→ reveal animation
→ explain briefly
→ continue
```

Visualization should create thinking, not replace thinking.

------------------------------------------------------------------------

## 12. Progressive Scaffolding

Support should disappear gradually.

### Stage A

Student fills one missing line.

### Stage B

Student implements one known function.

### Stage C

Student arranges chunks.

### Stage D

Student completes pseudocode.

### Stage E

Student receives function signatures.

### Stage F

Student writes implementation independently.

### Stage G

Student receives only the problem.

This prevents dependence on hints and templates.

------------------------------------------------------------------------

## 13. Mastery Model

Do not define mastery as:

> Solved 10 graph questions.

Track mastery at multiple levels.

Example:

``` text
BFS Concept Understanding       91%
BFS Implementation              72%
Graph Construction              54%
Visited Tracking                94%
Queue Operations                98%
Neighbor Traversal              76%
Pattern Recognition             68%
Independent Transfer            61%
```

The platform can then determine what the student actually needs.

------------------------------------------------------------------------

## 14. Failure Classification

When a student fails, try to classify the reason.

Possible categories:

### Concept failure

Student does not understand the algorithm.

### Chunk failure

Student understands BFS but cannot construct the graph.

### Pattern-recognition failure

Student knows Two Pointers but does not recognize when to use it.

### Composition failure

Student knows individual chunks but cannot combine them.

### Syntax failure

Student knows the reasoning but makes language-specific mistakes.

### Debugging failure

Student cannot locate an implementation error.

### Edge-case failure

Student understands the primary solution but misses boundaries or
unusual inputs.

### Transfer failure

Student can solve familiar forms but not unfamiliar versions.

This classification should eventually drive recommendations.

------------------------------------------------------------------------

## 15. Hint System

Hints should be progressive.

### Hint 1: Nudge

> Look at what changes when the left pointer moves.

### Hint 2: Direction

> If the current sum is smaller than the target, which movement could
> increase it?

### Hint 3: Concept

Explain the relevant invariant.

### Hint 4: Structure

Provide pseudocode or a partial solution.

### Final help

Show a detailed explanation only when necessary.

Track hint dependency as part of mastery.

------------------------------------------------------------------------

## 16. Spaced Repetition

Chunks should reappear over time.

Example:

Day 1: Practice `buildGraph()`.

Day 3: Use graph construction inside BFS.

Day 7: Construct a graph inside a connected-components problem.

Day 14: Graph construction appears inside an unfamiliar problem.

The student should eventually perform common chunks almost
automatically.

------------------------------------------------------------------------

## 17. Student Experience

A typical lesson should feel like:

``` text
Visual situation
      ↓
Prediction
      ↓
Tiny interaction
      ↓
Chunk practice
      ↓
Combine chunks
      ↓
Pseudocode
      ↓
Guided implementation
      ↓
Main problem
      ↓
Independent problem
      ↓
Transfer problem
      ↓
Mastery update
```

Keep text minimal.

At almost every point the student should know:

> What am I supposed to do right now?

------------------------------------------------------------------------

## 18. Story-Based Learning

Story can create continuity, but should not become unnecessary
decoration.

Use lightweight scenarios that make state changes intuitive.

For example, instead of immediately saying:

> Given a sorted integer array...

you might visually present two ends of a sequence and ask the student to
reach a target.

Story should help explain the reasoning.

If removing the story makes the lesson clearer, remove it.

------------------------------------------------------------------------

## 19. IDE / Coding Environment

Do **not** build an IDE from scratch.

Use:

### Monaco Editor

Provides:

-   Syntax highlighting
-   Line numbers
-   Editing
-   Autocomplete
-   Language support
-   VS Code-like experience

Keep the interface simpler than a professional IDE.

Students should focus on the learning task rather than tooling.

------------------------------------------------------------------------

## 20. Code Execution

The editor does not execute code.

Use an isolated execution system.

Possible MVP options:

-   Judge0
-   Piston
-   Managed sandbox/code-execution provider

Later, if required, build custom isolated execution infrastructure.

Never execute arbitrary student code directly on the primary application
server.

The execution system should enforce:

-   CPU limits
-   Memory limits
-   Timeouts
-   Network restrictions
-   File-system restrictions
-   Process isolation
-   Rate limits
-   Cleanup after execution

Start with one programming language, preferably Python, unless user
research strongly indicates otherwise.

------------------------------------------------------------------------

## 21. Technical Stack

### Frontend

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Component library
-   React + SVG
-   Motion for React
-   React Flow
-   Monaco Editor

### Backend

For MVP:

-   Next.js server/API layer

Alternative when backend complexity grows:

-   FastAPI or a dedicated backend service

### Database

-   PostgreSQL

### ORM

-   Prisma

### Cache / Queue

-   Redis when needed

### Authentication

Examples:

-   Clerk
-   Auth.js
-   Similar managed authentication system

### Analytics

-   PostHog or equivalent product analytics

### Storage

-   S3-compatible object storage

### Code Execution

-   Judge0 / Piston / managed sandbox initially

### Deployment

Possible simple setup:

-   Vercel for Next.js
-   Managed PostgreSQL
-   Managed Redis if needed
-   Separate sandbox/code execution infrastructure

------------------------------------------------------------------------

## 22. Architecture Principle: Modular Monolith First

Do not begin with many microservices.

Start with a modular monolith.

Suggested modules:

``` text
Authentication
Users
Curriculum
Concepts
Chunks
Lessons
Questions
Visualization
Submissions
Code Execution
Mastery
Recommendations
Analytics
Content Authoring
```

Separate services later only when scaling, security, or operational
isolation requires it.

Code execution is a natural candidate for early isolation because
student code is untrusted.

------------------------------------------------------------------------

## 23. Content Must Be Separate From Application Code

This is critical.

Do not hardcode every lesson into React components.

Content should be represented as structured data.

Example:

``` json
{
  "concept": "two-pointers",
  "lesson": "pointer-movement",
  "requiredChunks": [
    "initialize-left-right",
    "compare-sum",
    "move-pointer"
  ],
  "activities": [],
  "masteryCriteria": {}
}
```

This allows instructors to create and modify lessons without deploying
new frontend code.

------------------------------------------------------------------------

## 24. Content Authoring System

Eventually build an internal instructor interface.

Instructor workflow:

``` text
Create concept
→ define prerequisites
→ define chunks
→ create visual states
→ create micro-exercises
→ create hints
→ create guided problem
→ create independent problem
→ create transfer problem
→ preview
→ publish
```

Support:

-   Drafts
-   Versioning
-   Preview
-   Publishing
-   Reordering
-   Validation

Content creation will likely become one of the company's largest
operational challenges, so authoring tools matter.

------------------------------------------------------------------------

## 25. Suggested Data Model

Core entities could include:

### User

Student account.

### StudentProfile

Learning preferences and state.

### Concept

Examples: BFS, Two Pointers, Sliding Window.

### ConceptPrerequisite

Relationships between concepts.

### Chunk

Reusable implementation/reasoning unit.

### ConceptChunk

Relationship between concepts and required chunks.

### LearningPath

Ordered/graph-based curriculum.

### Lesson

A structured learning experience.

### Activity

Individual interaction inside a lesson.

### VisualizationState

Structured visual representation.

### Question

Prompt and expected interaction.

### Hint

Progressive help.

### CodeChallenge

Coding task.

### TestCase

Visible/hidden test.

### Submission

Student answer/code.

### Execution

Code execution result.

### Misconception

Known reasoning error.

### StudentChunkMastery

Mastery for individual chunks.

### StudentConceptMastery

Mastery for concepts.

### LearningEvent

Analytics event.

### Recommendation

Next recommended activity.

------------------------------------------------------------------------

## 26. Recommendation Engine

Do not start with machine learning.

Begin with deterministic rules.

Example:

``` text
IF graph_construction_mastery < 60%
AND student is starting BFS
THEN recommend graph-construction chunk practice
```

Another:

``` text
IF BFS mastery > 80%
AND transfer mastery < 60%
THEN recommend unfamiliar BFS transfer problem
```

Later, more sophisticated adaptive models can be introduced.

------------------------------------------------------------------------

## 27. AI Usage

AI can help, but should not become the curriculum.

Useful AI applications:

-   Draft question generation
-   Alternative examples
-   Hint generation
-   Misconception classification
-   Student error analysis
-   Instructor assistance
-   Content-quality checks
-   Personalized explanation wording

Avoid allowing AI to automatically publish educational content without
validation.

The curriculum graph, chunk structure, mastery rules, and learning
progression should remain controlled.

------------------------------------------------------------------------

## 28. Analytics

Track educational events, not only business metrics.

Examples:

-   Lesson started
-   Lesson completed
-   Activity attempted
-   Prediction submitted
-   Incorrect prediction
-   Hint opened
-   Hint level used
-   Chunk attempted
-   Chunk passed
-   Code run
-   Code failed
-   Code submitted
-   Test case failed
-   Main problem completed
-   Transfer problem completed
-   Lesson abandoned

Important questions:

-   Where do students get stuck?
-   Which chunks cause the most difficulty?
-   Which lesson creates the largest dropout?
-   Are students dependent on hints?
-   Can students transfer knowledge?
-   How long does mastery persist?
-   Does visualization improve understanding?
-   Does chunk practice improve independent problem solving?

------------------------------------------------------------------------

## 29. Metrics That Actually Matter

Avoid optimizing primarily for:

-   Problems solved
-   Time spent
-   Number of clicks
-   Daily streak length

More meaningful metrics:

### Independent Solve Rate

Can students solve without assistance?

### Transfer Rate

Can students use the idea in a different-looking problem?

### Hint Dependency

How much help is required?

### Retention

Can students still perform the skill days/weeks later?

### Chunk Fluency

Can common implementation chunks be performed efficiently?

### Pattern Recognition

Can students identify the relevant technique without being told the
topic?

### Time to Independence

How long does it take before scaffolding can be removed?

------------------------------------------------------------------------

## 30. Avoid Over-Scaffolding

This is a major product risk.

If students always see:

``` text
This is a BFS problem.
Step 1: Build graph.
Step 2: Create queue.
Step 3: Mark visited.
...
```

they may become good at following instructions but poor at solving
problems.

Scaffolding should progressively disappear.

Eventually the platform should present only:

> Here is the problem.

The student must decide:

-   What information matters?
-   What pattern applies?
-   Which chunks are needed?
-   In what order?
-   What invariant should hold?
-   What edge cases exist?

------------------------------------------------------------------------

## 31. Avoid Passive Visualization

Another risk is making beautiful animations that students watch without
reasoning.

Use:

**Predict → Commit → Visualize → Explain**

instead of:

**Play animation → Next**

Students should frequently make a decision before seeing the next state.

------------------------------------------------------------------------

## 32. Avoid Excessive Text

Prefer:

``` text
[visual]

Which pointer moves?

○ Left
○ Right
○ Both
○ Neither
```

over several paragraphs explaining pointer movement.

When explanation is required:

-   Keep it short
-   Reveal progressively
-   Pair it with the relevant visual
-   Avoid showing unrelated information

------------------------------------------------------------------------

## 33. Mobile Strategy

Mobile is useful for:

-   Chunk drills
-   Predictions
-   Visual lessons
-   Pattern recognition
-   Review
-   Spaced repetition
-   Short quizzes

Desktop is better for:

-   Full implementation
-   Code + visualization side by side
-   Debugging
-   Longer independent problems

Do not force the exact same interaction model onto both.

------------------------------------------------------------------------

## 34. Gamification

Gamification can support consistency, but should not become the product.

Possible:

-   Progress paths
-   Mastery levels
-   Streaks
-   Badges
-   Topic completion

But mastery should represent genuine ability.

Avoid rewarding students primarily for:

-   Clicking through content
-   Repeating trivial exercises
-   Spending time without learning

------------------------------------------------------------------------

## 35. Accessibility

Visual-first does not mean visual-only.

Support:

-   Keyboard navigation
-   Screen readers
-   High contrast
-   Adjustable font sizes
-   Reduced motion
-   Text alternatives
-   Accessible code editor interactions
-   Clear focus states

Animations should have reduced-motion alternatives.

------------------------------------------------------------------------

## 36. Security

Treat all submitted code as malicious/untrusted.

Important protections:

-   Isolated execution
-   Time limits
-   Memory limits
-   Network restrictions
-   Rate limiting
-   Input validation
-   Authentication
-   Authorization
-   Secure secrets
-   Logging
-   Database backups
-   Privacy controls

Do not trust browser/client-side validation.

------------------------------------------------------------------------

## 37. Recommended MVP

Do not build the full curriculum.

Build two strong vertical slices.

### Topic 1: Two Pointers

Why:

-   Simple visualization
-   Easy pointer animations
-   Tests prediction interactions
-   Tests chunk system
-   Tests gradual scaffolding

Possible chunks:

-   Initialize pointers
-   Read values
-   Compare sum to target
-   Move left
-   Move right
-   Maintain invariant

------------------------------------------------------------------------

### Topic 2: BFS

Why:

BFS stress-tests the platform architecture.

It requires:

-   Graph visualization
-   Graph construction
-   Queue visualization
-   Visited state
-   Neighbor traversal
-   Chunk composition
-   Pseudocode
-   Code execution
-   Code-to-visual mapping

If the architecture handles Two Pointers and BFS cleanly, it will reveal
whether the visualization/content system is reusable.

------------------------------------------------------------------------

## 38. Example BFS Learning Journey

### Lesson 1: Graph representation

Show nodes and edges.

Student converts visual graph into adjacency representation.

------------------------------------------------------------------------

### Lesson 2: `addEdge`

Practice implementing edge insertion.

------------------------------------------------------------------------

### Lesson 3: Neighbors

Ask:

> Which nodes can node 3 reach directly?

Then connect the visual idea to:

``` python
graph[3]
```

------------------------------------------------------------------------

### Lesson 4: Queue

Practice:

-   Add
-   Remove
-   Front
-   Empty check

------------------------------------------------------------------------

### Lesson 5: Visited

Visualize what happens when visited tracking is absent.

Ask students to predict the issue.

------------------------------------------------------------------------

### Lesson 6: Combine chunks

Arrange:

``` text
Queue
Visited
Pop
Process
Neighbors
Push
```

into a BFS structure.

------------------------------------------------------------------------

### Lesson 7: Pseudocode

Student completes missing BFS pseudocode.

------------------------------------------------------------------------

### Lesson 8: Guided BFS

Implement BFS with function structure provided.

------------------------------------------------------------------------

### Lesson 9: Independent BFS

Implement without scaffolding.

------------------------------------------------------------------------

### Lesson 10: Main application

Example: connected components or another appropriate BFS application.

------------------------------------------------------------------------

### Lesson 11: Transfer

Give a different-looking problem where BFS is useful without labeling it
"BFS."

This is the real mastery test.

------------------------------------------------------------------------

## 39. Example Two Pointers Learning Journey

### Step 1

Visualize two positions.

### Step 2

Practice moving pointers.

### Step 3

Predict how movement changes the relevant quantity.

### Step 4

Understand the invariant.

### Step 5

Practice individual pointer-update chunks.

### Step 6

Arrange pseudocode.

### Step 7

Implement guided version.

### Step 8

Solve independent problem.

### Step 9

Solve a transfer problem without being told to use Two Pointers.

------------------------------------------------------------------------

## 40. Product Differentiation

Do not compete primarily on:

> We have 5,000 coding questions.

Compete on:

> We know exactly what skill you are missing and what you should
> practice next.

The platform should eventually be able to say:

``` text
You understand BFS.

Your difficulty is graph construction and recognizing when BFS applies.

Practice:
1. 2 graph-construction drills
2. 1 pattern-recognition exercise
3. Return to the main problem
```

That is significantly more educationally useful than simply recommending
another random graph question.

------------------------------------------------------------------------

## 41. Potential Product Moat

The strongest long-term assets may be:

### Curriculum Graph

The sequence in which concepts should be learned.

### Chunk Library

A structured map of reusable programming skills.

### Misconception Library

Common ways students misunderstand each concept.

### Mastery Data

Evidence about which skills each student actually understands.

### Learning Sequences

Validated paths that reliably move students from confusion to
independent problem solving.

### Educational Interaction Engine

Reusable visual and interactive representations of algorithms.

The codebase itself is unlikely to be the strongest moat.

------------------------------------------------------------------------

## 42. Key Product Questions to Validate

Before scaling, test:

1.  Does chunk practice improve main-problem performance?
2.  How much chunk practice is enough?
3.  When does chunk practice become over-scaffolding?
4.  Do interactive visuals improve transfer?
5.  Which visual interactions produce learning rather than
    entertainment?
6.  Can students recognize patterns without topic labels?
7.  Does spaced chunk revision improve retention?
8.  Can the system accurately identify why a student failed?
9.  Do students become less dependent on hints over time?
10. Can students solve unseen problems independently?

------------------------------------------------------------------------

## 43. Recommended Development Order

### Phase 1: Learning design

Define:

-   Learning philosophy
-   Chunk taxonomy
-   Concept graph
-   Mastery definition
-   Question types

### Phase 2: Content schema

Define structured representations for:

-   Concepts
-   Chunks
-   Activities
-   Visual states
-   Hints
-   Problems
-   Mastery signals

### Phase 3: Visualization engine

Build:

-   Array visualizer
-   Pointer system
-   Graph/tree visualizer
-   Queue/stack visualizer
-   State-transition system

### Phase 4: Lesson player

Build the generic engine that renders lesson activities.

### Phase 5: Coding

Integrate:

-   Monaco
-   Code execution
-   Tests
-   Submission feedback

### Phase 6: Mastery

Track:

-   Chunk mastery
-   Concept mastery
-   Hint usage
-   Transfer performance

### Phase 7: Instructor tooling

Allow content creation without modifying application code.

### Phase 8: Student testing

Test with a small real cohort before expanding curriculum.

------------------------------------------------------------------------

## 44. What Not to Build Initially

Avoid spending MVP time on:

-   Custom IDE
-   Dozens of programming languages
-   Complex AI tutor
-   Microservices everywhere
-   Social network
-   Competitive leaderboard
-   Large marketplace
-   Hundreds of topics
-   Sophisticated ML recommendation engine
-   Advanced 3D visualization
-   Native mobile apps
-   Huge achievement system

First prove:

> Students who follow this learning system become better at
> independently solving unfamiliar coding problems.

------------------------------------------------------------------------

## 45. Initial Technology Summary

``` text
Frontend
├── Next.js
├── React
├── TypeScript
├── Tailwind
├── React + SVG
├── Motion for React
├── React Flow
└── Monaco Editor

Backend
├── Next.js API/server initially
├── PostgreSQL
├── Prisma
└── Redis when required

Execution
└── Judge0 / Piston / managed sandbox

Analytics
└── PostHog or equivalent

Infrastructure
├── Vercel
├── Managed PostgreSQL
├── Object storage
└── Separate code-execution sandbox
```

------------------------------------------------------------------------

## 46. Core System Architecture

``` text
                    ┌────────────────────┐
                    │   Learning Graph   │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │    Chunk System    │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Lesson Engine    │
                    └─────────┬──────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
      ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
      │Visualization│ │ Code Editor  │ │ Questions   │
      │    Engine   │ │   Monaco     │ │ / Hints     │
      └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
             │                │                │
             │        ┌───────▼────────┐       │
             │        │ Code Execution │       │
             │        └───────┬────────┘       │
             │                │                │
             └────────────────┼────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Mastery Engine   │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │ Recommendation    │
                    │     Engine        │
                    └────────────────────┘
```

------------------------------------------------------------------------

## 47. The Central Rule

Every major product decision should be tested against this question:

> Does this help the student become more capable of independently
> recognizing, decomposing, and solving an unfamiliar problem?

If not, it is probably secondary.

The platform should not produce students who are excellent at following
tutorials.

It should progressively remove support until students can think
independently.

------------------------------------------------------------------------

## 48. One-Sentence Product Definition

> **A visual, adaptive coding-learning platform that builds reusable
> problem-solving chunks before guiding students to compose those chunks
> into patterns and independently solve unfamiliar problems.**

------------------------------------------------------------------------

## 49. The Core Loop

The entire product can ultimately be summarized as:

``` text
SEE
 ↓
PREDICT
 ↓
PRACTICE CHUNK
 ↓
COMBINE
 ↓
WRITE PSEUDOCODE
 ↓
IMPLEMENT
 ↓
SOLVE
 ↓
TRANSFER
 ↓
MEASURE MASTERY
 ↓
REVISIT WEAKNESS
```

That loop should remain the foundation even as the platform grows.
