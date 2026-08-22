import type { Concept } from "@/lib/types";

// ---------------------------------------------------------------------------
// Arrays & Hashing — the ROOT of the roadmap (blueprint §6). Authored as data
// on the same 12-step template as Two Pointers (see docs/product/learning-
// design.md), proving a new topic needs no new components.
//
// Big idea: a hash map / set buys O(1) "have I seen this? / how many?" lookups,
// so an O(n²) nested scan collapses to O(n) — at the cost of O(n) memory.
// Running examples: Contains-Duplicate (set) and Two-Sum on UNSORTED input (map).
// ---------------------------------------------------------------------------

const DUP = [3, 1, 4, 1, 5];

export const arraysHashing: Concept = {
  id: "arrays-hashing",
  title: "Arrays & Hashing",
  tagline: "Trade memory for speed: O(1) lookups turn nested scans into one pass.",
  chunks: [
    {
      id: "iterate-array",
      label: "Iterate an array",
      description: "Walk each element once, carrying state as you go.",
      subgoalLabel: "Process every element once",
      reusedIn: ["Two Pointers", "Sliding Window", "Prefix Sum", "Every array problem"],
    },
    {
      id: "set-membership",
      label: "Track what you've seen",
      description: "Add to a set and ask 'have I seen this before?' in O(1).",
      subgoalLabel: "Remember seen values for instant lookup",
      reusedIn: ["Contains Duplicate", "Longest Consecutive Sequence", "Linked List cycle"],
    },
    {
      id: "hash-count",
      label: "Build a frequency map",
      description: "Count occurrences with a dict: counts[x] = counts.get(x,0)+1.",
      subgoalLabel: "Tally how many times each value appears",
      reusedIn: ["Valid Anagram", "Group Anagrams", "Top K Frequent"],
    },
    {
      id: "complement-lookup",
      label: "Look up the complement",
      description: "For a target, the thing you need is target − x. Ask the map for it.",
      subgoalLabel: "Turn 'find a pair' into a single lookup",
      reusedIn: ["Two Sum", "Sliding Window", "Subarray Sum Equals K"],
    },
    {
      id: "index-map",
      label: "Map value → index",
      description: "Store where you saw each value so you can return positions.",
      subgoalLabel: "Remember position, not just presence",
      reusedIn: ["Two Sum", "Longest Substring Without Repeat"],
    },
    {
      id: "forward-planning",
      label: "Plan the subgoals",
      description: "Name the plan (empty map → scan → lookup → store) before coding.",
      subgoalLabel: "Sketch the plan before implementing",
      reusedIn: ["Every pattern"],
    },
    {
      id: "pattern-recognition",
      label: "Recognize the pattern",
      description: "Spot when an O(1) lookup structure beats a nested scan.",
      subgoalLabel: "Match problem signals to the technique",
      reusedIn: ["Every pattern"],
    },
  ],
  signals: [
    { trigger: "You're about to write a nested loop to find a match (O(n²))", pattern: "Replace the inner scan with an O(1) hash lookup" },
    { trigger: "The question asks 'is there a duplicate / have I seen this?'", pattern: "Use a set of seen values" },
    { trigger: "You need counts / frequencies of items", pattern: "Use a hash map (dict) of value → count" },
    { trigger: "Find a pair meeting a condition in UNSORTED data (keep indices)", pattern: "Hash map of value → index; look up the complement" },
  ],
  lessons: [
    // ---- SEE ----------------------------------------------------------
    {
      id: "ah-1-see",
      conceptId: "arrays-hashing",
      order: 1,
      title: "See the setup",
      subtitle: "Remembering what you've already seen",
      stage: "SEE",
      activities: [
        {
          id: "ah-1-a1",
          kind: "info",
          chunks: ["iterate-array", "set-membership"],
          prompt:
            "We want to know if this array has any duplicate. Walk it left to right and keep a 'seen' set. The moment a value is already in the set, we've found a duplicate — no nested loop needed.",
          viz: {
            type: "array",
            values: DUP,
            highlighted: [0, 1, 2],
            caption: "scanning left → right · next up: index 3 (value 1)",
          },
        },
        {
          id: "ah-1-a2",
          kind: "info",
          chunks: ["set-membership"],
          prompt:
            "This is the 'seen' set after the first three values. It answers one question in O(1): is a value already inside?",
          viz: {
            type: "hashmap",
            mode: "set",
            label: "seen",
            entries: [{ key: "3" }, { key: "1" }, { key: "4" }],
            caption: "next value is 1 — is it already here?",
          },
        },
      ],
    },
    // ---- PREDICT ------------------------------------------------------
    {
      id: "ah-2-predict",
      conceptId: "arrays-hashing",
      order: 2,
      title: "Predict the hit",
      subtitle: "Commit before the reveal",
      stage: "PREDICT",
      activities: [
        {
          id: "ah-2-a1",
          kind: "predict",
          chunks: ["set-membership"],
          prompt: "We've seen {3, 1, 4}. The next value is 1. What happens when we check the set?",
          viz: {
            type: "array",
            values: DUP,
            highlighted: [0, 1, 2],
            caption: "seen = {3, 1, 4}   ·   checking value 1",
          },
          revealViz: {
            type: "hashmap",
            mode: "set",
            label: "seen",
            entries: [{ key: "3" }, { key: "1", highlighted: true }, { key: "4" }],
            caption: "1 is already in seen → duplicate found!",
          },
          options: [
            "1 is already in the set → duplicate found, stop",
            "1 is new → add it and continue",
            "The set resets each step",
            "We must scan the rest of the array to be sure",
          ],
          correctIndex: 0,
          explanation:
            "A set lookup is O(1). Because 1 was added at index 1, seeing it again at index 3 is an instant hit — no rescanning.",
          hints: [
            { level: 1, kind: "nudge", text: "Was 1 added to the set earlier?" },
            { level: 2, kind: "direction", text: "Membership in a set is a single O(1) question." },
          ],
        },
      ],
    },
    // ---- PRACTICE CHUNK ----------------------------------------------
    {
      id: "ah-3-chunks",
      conceptId: "arrays-hashing",
      order: 3,
      title: "Practice the chunks",
      subtitle: "Fluency before composition",
      stage: "PRACTICE CHUNK",
      activities: [
        {
          id: "ah-3-a1",
          kind: "fill-code",
          chunks: ["set-membership"],
          prompt: "Check whether the current value has been seen before.",
          template: ["seen = set()", "for x in nums:", "    if x in ___:", "        return True", "    seen.add(x)"],
          accepted: ["seen"],
          explanation: "`x in seen` is the O(1) membership test at the heart of duplicate detection.",
          hints: [{ level: 3, kind: "structure", text: "if x in seen:" }],
        },
        {
          id: "ah-3-a2",
          kind: "fill-code",
          chunks: ["hash-count"],
          prompt: "Increment the count for value x in a frequency map, defaulting missing keys to 0.",
          template: ["counts[x] = counts.get(x, 0) + ___"],
          accepted: ["1"],
          explanation: "`.get(x, 0)` supplies 0 for unseen keys, so the first occurrence becomes 1.",
        },
        {
          id: "ah-3-a3",
          kind: "fill-code",
          chunks: ["complement-lookup"],
          prompt: "For Two Sum, compute the complement you need to reach the target.",
          template: ["need = target - ___"],
          accepted: ["x", "num", "n"],
          explanation: "If the current value is x, the partner that completes the target is target − x.",
        },
      ],
    },
    // ---- SIGNALS ------------------------------------------------------
    {
      id: "ah-4-signals",
      conceptId: "arrays-hashing",
      order: 4,
      title: "Read the signals",
      subtitle: "When should hashing come to mind?",
      stage: "SIGNALS",
      activities: [
        {
          id: "ah-4-a1",
          kind: "signals",
          chunks: ["pattern-recognition"],
          prompt: "Learn the triggers. These cues should make a hash map/set pop into your head on a future problem.",
          signals: [
            { trigger: "About to write a nested loop to find a match (O(n²))", pattern: "Replace the inner scan with an O(1) hash lookup" },
            { trigger: "'Is there a duplicate / have I seen this?'", pattern: "Use a set of seen values" },
            { trigger: "You need counts / frequencies", pattern: "Use a hash map of value → count" },
            { trigger: "Find a pair in UNSORTED data, keep indices", pattern: "Hash map value → index; look up the complement" },
          ],
        },
        {
          id: "ah-4-a2",
          kind: "discriminate",
          chunks: ["pattern-recognition"],
          prompt:
            "Recognition check: “Return indices of the two numbers in an UNSORTED array that add to a target.” Which technique?",
          options: [
            "Hash map of value → index; look up target − x in one pass",
            "Two pointers from both ends",
            "Sort, then binary search",
            "Sliding window",
          ],
          correctIndex: 0,
          explanation:
            "Unsorted + must return original indices rules out sorting/two-pointers. A value→index map finds the complement in O(n).",
          hints: [{ level: 1, kind: "nudge", text: "What does 'unsorted' + 'return indices' rule out?" }],
        },
      ],
    },
    // ---- FORWARD PLAN -------------------------------------------------
    {
      id: "ah-5-forward",
      conceptId: "arrays-hashing",
      order: 5,
      title: "Plan before you code",
      subtitle: "Forward reasoning: sketch the subgoals first",
      stage: "FORWARD PLAN",
      activities: [
        {
          id: "ah-5-a1",
          kind: "forward-plan",
          chunks: ["forward-planning", "pattern-recognition"],
          prompt:
            "Two Sum on unsorted input. Arrange the SUBGOAL PLAN — the structure, not the syntax — before writing any code.",
          items: [
            "Create an empty map of value → index",
            "Scan the array one element at a time",
            "Compute the complement (target − current value)",
            "If the complement is already in the map, return both indices",
            "Otherwise store the current value → its index, and continue",
          ],
          explanation:
            "Empty map → scan → complement → lookup → store. Naming this plan first makes the code a fill-in-the-blanks exercise. That is forward intuition.",
          hints: [
            { level: 1, kind: "nudge", text: "You can't look anything up before the map exists." },
            { level: 2, kind: "direction", text: "Check for the complement BEFORE storing the current value (avoids matching itself)." },
          ],
        },
      ],
    },
    // ---- Trade-off insight -------------------------------------------
    {
      id: "ah-6-tradeoff",
      conceptId: "arrays-hashing",
      order: 6,
      title: "The trade-off",
      subtitle: "Nothing is free",
      stage: "PREDICT",
      activities: [
        {
          id: "ah-6-a1",
          kind: "mcq",
          chunks: ["pattern-recognition"],
          prompt: "The hash approach turns an O(n²) scan into O(n) time. What do we pay for that speed?",
          options: [
            "Extra O(n) memory to hold the set / map",
            "The array must be sorted first",
            "It only works on numbers",
            "Nothing — it's strictly better in every way",
          ],
          correctIndex: 0,
          explanation:
            "Hashing trades space for time: we spend O(n) extra memory on the map to buy O(1) lookups. Recognizing that trade-off is part of choosing it wisely.",
        },
      ],
    },
    // ---- COMBINE ------------------------------------------------------
    {
      id: "ah-7-combine",
      conceptId: "arrays-hashing",
      order: 7,
      title: "Order the steps",
      subtitle: "Compose chunks into Two Sum",
      stage: "COMBINE",
      activities: [
        {
          id: "ah-7-a1",
          kind: "ordering",
          chunks: ["iterate-array", "complement-lookup", "index-map"],
          prompt: "Arrange the steps into a correct one-pass Two Sum.",
          items: [
            "seen = {}  (value → index)",
            "for i, x in enumerate(nums):",
            "need = target - x",
            "if need in seen: return [seen[need], i]",
            "seen[x] = i",
          ],
          explanation:
            "Create the map, scan once, and for each value check for its complement BEFORE recording it. Checking first prevents pairing a value with itself.",
          hints: [
            { level: 1, kind: "nudge", text: "The map has to exist before the loop." },
            { level: 2, kind: "direction", text: "Look up the complement before you store the current value." },
          ],
        },
      ],
    },
    // ---- GUIDED -------------------------------------------------------
    {
      id: "ah-8-guided",
      conceptId: "arrays-hashing",
      order: 8,
      title: "Guided implementation",
      subtitle: "Fill the gap in a working solution",
      stage: "IMPLEMENT",
      activities: [
        {
          id: "ah-8-a1",
          kind: "fill-code",
          chunks: ["index-map"],
          prompt: "Complete the line that records where the current value was seen.",
          template: [
            "def two_sum(nums, target):",
            "    seen = {}",
            "    for i, x in enumerate(nums):",
            "        need = target - x",
            "        if need in seen:",
            "            return [seen[need], i]",
            "        seen[x] = ___",
          ],
          accepted: ["i"],
          explanation: "Store value → its index so a later complement can return this position.",
        },
      ],
    },
    // ---- INDEPENDENT --------------------------------------------------
    {
      id: "ah-9-independent",
      conceptId: "arrays-hashing",
      order: 9,
      title: "Independent solve",
      subtitle: "Minimal scaffolding",
      stage: "SOLVE",
      activities: [
        {
          id: "ah-9-a1",
          kind: "fill-code",
          chunks: ["complement-lookup", "index-map"],
          prompt: "Write the condition that fires when the partner for the current value already exists.",
          template: ["seen = {}", "for i, x in enumerate(nums):", "    need = target - x", "    if ___:", "        return [seen[need], i]", "    seen[x] = i"],
          accepted: ["need in seen", "need in seen.keys()"],
          explanation: "`need in seen` is the O(1) lookup that makes the whole approach one pass.",
          hints: [{ level: 1, kind: "nudge", text: "Ask the map whether it already holds the complement." }],
        },
      ],
    },
    // ---- TRANSFER -----------------------------------------------------
    {
      id: "ah-10-transfer",
      conceptId: "arrays-hashing",
      order: 10,
      title: "Transfer",
      subtitle: "Same idea, different disguise",
      stage: "TRANSFER",
      activities: [
        {
          id: "ah-10-a1",
          kind: "mcq",
          chunks: ["pattern-recognition"],
          prompt:
            "New problem: are two strings anagrams of each other? Which approach uses the Arrays & Hashing idea — and why does it beat sorting both strings?",
          options: [
            "Count characters in a hash map and compare counts — O(n) vs sorting's O(n log n)",
            "Two pointers from both ends of each string",
            "Binary search each character",
            "Depth-first search over the letters",
          ],
          correctIndex: 0,
          explanation:
            "Anagram = same letter counts. A frequency map compares them in O(n); sorting is O(n log n). No word 'hash' in the prompt — you recognized it from the shape.",
          hints: [{ level: 1, kind: "nudge", text: "What makes two words anagrams, exactly?" }],
        },
      ],
    },
  ],
};
