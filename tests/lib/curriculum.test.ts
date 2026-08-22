import { describe, it, expect } from "vitest";
import {
  curriculumNodes,
  curriculumEdges,
  prerequisitesOf,
  getNode,
} from "@/lib/curriculum";

describe("curriculum graph integrity (§6)", () => {
  it("has unique node ids", () => {
    const ids = curriculumNodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every edge connects two real nodes", () => {
    const ids = new Set(curriculumNodes.map((n) => n.id));
    for (const [from, to] of curriculumEdges) {
      expect(ids.has(from), `edge source ${from} exists`).toBe(true);
      expect(ids.has(to), `edge target ${to} exists`).toBe(true);
    }
  });

  it("has no self-referential edges", () => {
    for (const [from, to] of curriculumEdges) {
      expect(from).not.toBe(to);
    }
  });

  it("has no duplicate edges", () => {
    const keys = curriculumEdges.map(([a, b]) => `${a}->${b}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("prerequisitesOf returns the incoming edges", () => {
    // Two Pointers descends from the root in the roadmap image.
    expect(prerequisitesOf("two-pointers")).toEqual(["arrays-hashing"]);
    // The root itself has no prerequisites.
    expect(prerequisitesOf("arrays-hashing")).toEqual([]);
  });

  it("getNode resolves known ids and returns undefined otherwise", () => {
    expect(getNode("arrays-hashing")?.label).toBe("Arrays & Hashing");
    expect(getNode("does-not-exist")).toBeUndefined();
  });

  it("the prerequisite graph is acyclic", () => {
    // Kahn's algorithm: if we can topologically drain the graph, it's a DAG.
    const indeg = new Map<string, number>();
    for (const n of curriculumNodes) indeg.set(n.id, 0);
    for (const [, to] of curriculumEdges) indeg.set(to, (indeg.get(to) ?? 0) + 1);
    const queue = [...indeg.entries()].filter(([, d]) => d === 0).map(([id]) => id);
    let removed = 0;
    while (queue.length) {
      const id = queue.shift()!;
      removed++;
      for (const [from, to] of curriculumEdges) {
        if (from === id) {
          indeg.set(to, indeg.get(to)! - 1);
          if (indeg.get(to) === 0) queue.push(to);
        }
      }
    }
    expect(removed).toBe(curriculumNodes.length);
  });
});
