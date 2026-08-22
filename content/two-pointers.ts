import type { Concept } from "@/lib/types";

// ---------------------------------------------------------------------------
// Two Pointers vertical slice (blueprint §37, §39). Authored as structured
// data: the lesson player renders it generically. Swap/extend this file to
// change the curriculum without touching component code.
//
// Running example: sorted array [2, 4, 7, 9, 12]; find two values that sum to
// a target. The whole journey walks the core loop (§49):
//   SEE → PREDICT → PRACTICE CHUNK → COMBINE → PSEUDOCODE → IMPLEMENT →
//   SOLVE → TRANSFER → MEASURE MASTERY.
// ---------------------------------------------------------------------------

const VALUES = [2, 4, 7, 9, 12];

export const twoPointers: Concept = {
  id: "two-pointers",
  title: "Two Pointers",
  tagline: "Sweep a sorted sequence from both ends to hit a target.",
  chunks: [
    {
      id: "initialize-pointers",
      label: "Initialize pointers",
      description: "Place left at the start and right at the end.",
      subgoalLabel: "Set up the search window",
      reusedIn: ["Valid Palindrome", "Container With Most Water", "3Sum", "Merge Sorted Array"],
    },
    {
      id: "read-values",
      label: "Read values",
      description: "Look up the value under a pointer.",
      subgoalLabel: "Inspect the current candidates",
      reusedIn: ["Sliding Window", "Binary Search"],
    },
    {
      id: "compare-sum",
      label: "Compare sum to target",
      description: "Decide whether the current sum is high, low, or exact.",
      subgoalLabel: "Evaluate against the goal",
      reusedIn: ["Binary Search", "3Sum"],
    },
    {
      id: "move-left",
      label: "Move left pointer",
      description: "Advance left to increase the sum.",
      subgoalLabel: "Shrink the window to raise the measure",
      reusedIn: ["Sliding Window", "Container With Most Water"],
    },
    {
      id: "move-right",
      label: "Move right pointer",
      description: "Retreat right to decrease the sum.",
      subgoalLabel: "Shrink the window to lower the measure",
      reusedIn: ["Sliding Window", "Container With Most Water"],
    },
    {
      id: "maintain-invariant",
      label: "Maintain invariant",
      description: "Keep the answer, if any, always between the pointers.",
      subgoalLabel: "Never discard a possible answer",
      reusedIn: ["Binary Search", "3Sum"],
    },
    {
      id: "forward-planning",
      label: "Plan the subgoals",
      description: "Name the plan (setup → loop → decide → shrink) before writing code.",
      subgoalLabel: "Sketch the plan before implementing",
      reusedIn: ["Every pattern"],
    },
    {
      id: "pattern-recognition",
      label: "Recognize the pattern",
      description: "Spot when a sorted-sweep beats brute force.",
      subgoalLabel: "Match problem signals to the technique",
      reusedIn: ["Every pattern"],
    },
  ],
  signals: [
    { trigger: "The array is sorted (or can be sorted cheaply)", pattern: "A two-pointer sweep is likely" },
    { trigger: "You're asked for a pair / triplet meeting a numeric condition", pattern: "Sweep from both ends instead of nested loops" },
    { trigger: "Brute force is O(n²) over all pairs", pattern: "One decision per step can drop it to O(n)" },
    { trigger: "The quantity changes monotonically as an endpoint moves", pattern: "Move the endpoint that fixes the wrong direction" },
  ],
  lessons: [
    // ---- Stage 1: Visual intuition -------------------------------------
    {
      id: "tp-1-see",
      conceptId: "two-pointers",
      order: 1,
      title: "See the setup",
      subtitle: "Two ends, one target",
      stage: "SEE",
      activities: [
        {
          id: "tp-1-a1",
          kind: "info",
          chunks: ["initialize-pointers", "read-values"],
          prompt:
            "The array is sorted. One pointer sits at each end. Their two values add up to the sum shown. Your goal: reach a target of 16.",
          viz: {
            type: "array",
            values: VALUES,
            pointers: [
              { name: "L", index: 0, color: "#38bdf8" },
              { name: "R", index: 4, color: "#f472b6" },
            ],
            highlighted: [0, 4],
            caption: "L + R  =  2 + 12  =  14   (target 16)",
          },
        },
      ],
    },
    // ---- Stage 2: Prediction -------------------------------------------
    {
      id: "tp-2-predict",
      conceptId: "two-pointers",
      order: 2,
      title: "Predict the move",
      subtitle: "Commit before you see the animation",
      stage: "PREDICT",
      activities: [
        {
          id: "tp-2-a1",
          kind: "predict",
          chunks: ["compare-sum", "move-left"],
          prompt: "The sum is 14, which is too small (target 16). Which pointer should move to increase the sum?",
          viz: {
            type: "array",
            values: VALUES,
            pointers: [
              { name: "L", index: 0, color: "#38bdf8" },
              { name: "R", index: 4, color: "#f472b6" },
            ],
            highlighted: [0, 4],
            caption: "sum = 14  <  16",
          },
          revealViz: {
            type: "array",
            values: VALUES,
            pointers: [
              { name: "L", index: 1, color: "#38bdf8" },
              { name: "R", index: 4, color: "#f472b6" },
            ],
            highlighted: [1, 4],
            caption: "sum = 4 + 12 = 16  ✓  found the pair!",
          },
          options: [
            "Move L right (to a larger value)",
            "Move R left (to a smaller value)",
            "Move both inward",
            "Neither — the answer is impossible",
          ],
          correctIndex: 0,
          explanation:
            "Because the array is sorted, moving L right lands on a larger value, which raises the sum. 4 + 12 = 16 — target hit.",
          hints: [
            { level: 1, kind: "nudge", text: "Look at what changes when each pointer moves." },
            { level: 2, kind: "direction", text: "You need a BIGGER sum. Which move reaches a larger number?" },
            { level: 3, kind: "concept", text: "Sorted array: values grow left→right. Moving L right increases the smaller addend." },
          ],
        },
        {
          id: "tp-2-a2",
          kind: "predict",
          chunks: ["compare-sum", "move-right"],
          prompt: "Different target of 13. Right now sum = 2 + 12 = 14, which is too LARGE. Which pointer moves?",
          viz: {
            type: "array",
            values: VALUES,
            pointers: [
              { name: "L", index: 0, color: "#38bdf8" },
              { name: "R", index: 4, color: "#f472b6" },
            ],
            highlighted: [0, 4],
            caption: "sum = 14  >  13",
          },
          revealViz: {
            type: "array",
            values: VALUES,
            pointers: [
              { name: "L", index: 0, color: "#38bdf8" },
              { name: "R", index: 3, color: "#f472b6" },
            ],
            highlighted: [0, 3],
            caption: "sum = 2 + 9 = 11  <  13   (keep going...)",
          },
          options: [
            "Move L right",
            "Move R left (to a smaller value)",
            "Stop — no solution",
            "Restart from the middle",
          ],
          correctIndex: 1,
          explanation:
            "Too large means shrink the sum. Moving R left lands on a smaller value: 2 + 9 = 11. The invariant flips and the search continues.",
          hints: [
            { level: 1, kind: "nudge", text: "You want a SMALLER sum now." },
            { level: 2, kind: "direction", text: "The largest value is at the right end. Step away from it." },
          ],
        },
      ],
    },
    // ---- Stage 3: Chunk practice ---------------------------------------
    {
      id: "tp-3-chunks",
      conceptId: "two-pointers",
      order: 3,
      title: "Practice the chunks",
      subtitle: "Fluency before composition",
      stage: "PRACTICE CHUNK",
      activities: [
        {
          id: "tp-3-a1",
          kind: "fill-code",
          chunks: ["initialize-pointers"],
          prompt: "Initialize the two pointers at opposite ends of the array `nums`.",
          template: ["left = 0", "right = ___"],
          accepted: ["len(nums) - 1", "len(nums)-1"],
          hints: [
            { level: 1, kind: "nudge", text: "The last valid index is not len(nums)." },
            { level: 3, kind: "structure", text: "right = len(nums) - 1" },
          ],
          explanation: "The rightmost index of a length-n array is n − 1.",
        },
        {
          id: "tp-3-a2",
          kind: "fill-code",
          chunks: ["read-values", "compare-sum"],
          prompt: "Compute the current sum of the two pointed-at values.",
          template: ["total = nums[left] + ___"],
          accepted: ["nums[right]"],
          explanation: "Reading both pointed values and adding them is the compare-sum chunk's first half.",
        },
        {
          id: "tp-3-a3",
          kind: "fill-code",
          chunks: ["move-left"],
          prompt: "When the sum is too small, advance the left pointer by one.",
          template: ["if total < target:", "    left += ___"],
          accepted: ["1"],
          explanation: "Moving left forward increases the smaller addend, raising the sum.",
        },
      ],
    },
    // ---- SIGNALS: recognition cues (forward intuition) -----------------
    {
      id: "tp-4-signals",
      conceptId: "two-pointers",
      order: 4,
      title: "Read the signals",
      subtitle: "When should this pattern even come to mind?",
      stage: "SIGNALS",
      activities: [
        {
          id: "tp-4-a1",
          kind: "signals",
          chunks: ["pattern-recognition"],
          prompt:
            "Before any code, learn the triggers. These are the cues that should make Two Pointers pop into your head on a future problem.",
          signals: [
            { trigger: "The array is sorted (or can be sorted cheaply)", pattern: "A two-pointer sweep is likely" },
            { trigger: "You're asked for a pair / triplet meeting a numeric condition", pattern: "Sweep from both ends instead of nested loops" },
            { trigger: "Brute force is O(n²) over all pairs", pattern: "One decision per step can drop it to O(n)" },
            { trigger: "A quantity moves monotonically as an endpoint moves", pattern: "Move the endpoint that fixes the wrong direction" },
          ],
        },
        {
          id: "tp-4-a2",
          kind: "discriminate",
          chunks: ["pattern-recognition"],
          prompt:
            "Recognition check: “Given a SORTED array, find if any two numbers add to a target.” Which signal fires?",
          options: [
            "Sorted + find a pair to a target → two-pointer sweep",
            "Unsorted counts → hash map frequency",
            "Contiguous window of size k → sliding window",
            "Tree of choices → backtracking",
          ],
          correctIndex: 0,
          explanation:
            "‘Sorted’ + ‘find a pair meeting a numeric condition’ is the textbook two-pointer trigger. Naming the signal is what lets you start fast on an unseen problem.",
          hints: [
            { level: 1, kind: "nudge", text: "Which two words in the problem matter most?" },
          ],
        },
      ],
    },
    // ---- FORWARD PLAN: plan the subgoals before coding -----------------
    {
      id: "tp-5-forward",
      conceptId: "two-pointers",
      order: 5,
      title: "Plan before you code",
      subtitle: "Forward reasoning: sketch the subgoals first",
      stage: "FORWARD PLAN",
      activities: [
        {
          id: "tp-5-a1",
          kind: "forward-plan",
          chunks: ["forward-planning", "pattern-recognition"],
          prompt:
            "New problem, no code yet. Arrange the SUBGOAL PLAN you'd follow — the structure, not the syntax. This is the move experts make automatically.",
          items: [
            "Set up the search window (pointers at both ends)",
            "Evaluate the current candidates against the goal",
            "If we hit the goal, we're done",
            "Otherwise decide which side is wrong",
            "Shrink the window from that side, then repeat",
          ],
          explanation:
            "Naming the plan first — setup → evaluate → decide → shrink → repeat — means the implementation is just filling in a structure you already see. That is forward intuition.",
          hints: [
            { level: 1, kind: "nudge", text: "Every sweep sets up before it loops." },
            { level: 2, kind: "direction", text: "You can only decide which side to shrink AFTER evaluating the candidates." },
          ],
        },
      ],
    },
    // ---- Invariant -----------------------------------------------------
    {
      id: "tp-6-invariant",
      conceptId: "two-pointers",
      order: 6,
      title: "The invariant",
      subtitle: "Why the sweep never misses the answer",
      stage: "PREDICT",
      activities: [
        {
          id: "tp-4-a1",
          kind: "mcq",
          chunks: ["maintain-invariant"],
          prompt: "What must stay true after every pointer move for the algorithm to be correct?",
          options: [
            "The pointers never cross, and any valid pair still lies between them",
            "The left value is always smaller than the right value",
            "The sum always decreases each step",
            "Both pointers move the same number of times",
          ],
          correctIndex: 0,
          explanation:
            "The invariant is that no valid pair has been skipped — every candidate answer still lives in the window [left, right]. That's why discarding one end is safe.",
          hints: [
            { level: 3, kind: "concept", text: "An invariant is a condition true before and after each step. Ask: what have we NOT ruled out?" },
          ],
        },
      ],
    },
    // ---- Stage 5: Combine / pseudocode ---------------------------------
    {
      id: "tp-7-combine",
      conceptId: "two-pointers",
      order: 7,
      title: "Order the steps",
      subtitle: "Compose chunks into a loop",
      stage: "COMBINE",
      activities: [
        {
          id: "tp-5-a1",
          kind: "ordering",
          chunks: ["initialize-pointers", "compare-sum", "move-left", "move-right", "maintain-invariant"],
          prompt: "Drag the steps into a valid Two-Pointers structure.",
          items: [
            "Initialize left = 0, right = n - 1",
            "While left < right:",
            "Compute total = nums[left] + nums[right]",
            "If total == target: return the pair",
            "If total < target: move left right",
            "Else: move right left",
          ],
          explanation:
            "Initialize once, then loop: compare, and shrink the window from whichever side is wrong. The loop ends when the pointers meet.",
          hints: [
            { level: 1, kind: "nudge", text: "Something has to set up the pointers before the loop can run." },
            { level: 2, kind: "direction", text: "The equality check should come before you decide which way to move." },
          ],
        },
      ],
    },
    // ---- Stage 6: Guided implementation --------------------------------
    {
      id: "tp-8-guided",
      conceptId: "two-pointers",
      order: 8,
      title: "Guided implementation",
      subtitle: "Fill the gaps in a working solution",
      stage: "IMPLEMENT",
      activities: [
        {
          id: "tp-6-a1",
          kind: "fill-code",
          chunks: ["move-right", "maintain-invariant"],
          prompt: "Complete the branch that runs when the sum overshoots the target.",
          template: [
            "def two_sum(nums, target):",
            "    left, right = 0, len(nums) - 1",
            "    while left < right:",
            "        total = nums[left] + nums[right]",
            "        if total == target:",
            "            return [left, right]",
            "        elif total < target:",
            "            left += 1",
            "        else:",
            "            right -= ___",
          ],
          accepted: ["1"],
          explanation: "Overshoot ⇒ shrink from the large end: right -= 1.",
          hints: [
            { level: 2, kind: "direction", text: "You need a smaller sum, so step off the largest value." },
          ],
        },
      ],
    },
    // ---- Stage 7: Independent ------------------------------------------
    {
      id: "tp-9-independent",
      conceptId: "two-pointers",
      order: 9,
      title: "Independent solve",
      subtitle: "Minimal scaffolding",
      stage: "SOLVE",
      activities: [
        {
          id: "tp-7-a1",
          kind: "fill-code",
          chunks: ["initialize-pointers", "compare-sum", "move-left", "move-right"],
          prompt:
            "Write the loop condition that keeps the two pointers sweeping toward each other (they must not cross).",
          template: [
            "left, right = 0, len(nums) - 1",
            "while ___:",
            "    total = nums[left] + nums[right]",
            "    ...",
          ],
          accepted: ["left < right", "left<right"],
          explanation:
            "left < right keeps a non-empty window and stops exactly when the pointers meet.",
          hints: [
            { level: 1, kind: "nudge", text: "When should the sweep stop?" },
          ],
        },
      ],
    },
    // ---- Stage 8: Transfer ---------------------------------------------
    {
      id: "tp-10-transfer",
      conceptId: "two-pointers",
      order: 10,
      title: "Transfer",
      subtitle: "Same idea, different disguise",
      stage: "TRANSFER",
      activities: [
        {
          id: "tp-8-a1",
          kind: "mcq",
          chunks: ["pattern-recognition"],
          prompt:
            "New problem: given an array of heights, pick two lines that form the container holding the most water. Which technique fits — and why is brute force wasteful?",
          options: [
            "Two pointers from both ends, moving the shorter wall inward — the taller wall can never improve if you shrink width",
            "Sort the array, then binary search for each height",
            "Dynamic programming over subarrays",
            "Depth-first search over all pairs",
          ],
          correctIndex: 0,
          explanation:
            "Area is width × min(height). Start wide; moving the shorter side is the only move that could raise min(height) enough to beat the lost width. That's the same sorted-sweep instinct — recognized without the label 'Two Pointers'.",
          hints: [
            { level: 1, kind: "nudge", text: "You do not need every pair — one decision per step can eliminate a whole side." },
            { level: 2, kind: "direction", text: "Which wall limits the area: the tall one or the short one?" },
          ],
        },
      ],
    },
  ],
};
