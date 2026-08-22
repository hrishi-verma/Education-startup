import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SignalsPanel from "@/components/SignalsPanel";

describe("SignalsPanel", () => {
  it("renders each trigger → pattern cue", () => {
    render(
      <SignalsPanel
        signals={[
          { trigger: "The array is sorted", pattern: "Two-pointer sweep" },
          { trigger: "Need counts", pattern: "Hash map" },
        ]}
      />,
    );
    expect(screen.getByText("The array is sorted")).toBeInTheDocument();
    expect(screen.getByText("Two-pointer sweep")).toBeInTheDocument();
    expect(screen.getByText("Need counts")).toBeInTheDocument();
    expect(screen.getByText("Hash map")).toBeInTheDocument();
  });
});
