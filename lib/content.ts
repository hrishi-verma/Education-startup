import type { Concept, Lesson } from "@/lib/types";
import { arraysHashing } from "@/content/arrays-hashing";
import { twoPointers } from "@/content/two-pointers";
import { slidingWindow } from "@/content/sliding-window";
import { binarySearch } from "@/content/binary-search";
import { stack } from "@/content/stack";

// Content registry. Adding a concept is a data change here — the player, viz
// engine, and mastery system are concept-agnostic (blueprint §9, §23).
export const concepts: Concept[] = [
  arraysHashing,
  twoPointers,
  slidingWindow,
  binarySearch,
  stack,
];

export function getConcept(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}

export function getLesson(id: string): { lesson: Lesson; concept: Concept } | undefined {
  for (const concept of concepts) {
    const lesson = concept.lessons.find((l) => l.id === id);
    if (lesson) return { lesson, concept };
  }
  return undefined;
}

export function getConceptOfLesson(lessonId: string): Concept | undefined {
  return getLesson(lessonId)?.concept;
}
