import type { Concept } from "@/lib/types";

// ---------------------------------------------------------------------------
// Sliding Window — reuses ArrayViz unchanged (window = highlighted range +
// L/R pointers), proving a new topic is data-only. 12-step template.
// Running example: maximum sum of a contiguous window of size k.
// nums = [2, 1, 5, 1, 3, 2], k = 3  → best window [5,1,3] = 9.
// ---------------------------------------------------------------------------

const NUMS = [2, 1, 5, 1, 3, 2];
const L = "#38bdf8";
const R = "#f472b6";

export const slidingWindow: Concept = {
  id: "sliding-window",
  title: "Sliding Window",
  tagline: "Reuse work as a window slides — O(n) instead of recomputing each range.",
  chunks: [
    { id: "init-window", label: "Set the first window", description: "Sum the first k elements to seed the window.", subgoalLabel: "Seed the window", reusedIn: ["Max Sum Subarray", "Longest Substring"] },
    { id: "slide-window", label: "Slide by reusing work", description: "Add the entering element, subtract the leaving one — don't recompute.", subgoalLabel: "Update instead of recompute", reusedIn: ["Max Sum Subarray", "Min Window Substring"] },
    { id: "track-best", label: "Track the best so far", description: "Keep a running best across all windows.", subgoalLabel: "Remember the best answer", reusedIn: ["Kadane", "Max Sum Subarray"] },
    { id: "grow-shrink", label: "Grow / shrink to a constraint", description: "For variable windows, expand right and shrink left until valid.", subgoalLabel: "Resize until the constraint holds", reusedIn: ["Longest Substring", "Min Window Substring"] },
    { id: "forward-planning", label: "Plan the subgoals", description: "Name the plan (seed → slide → track) before coding.", subgoalLabel: "Sketch the plan before implementing", reusedIn: ["Every pattern"] },
    { id: "pattern-recognition", label: "Recognize the pattern", description: "Spot a contiguous-range problem that can reuse work.", subgoalLabel: "Match problem signals to the technique", reusedIn: ["Every pattern"] },
  ],
  signals: [
    { trigger: "Longest / shortest / max / min over a CONTIGUOUS subarray or substring", pattern: "Slide a window instead of re-scanning" },
    { trigger: "A fixed window size k", pattern: "Seed once, then slide by add-one / drop-one" },
    { trigger: "A constraint like 'at most K distinct' or 'sum ≥ target'", pattern: "Variable window: grow right, shrink left" },
    { trigger: "You're recomputing each window from scratch (O(n·k))", pattern: "Reuse the overlap → O(n)" },
  ],
  lessons: [
    {
      id: "sw-1-see", conceptId: "sliding-window", order: 1, title: "See the window", subtitle: "A frame that slides", stage: "SEE",
      activities: [{
        id: "sw-1-a1", kind: "info", chunks: ["init-window"],
        prompt: "The blue/pink pointers bound a window of size 3. Its sum is shown. We'll slide it across the array and track the biggest sum.",
        viz: { type: "array", values: NUMS, pointers: [{ name: "L", index: 0, color: L }, { name: "R", index: 2, color: R }], highlighted: [0, 1, 2], caption: "window [2,1,5] · sum = 8" },
      }],
    },
    {
      id: "sw-2-predict", conceptId: "sliding-window", order: 2, title: "Predict the slide", subtitle: "Reuse the overlap", stage: "PREDICT",
      activities: [{
        id: "sw-2-a1", kind: "predict", chunks: ["slide-window"],
        prompt: "We slide one step right. Instead of re-adding three numbers, what's the cheapest correct update to the sum (currently 8)?",
        viz: { type: "array", values: NUMS, pointers: [{ name: "L", index: 0, color: L }, { name: "R", index: 2, color: R }], highlighted: [0, 1, 2], caption: "window [2,1,5] · sum = 8" },
        revealViz: { type: "array", values: NUMS, pointers: [{ name: "L", index: 1, color: L }, { name: "R", index: 3, color: R }], highlighted: [1, 2, 3], caption: "sum = 8 − 2 + 1 = 7  (window [1,5,1])" },
        options: ["Add the entering value, subtract the leaving value: 8 − 2 + 1 = 7", "Recompute 1 + 5 + 1 from scratch", "Just add the entering value: 8 + 1 = 9", "Double the previous sum"],
        correctIndex: 0,
        explanation: "The two windows overlap in [1,5]. Only one value leaves and one enters, so one subtraction and one addition update the sum in O(1).",
        hints: [{ level: 1, kind: "nudge", text: "What changed between the two windows — and what stayed?" }],
      }],
    },
    {
      id: "sw-3-chunks", conceptId: "sliding-window", order: 3, title: "Practice the chunks", subtitle: "Fluency before composition", stage: "PRACTICE CHUNK",
      activities: [
        { id: "sw-3-a1", kind: "fill-code", chunks: ["init-window"], prompt: "Seed the window with the sum of the first k elements.", template: ["window = sum(nums[:___])"], accepted: ["k"], explanation: "`nums[:k]` is the first window; summing it seeds the slide." },
        { id: "sw-3-a2", kind: "fill-code", chunks: ["slide-window"], prompt: "Slide one step: add the entering element at i, drop the one leaving at i-k.", template: ["window += nums[i] - nums[i - ___]"], accepted: ["k"], explanation: "The element leaving the window is exactly k positions behind the one entering." },
        { id: "sw-3-a3", kind: "fill-code", chunks: ["track-best"], prompt: "Keep the best window sum seen so far.", template: ["best = max(best, ___)"], accepted: ["window"], explanation: "After each slide, compare the current window against the running best." },
      ],
    },
    {
      id: "sw-4-signals", conceptId: "sliding-window", order: 4, title: "Read the signals", subtitle: "When should a window come to mind?", stage: "SIGNALS",
      activities: [
        { id: "sw-4-a1", kind: "signals", chunks: ["pattern-recognition"], prompt: "Learn the triggers that should make 'sliding window' pop into your head.", signals: [
          { trigger: "Longest / max / min over a CONTIGUOUS range", pattern: "Slide a window" },
          { trigger: "Fixed window size k", pattern: "Seed once, then add-one / drop-one" },
          { trigger: "Constraint like 'at most K distinct'", pattern: "Variable window: grow then shrink" },
          { trigger: "Recomputing each window (O(n·k))", pattern: "Reuse overlap → O(n)" },
        ] },
        { id: "sw-4-a2", kind: "discriminate", chunks: ["pattern-recognition"], prompt: "“Find the longest substring with at most 2 distinct characters.” Which technique?", options: ["Variable-size sliding window (grow right, shrink left)", "Two pointers from both ends", "Binary search", "Hash map of complements"], correctIndex: 0, explanation: "A contiguous run under a constraint is a variable window: expand right, and shrink left whenever the distinct-count exceeds 2." },
      ],
    },
    {
      id: "sw-5-forward", conceptId: "sliding-window", order: 5, title: "Plan before you code", subtitle: "Forward reasoning", stage: "FORWARD PLAN",
      activities: [{
        id: "sw-5-a1", kind: "forward-plan", chunks: ["forward-planning", "pattern-recognition"],
        prompt: "Max sum of a window of size k. Arrange the subgoal plan before writing code.",
        items: ["Seed: sum the first k elements into `window`", "Set `best = window`", "For each new right index from k onward:", "Slide: window += nums[i] − nums[i−k]", "Update best = max(best, window)"],
        explanation: "Seed → slide → track. Naming it first makes the code a fill-in exercise.",
        hints: [{ level: 1, kind: "nudge", text: "You can't slide before the first window exists." }],
      }],
    },
    {
      id: "sw-6-combine", conceptId: "sliding-window", order: 6, title: "Order the steps", subtitle: "Compose the loop", stage: "COMBINE",
      activities: [{
        id: "sw-6-a1", kind: "ordering", chunks: ["init-window", "slide-window", "track-best"],
        prompt: "Arrange a correct fixed-window maximum sum.",
        items: ["window = sum(nums[:k])", "best = window", "for i in range(k, len(nums)):", "window += nums[i] - nums[i - k]", "best = max(best, window)"],
        explanation: "Seed the window and best, then slide once per new element, updating best.",
        hints: [{ level: 1, kind: "nudge", text: "Seeding happens once, before the loop." }],
      }],
    },
    {
      id: "sw-7-implement", conceptId: "sliding-window", order: 7, title: "Implement it", subtitle: "Write and run real code", stage: "IMPLEMENT",
      activities: [{
        id: "sw-7-a1", kind: "code", chunks: ["init-window", "slide-window", "track-best"], language: "python",
        prompt: "Implement max_sum(nums, k): the maximum sum of any contiguous window of size k. Run it against the tests.",
        starter: "def max_sum(nums, k):\n    # Seed the first window, then slide: add the entering\n    # element and subtract the leaving one. Track the best.\n    pass\n",
        tests: [
          { call: "max_sum([2,1,5,1,3,2], 3)", expected: "9" },
          { call: "max_sum([1,1,1,1], 2)", expected: "2" },
          { call: "max_sum([5], 1)", expected: "5" },
          { call: "max_sum([4,2,1,7,8,1,2,8,1,0], 3)", expected: "16" },
        ],
        hints: [
          { level: 1, kind: "nudge", text: "Start with window = sum(nums[:k])." },
          { level: 3, kind: "structure", text: "for i in range(k, len(nums)): window += nums[i] - nums[i-k]; best = max(best, window)" },
        ],
      }],
    },
    {
      id: "sw-8-transfer", conceptId: "sliding-window", order: 8, title: "Transfer", subtitle: "Same idea, different disguise", stage: "TRANSFER",
      activities: [{
        id: "sw-8-a1", kind: "mcq", chunks: ["pattern-recognition"],
        prompt: "“Smallest subarray whose sum is ≥ target (positive numbers).” Which approach — and why not fixed-size?",
        options: ["Variable window: grow right to reach target, then shrink left to minimize", "Fixed window of size target", "Two pointers from both ends", "Sort then binary search"],
        correctIndex: 0,
        explanation: "The window size isn't known ahead of time, so you grow until the sum reaches target, then shrink from the left to find the smallest valid window — still one pass.",
        hints: [{ level: 1, kind: "nudge", text: "Do you know the window size in advance here?" }],
      }],
    },
  ],
};
