import type { Concept } from "@/lib/types";

// ---------------------------------------------------------------------------
// Binary Search — reuses ArrayViz (lo / mid / hi pointers + highlighted range).
// 12-step template. Running example: find target in a sorted array; halve the
// search range each step → O(log n).  nums = [1,3,5,7,9,11], target 7 → idx 3.
// ---------------------------------------------------------------------------

const NUMS = [1, 3, 5, 7, 9, 11];
const LO = "#38bdf8";
const MID = "#a78bfa";
const HI = "#f472b6";

export const binarySearch: Concept = {
  id: "binary-search",
  title: "Binary Search",
  tagline: "Halve the search space each step — O(log n) on sorted data.",
  chunks: [
    { id: "init-lo-hi", label: "Set lo and hi", description: "Bound the search with lo=0 and hi=n-1.", subgoalLabel: "Bound the search range", reusedIn: ["Search Insert Position", "Search Rotated Array"] },
    { id: "compute-mid", label: "Compute the midpoint", description: "mid = (lo + hi) // 2, the element to test.", subgoalLabel: "Probe the middle", reusedIn: ["Binary Search on Answer", "Koko Eating Bananas"] },
    { id: "compare-mid", label: "Compare mid to target", description: "Decide whether the answer is left, right, or here.", subgoalLabel: "Decide which half to keep", reusedIn: ["Find Peak Element", "Search Rotated Array"] },
    { id: "halve-range", label: "Discard half", description: "Move lo=mid+1 or hi=mid-1 to drop the impossible half.", subgoalLabel: "Throw away half the space", reusedIn: ["Search Insert Position", "First Bad Version"] },
    { id: "search-invariant", label: "Keep the invariant", description: "The target, if present, always stays within [lo, hi].", subgoalLabel: "Never discard the answer", reusedIn: ["Binary Search on Answer"] },
    { id: "forward-planning", label: "Plan the subgoals", description: "Name the plan (bound → probe → compare → halve) first.", subgoalLabel: "Sketch the plan before implementing", reusedIn: ["Every pattern"] },
    { id: "pattern-recognition", label: "Recognize the pattern", description: "Spot a sorted/monotonic space you can halve.", subgoalLabel: "Match problem signals to the technique", reusedIn: ["Every pattern"] },
  ],
  signals: [
    { trigger: "The data is sorted and you're searching for something", pattern: "Binary search — O(log n), not a linear scan" },
    { trigger: "A monotonic predicate ('first value that is true')", pattern: "Binary search on the boundary" },
    { trigger: "'Minimize/maximize a value that must satisfy a check'", pattern: "Binary search on the answer" },
    { trigger: "You're scanning sorted data linearly (O(n))", pattern: "Halve instead → O(log n)" },
  ],
  lessons: [
    {
      id: "bs-1-see", conceptId: "binary-search", order: 1, title: "See the halving", subtitle: "Probe the middle", stage: "SEE",
      activities: [{
        id: "bs-1-a1", kind: "info", chunks: ["init-lo-hi", "compute-mid"],
        prompt: "The array is sorted. lo and hi bound the search; mid is the element we test. Comparing mid to the target lets us throw away half the array at once.",
        viz: { type: "array", values: NUMS, pointers: [{ name: "lo", index: 0, color: LO }, { name: "mid", index: 2, color: MID }, { name: "hi", index: 5, color: HI }], highlighted: [0, 1, 2, 3, 4, 5], caption: "target = 7 · mid = nums[2] = 5" },
      }],
    },
    {
      id: "bs-2-predict", conceptId: "binary-search", order: 2, title: "Predict the half", subtitle: "Which side survives?", stage: "PREDICT",
      activities: [{
        id: "bs-2-a1", kind: "predict", chunks: ["compare-mid", "halve-range"],
        prompt: "mid = 5, target = 7. Since 5 < 7, which half can we safely discard?",
        viz: { type: "array", values: NUMS, pointers: [{ name: "lo", index: 0, color: LO }, { name: "mid", index: 2, color: MID }, { name: "hi", index: 5, color: HI }], highlighted: [0, 1, 2], caption: "mid = 5 < target 7" },
        revealViz: { type: "array", values: NUMS, pointers: [{ name: "lo", index: 3, color: LO }, { name: "mid", index: 4, color: MID }, { name: "hi", index: 5, color: HI }], highlighted: [3, 4, 5], caption: "keep the right half: lo = mid + 1 = 3" },
        options: ["Discard the left half; set lo = mid + 1", "Discard the right half; set hi = mid - 1", "Discard both halves", "Restart from index 0"],
        correctIndex: 0,
        explanation: "Sorted array: everything at or left of mid is ≤ 5 < 7, so the target can only be to the right. Move lo past mid.",
        hints: [{ level: 1, kind: "nudge", text: "In a sorted array, where can a value larger than mid live?" }],
      }],
    },
    {
      id: "bs-3-chunks", conceptId: "binary-search", order: 3, title: "Practice the chunks", subtitle: "Fluency before composition", stage: "PRACTICE CHUNK",
      activities: [
        { id: "bs-3-a1", kind: "fill-code", chunks: ["init-lo-hi"], prompt: "Bound the search over the whole array.", template: ["lo, hi = 0, len(nums) - ___"], accepted: ["1"], explanation: "hi starts at the last valid index, n − 1." },
        { id: "bs-3-a2", kind: "fill-code", chunks: ["compute-mid"], prompt: "Compute the midpoint index.", template: ["mid = (lo + hi) // ___"], accepted: ["2"], explanation: "Integer-divide the range midpoint; `//` floors it to a valid index." },
        { id: "bs-3-a3", kind: "fill-code", chunks: ["halve-range"], prompt: "The target is bigger than nums[mid]. Discard the left half.", template: ["if nums[mid] < target:", "    lo = mid + ___"], accepted: ["1"], explanation: "mid is too small, so the answer is strictly to its right." },
      ],
    },
    {
      id: "bs-4-signals", conceptId: "binary-search", order: 4, title: "Read the signals", subtitle: "When to halve", stage: "SIGNALS",
      activities: [
        { id: "bs-4-a1", kind: "signals", chunks: ["pattern-recognition"], prompt: "Learn the triggers that should make 'binary search' pop into your head.", signals: [
          { trigger: "Sorted data + searching", pattern: "Binary search, O(log n)" },
          { trigger: "Monotonic predicate ('first true')", pattern: "Search the boundary" },
          { trigger: "Minimize/maximize a value with a feasibility check", pattern: "Binary search on the answer" },
          { trigger: "Linear scan over sorted data", pattern: "Halve instead → O(log n)" },
        ] },
        { id: "bs-4-a2", kind: "discriminate", chunks: ["pattern-recognition"], prompt: "“Given a sorted array, find the index of a target (or -1).” Which technique?", options: ["Binary search — halve the range each step", "Sliding window", "Hash map of values", "Two pointers from both ends"], correctIndex: 0, explanation: "Sorted + search for one element = binary search: O(log n) beats a linear scan and needs no extra memory." },
      ],
    },
    {
      id: "bs-5-forward", conceptId: "binary-search", order: 5, title: "Plan before you code", subtitle: "Forward reasoning", stage: "FORWARD PLAN",
      activities: [{
        id: "bs-5-a1", kind: "forward-plan", chunks: ["forward-planning", "pattern-recognition"],
        prompt: "Search a sorted array for a target. Arrange the subgoal plan before coding.",
        items: ["Set lo = 0, hi = n − 1", "While lo ≤ hi:", "Compute mid = (lo + hi) // 2", "If nums[mid] == target: return mid", "If nums[mid] < target: lo = mid + 1, else hi = mid − 1"],
        explanation: "Bound → loop → probe mid → compare → discard half. The equality check comes before deciding a direction.",
        hints: [{ level: 2, kind: "direction", text: "Check for a direct hit before choosing which half to drop." }],
      }],
    },
    {
      id: "bs-6-combine", conceptId: "binary-search", order: 6, title: "Order the steps", subtitle: "Compose the loop", stage: "COMBINE",
      activities: [{
        id: "bs-6-a1", kind: "ordering", chunks: ["init-lo-hi", "compute-mid", "compare-mid", "halve-range"],
        prompt: "Arrange a correct binary search.",
        items: ["lo, hi = 0, len(nums) - 1", "while lo <= hi:", "mid = (lo + hi) // 2", "if nums[mid] == target: return mid", "elif nums[mid] < target: lo = mid + 1", "else: hi = mid - 1"],
        explanation: "Bound the range, loop while it's non-empty, probe the middle, and shrink toward the target.",
        hints: [{ level: 1, kind: "nudge", text: "The bounds must be set before the loop runs." }],
      }],
    },
    {
      id: "bs-7-implement", conceptId: "binary-search", order: 7, title: "Implement it", subtitle: "Write and run real code", stage: "IMPLEMENT",
      activities: [{
        id: "bs-7-a1", kind: "code", chunks: ["init-lo-hi", "compute-mid", "compare-mid", "halve-range"], language: "python",
        prompt: "Implement binary_search(nums, target): return the index of target in the sorted list, or -1 if absent. Run it against the tests.",
        starter: "def binary_search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    # Loop while the range is non-empty; probe mid; keep the half\n    # that could contain the target.\n    pass\n",
        tests: [
          { call: "binary_search([1,3,5,7,9,11], 7)", expected: "3" },
          { call: "binary_search([1,3,5,7,9,11], 4)", expected: "-1" },
          { call: "binary_search([2], 2)", expected: "0" },
          { call: "binary_search([1,3,5,7,9,11], 11)", expected: "5" },
          { call: "binary_search([], 1)", expected: "-1" },
        ],
        hints: [
          { level: 1, kind: "nudge", text: "Loop condition: while lo <= hi." },
          { level: 3, kind: "structure", text: "mid=(lo+hi)//2; if hit return mid; elif nums[mid]<target lo=mid+1 else hi=mid-1; return -1" },
        ],
      }],
    },
    {
      id: "bs-8-transfer", conceptId: "binary-search", order: 8, title: "Transfer", subtitle: "Same idea, different disguise", stage: "TRANSFER",
      activities: [{
        id: "bs-8-a1", kind: "mcq", chunks: ["pattern-recognition"],
        prompt: "“You can eat bananas at speed s/hour; find the smallest s that finishes all piles within H hours.” How does binary search apply with no sorted array in sight?",
        options: ["Binary-search the ANSWER s: 'can finish in H hours?' is monotonic in s", "Sort the piles then two-pointer", "Sliding window over the piles", "Hash the pile sizes"],
        correctIndex: 0,
        explanation: "Feasibility ('finishes in time') flips from false to true as s increases — a monotonic predicate. Binary search the smallest s where it becomes true. The 'sorted array' is the space of possible answers.",
        hints: [{ level: 1, kind: "nudge", text: "Is 'can finish in time?' monotonic as speed grows?" }],
      }],
    },
  ],
};
