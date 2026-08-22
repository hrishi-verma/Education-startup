// ---------------------------------------------------------------------------
// The curriculum graph (blueprint §6 Learning Graph, §41 Product Moat).
// This is the prerequisite DAG the whole platform is organized around — the
// NeetCode-style roadmap. Topics unlock as their prerequisites are mastered.
//
// Only concepts with `conceptId` set are actually BUILT (playable). The rest
// are placeholders so the graph is complete and ready to grow into — adding a
// topic later = author its content + flip it to a real conceptId.
//
// Coordinates are a hand-laid layout matching the roadmap image; the map
// renderer positions nodes absolutely and draws curved edges between them.
// ---------------------------------------------------------------------------

export interface CurriculumNode {
  id: string;
  label: string;
  /** Set when a real, playable concept exists in the content registry. */
  conceptId?: string;
  /** Layout position on the map canvas (see CANVAS_W/H). */
  x: number;
  y: number;
}

export const CANVAS_W = 1320;
export const CANVAS_H = 1180;

export const curriculumNodes: CurriculumNode[] = [
  { id: "arrays-hashing", label: "Arrays & Hashing", conceptId: "arrays-hashing", x: 590, y: 40 },
  { id: "two-pointers", label: "Two Pointers", conceptId: "two-pointers", x: 440, y: 180 },
  { id: "stack", label: "Stack", conceptId: "stack", x: 780, y: 180 },
  { id: "binary-search", label: "Binary Search", conceptId: "binary-search", x: 300, y: 330 },
  { id: "sliding-window", label: "Sliding Window", conceptId: "sliding-window", x: 520, y: 330 },
  { id: "linked-list", label: "Linked List", x: 740, y: 330 },
  { id: "trees", label: "Trees", x: 520, y: 470 },
  { id: "tries", label: "Tries", x: 320, y: 600 },
  { id: "backtracking", label: "Backtracking", x: 740, y: 600 },
  { id: "heap-priority-queue", label: "Heap / Priority Queue", x: 470, y: 730 },
  { id: "graphs", label: "Graphs", x: 720, y: 740 },
  { id: "one-d-dp", label: "1-D Dynamic Programming", x: 960, y: 730 },
  { id: "intervals", label: "Intervals", x: 170, y: 870 },
  { id: "greedy", label: "Greedy", x: 400, y: 900 },
  { id: "advanced-graphs", label: "Advanced Graphs", x: 610, y: 890 },
  { id: "two-d-dp", label: "2-D Dynamic Programming", x: 830, y: 910 },
  { id: "bit-manipulation", label: "Bit Manipulation", x: 1060, y: 890 },
  { id: "math-geometry", label: "Math & Geometry", x: 950, y: 1050 },
];

/** Directed prerequisite edges: [prerequisite, unlocks]. */
export const curriculumEdges: [string, string][] = [
  ["arrays-hashing", "two-pointers"],
  ["arrays-hashing", "stack"],
  ["two-pointers", "binary-search"],
  ["two-pointers", "sliding-window"],
  ["two-pointers", "linked-list"],
  ["binary-search", "trees"],
  ["sliding-window", "trees"],
  ["linked-list", "trees"],
  ["trees", "tries"],
  ["trees", "backtracking"],
  ["trees", "heap-priority-queue"],
  ["backtracking", "graphs"],
  ["backtracking", "one-d-dp"],
  ["heap-priority-queue", "intervals"],
  ["heap-priority-queue", "greedy"],
  ["heap-priority-queue", "advanced-graphs"],
  ["graphs", "advanced-graphs"],
  ["graphs", "two-d-dp"],
  ["one-d-dp", "two-d-dp"],
  ["one-d-dp", "bit-manipulation"],
  ["two-d-dp", "math-geometry"],
  ["bit-manipulation", "math-geometry"],
];

export function prerequisitesOf(nodeId: string): string[] {
  return curriculumEdges.filter(([, to]) => to === nodeId).map(([from]) => from);
}

export function getNode(id: string): CurriculumNode | undefined {
  return curriculumNodes.find((n) => n.id === id);
}
