import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Reset DOM + localStorage between tests so mastery state never leaks across
// cases (the store is localStorage-backed).
afterEach(() => {
  cleanup();
  localStorage.clear();
});
