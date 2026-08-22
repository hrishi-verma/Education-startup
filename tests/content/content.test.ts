import { describe, it, expect } from "vitest";
import { concepts, getConcept, getLesson } from "@/lib/content";
import { curriculumNodes } from "@/lib/curriculum";
import { reviewPool } from "@/content/review";
import type { Activity } from "@/lib/types";

// These guard the content-as-data contract (§9, §23): authoring mistakes should
// fail here, not silently break the lesson player at runtime.

describe("content registry", () => {
  it("has at least the two built concepts", () => {
    const ids = concepts.map((c) => c.id);
    expect(ids).toContain("arrays-hashing");
    expect(ids).toContain("two-pointers");
  });

  it("getConcept / getLesson resolve, and miss cleanly", () => {
    expect(getConcept("two-pointers")?.title).toBe("Two Pointers");
    expect(getConcept("nope")).toBeUndefined();
    expect(getLesson("tp-1-see")?.concept.id).toBe("two-pointers");
    expect(getLesson("nope")).toBeUndefined();
  });

  it("every live curriculum node points at a registered concept", () => {
    for (const node of curriculumNodes) {
      if (node.conceptId) {
        expect(getConcept(node.conceptId), `${node.id} → ${node.conceptId}`).toBeDefined();
      }
    }
  });
});

describe.each(concepts.map((c) => [c.id, c] as const))("concept: %s", (_id, concept) => {
  const chunkIds = new Set(concept.chunks.map((c) => c.id));

  it("has unique chunk ids and non-empty signals", () => {
    expect(new Set([...chunkIds]).size).toBe(concept.chunks.length);
    expect(concept.signals && concept.signals.length).toBeGreaterThan(0);
  });

  it("has unique lesson ids and unique orders, all owned by this concept", () => {
    const ids = concept.lessons.map((l) => l.id);
    const orders = concept.lessons.map((l) => l.order);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(orders).size).toBe(orders.length);
    for (const l of concept.lessons) expect(l.conceptId).toBe(concept.id);
  });

  it("every activity references only real chunks and is internally valid", () => {
    for (const lesson of concept.lessons) {
      for (const a of lesson.activities as Activity[]) {
        expect(a.chunks.length, `${a.id} has chunks`).toBeGreaterThan(0);
        for (const cid of a.chunks) {
          expect(chunkIds.has(cid), `${a.id} → chunk ${cid} exists`).toBe(true);
        }
        if (a.kind === "predict" || a.kind === "mcq" || a.kind === "discriminate") {
          expect(a.options.length).toBeGreaterThanOrEqual(2);
          expect(a.correctIndex).toBeGreaterThanOrEqual(0);
          expect(a.correctIndex).toBeLessThan(a.options.length);
        }
        if (a.kind === "ordering" || a.kind === "forward-plan") {
          expect(a.items.length).toBeGreaterThanOrEqual(2);
        }
        if (a.kind === "fill-code") {
          expect(a.template.some((line) => line.includes("___")), `${a.id} has a blank`).toBe(true);
          expect(a.accepted.length).toBeGreaterThan(0);
        }
        if (a.kind === "signals") {
          expect(a.signals.length).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe("interleaved review pool", () => {
  it("is all discriminate items with valid options and chunks", () => {
    expect(reviewPool.length).toBeGreaterThan(0);
    for (const a of reviewPool) {
      expect(a.kind).toBe("discriminate");
      expect(a.options.length).toBeGreaterThanOrEqual(2);
      expect(a.correctIndex).toBeGreaterThanOrEqual(0);
      expect(a.correctIndex).toBeLessThan(a.options.length);
      expect(a.chunks.length).toBeGreaterThan(0);
    }
  });

  it("has unique item ids", () => {
    const ids = reviewPool.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
