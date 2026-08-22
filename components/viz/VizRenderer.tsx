"use client";

import type { VizState } from "@/lib/types";
import ArrayViz from "./ArrayViz";
import HashViz from "./HashViz";
import StackViz from "./StackViz";

// Dispatches a VizState to the right renderer (blueprint §9). Adding a new
// visual kind = a new case here; nothing else in the player changes.
export default function VizRenderer({ state }: { state: VizState }) {
  switch (state.type) {
    case "array":
      return <ArrayViz state={state} />;
    case "hashmap":
      return <HashViz state={state} />;
    case "stack":
      return <StackViz state={state} />;
    default:
      return null;
  }
}
