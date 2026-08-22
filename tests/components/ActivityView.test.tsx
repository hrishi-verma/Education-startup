import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActivityView from "@/components/ActivityView";
import type { ChoiceActivity, FillCodeActivity, InfoActivity } from "@/lib/types";

const mcq: ChoiceActivity = {
  id: "t-mcq",
  kind: "mcq",
  chunks: ["c1"],
  prompt: "Pick the right one",
  options: ["Wrong", "Right", "Also wrong"],
  correctIndex: 1,
  explanation: "Because reasons.",
};

const fill: FillCodeActivity = {
  id: "t-fill",
  kind: "fill-code",
  chunks: ["c1"],
  prompt: "Fill it",
  template: ["x = ___"],
  accepted: ["1"],
};

const info: InfoActivity = {
  id: "t-info",
  kind: "info",
  chunks: [],
  prompt: "Just read this",
};

describe("ActivityView — MCQ", () => {
  it("grades a correct choice and advances", async () => {
    const user = userEvent.setup();
    const onAnswered = vi.fn();
    const onContinue = vi.fn();
    render(<ActivityView activity={mcq} onAnswered={onAnswered} onContinue={onContinue} />);

    await user.click(screen.getByRole("button", { name: /Right/ }));
    await user.click(screen.getByRole("button", { name: "Commit" }));

    expect(onAnswered).toHaveBeenCalledWith({ correct: true, hintsUsed: 0 });
    expect(screen.getByText("Correct")).toBeInTheDocument();
    expect(screen.getByText("Because reasons.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Continue/ }));
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it("marks a wrong choice incorrect", async () => {
    const user = userEvent.setup();
    const onAnswered = vi.fn();
    render(<ActivityView activity={mcq} onAnswered={onAnswered} onContinue={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /Wrong$/ }));
    await user.click(screen.getByRole("button", { name: "Commit" }));

    expect(onAnswered).toHaveBeenCalledWith({ correct: false, hintsUsed: 0 });
    expect(screen.getByText("Not quite")).toBeInTheDocument();
  });
});

describe("ActivityView — fill-code", () => {
  it("accepts a normalized correct answer", async () => {
    const user = userEvent.setup();
    const onAnswered = vi.fn();
    render(<ActivityView activity={fill} onAnswered={onAnswered} onContinue={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("type here"), " 1 "); // normalized to "1"
    await user.click(screen.getByRole("button", { name: "Run check" }));

    expect(onAnswered).toHaveBeenCalledWith({ correct: true, hintsUsed: 0 });
  });

  it("rejects a wrong answer and reveals the accepted one", async () => {
    const user = userEvent.setup();
    const onAnswered = vi.fn();
    render(<ActivityView activity={fill} onAnswered={onAnswered} onContinue={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("type here"), "99");
    await user.click(screen.getByRole("button", { name: "Run check" }));

    expect(onAnswered).toHaveBeenCalledWith({ correct: false, hintsUsed: 0 });
    expect(screen.getByText("1")).toBeInTheDocument(); // accepted answer shown
  });
});

describe("ActivityView — info", () => {
  it("is ungraded: continuing does not call onAnswered", async () => {
    const user = userEvent.setup();
    const onAnswered = vi.fn();
    const onContinue = vi.fn();
    render(<ActivityView activity={info} onAnswered={onAnswered} onContinue={onContinue} />);

    await user.click(screen.getByRole("button", { name: /Got it/ }));
    expect(onContinue).toHaveBeenCalledOnce();
    expect(onAnswered).not.toHaveBeenCalled();
  });
});
