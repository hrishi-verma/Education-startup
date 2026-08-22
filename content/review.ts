import type { ChoiceActivity } from "@/lib/types";

// ---------------------------------------------------------------------------
// The interleaved discrimination pool (learning-design.md, INTERLEAVE step).
// Mixed "which pattern fits?" items across topics. Interleaving forces the
// learner to notice the features that DISCRIMINATE one pattern from another —
// the mechanism behind real pattern recognition (Bjork, desirable difficulties).
//
// As more topics ship, add their discriminate items here so the mix widens.
// Every item feeds the `pattern-recognition` mastery dimension.
// ---------------------------------------------------------------------------

export const reviewPool: ChoiceActivity[] = [
  {
    id: "rv-1",
    kind: "discriminate",
    chunks: ["pattern-recognition"],
    prompt:
      "“Given a SORTED array, find two numbers that add up to a target.” Which technique?",
    options: [
      "Two pointers from both ends",
      "Hash map of complements",
      "Sliding window of fixed size",
      "Binary search on the answer",
    ],
    correctIndex: 0,
    explanation:
      "Sorted + find-a-pair is the two-pointer trigger: sweep inward, O(n) and O(1) space. (A hash map works on UNsorted input but costs O(n) space.)",
  },
  {
    id: "rv-2",
    kind: "discriminate",
    chunks: ["pattern-recognition"],
    prompt:
      "“Find the longest substring with at most K distinct characters.” Which technique?",
    options: [
      "Sliding window that grows/shrinks",
      "Two pointers from both ends",
      "Sort then two pointers",
      "Depth-first search",
    ],
    correctIndex: 0,
    explanation:
      "A contiguous run with a constraint = sliding window. Note it's NOT the both-ends sweep — both use two indices, but the window expands from the left. Telling these apart is the whole point of interleaving.",
    hints: [
      { level: 1, kind: "nudge", text: "Is the answer a contiguous run, or a pair at the extremes?" },
    ],
  },
  {
    id: "rv-3",
    kind: "discriminate",
    chunks: ["pattern-recognition"],
    prompt:
      "“Return indices of two numbers in an UNSORTED array that add to a target.” Which technique?",
    options: [
      "Hash map of seen complements (one pass)",
      "Two pointers from both ends",
      "Sliding window",
      "Binary search",
    ],
    correctIndex: 0,
    explanation:
      "Unsorted + can't reorder (need original indices) breaks the two-pointer trigger. A hash map of complements is O(n). Same surface as rv-1, different deep structure — surface can lie.",
    hints: [
      { level: 2, kind: "direction", text: "What does 'unsorted' rule out that rv-1 relied on?" },
    ],
  },
  {
    id: "rv-4",
    kind: "discriminate",
    chunks: ["pattern-recognition"],
    prompt:
      "“Array of wall heights; pick two walls forming the container with the most water.” Which technique?",
    options: [
      "Two pointers, move the shorter wall inward",
      "Sliding window",
      "Sort then binary search",
      "Prefix sums",
    ],
    correctIndex: 0,
    explanation:
      "Area = width × min(height). Start wide; only moving the shorter wall can improve the limiting height. A disguised two-pointer problem — no 'sorted', no 'pair sum', same instinct.",
  },
];
