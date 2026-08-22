"use client";

import { useMemo, useState } from "react";
import type { Activity, VizState } from "@/lib/types";
import VizRenderer from "@/components/viz/VizRenderer";
import HintPanel from "@/components/HintPanel";
import SignalsPanel from "@/components/SignalsPanel";
import CodeRunner from "@/components/CodeRunner";
import { Button } from "@/components/ui/Button";

export interface AttemptResult {
  correct: boolean;
  hintsUsed: number;
}

function normalizeCode(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}

// One generic activity renderer for every question type in blueprint §7.
// Reports the first graded attempt via onAnswered; onContinue advances the
// lesson. Info + signals steps are ungraded (they only teach).
export default function ActivityView({
  activity,
  onAnswered,
  onContinue,
}: {
  activity: Activity;
  onAnswered: (r: AttemptResult) => void;
  onContinue: () => void;
}) {
  const [revealed, setRevealed] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  const [choice, setChoice] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const shuffledStart = useMemo(() => {
    if (activity.kind !== "ordering" && activity.kind !== "forward-plan") return [];
    return activity.items
      .map((v, i) => ({ v, i }))
      .sort((a, b) => ((a.i * 7 + 3) % activity.items.length) - ((b.i * 7 + 3) % activity.items.length))
      .map((x) => x.v);
  }, [activity]);
  const [order, setOrder] = useState<string[]>(shuffledStart);

  function grade(isCorrect: boolean) {
    setCorrect(isCorrect);
    setAnswered(true);
    onAnswered({ correct: isCorrect, hintsUsed: revealed });
  }

  function move(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[idx], next[j]] = [next[j], next[idx]];
    setOrder(next);
  }

  const activeViz: VizState | undefined =
    (activity.kind === "predict" && answered && activity.revealViz) ||
    ("viz" in activity ? activity.viz : undefined);

  return (
    <div>
      <p className="text-lg leading-relaxed text-fg">{activity.prompt}</p>

      {activeViz && (
        <div className="my-6 rounded-2xl border border-line bg-surface-2/60 p-5">
          <VizRenderer state={activeViz} />
        </div>
      )}

      {/* ---- INFO ---- */}
      {activity.kind === "info" && (
        <Button className="mt-5" onClick={onContinue}>
          Got it →
        </Button>
      )}

      {/* ---- CODE (real execution in a sandbox) ---- */}
      {activity.kind === "code" && (
        <CodeRunner activity={activity} onAnswered={onAnswered} onContinue={onContinue} />
      )}

      {/* ---- SIGNALS (ungraded recognition cues) ---- */}
      {activity.kind === "signals" && (
        <div className="mt-5">
          <SignalsPanel signals={activity.signals} />
          <Button className="mt-6" onClick={onContinue}>
            Got it →
          </Button>
        </div>
      )}

      {/* ---- PREDICT / MCQ / DISCRIMINATE ---- */}
      {(activity.kind === "predict" ||
        activity.kind === "mcq" ||
        activity.kind === "discriminate") && (
        <div className="mt-5 space-y-2.5">
          {activity.options.map((opt, i) => {
            const isCorrectOpt = i === activity.correctIndex;
            const chosen = choice === i;
            let cls = "border-line bg-surface hover:border-muted";
            if (answered && isCorrectOpt) cls = "border-success bg-success/10";
            else if (answered && chosen) cls = "border-danger bg-danger/10";
            else if (chosen) cls = "border-brand bg-brand/10";
            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => setChoice(i)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-fg transition ${cls}`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
                    chosen || (answered && isCorrectOpt)
                      ? "border-transparent bg-brand text-brand-fg"
                      : "border-line text-faint"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
          {!answered && (
            <Button
              className="mt-1"
              disabled={choice === null}
              onClick={() => grade(choice === activity.correctIndex)}
            >
              Commit
            </Button>
          )}
        </div>
      )}

      {/* ---- ORDERING / FORWARD-PLAN ---- */}
      {(activity.kind === "ordering" || activity.kind === "forward-plan") && (
        <div className="mt-5 space-y-2">
          <ol className="space-y-2">
            {order.map((item, i) => {
              const rightHere = answered && activity.items[i] === item;
              return (
                <li
                  key={item}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                    answered
                      ? rightHere
                        ? "border-success bg-success/10"
                        : "border-danger bg-danger/10"
                      : "border-line bg-surface"
                  }`}
                >
                  <span className="w-5 text-center text-faint tabular-nums">{i + 1}</span>
                  <span className="flex-1 text-fg">{item}</span>
                  {!answered && (
                    <span className="flex gap-1">
                      <button
                        type="button"
                        aria-label="Move up"
                        onClick={() => move(i, -1)}
                        className="rounded-lg bg-surface-2 px-2 py-1 text-muted hover:text-fg"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        onClick={() => move(i, 1)}
                        className="rounded-lg bg-surface-2 px-2 py-1 text-muted hover:text-fg"
                      >
                        ↓
                      </button>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          {!answered && (
            <Button
              className="mt-1"
              onClick={() => grade(order.every((v, i) => v === activity.items[i]))}
            >
              {activity.kind === "forward-plan" ? "Check plan" : "Check order"}
            </Button>
          )}
        </div>
      )}

      {/* ---- FILL-CODE ---- */}
      {activity.kind === "fill-code" && (
        <div className="mt-5">
          <pre className="overflow-x-auto rounded-xl border border-line bg-surface-2 p-4 font-mono text-sm leading-7 text-fg">
            {activity.template.map((line, i) => {
              if (!line.includes("___")) {
                return <div key={i}>{line || " "}</div>;
              }
              const [pre, post] = line.split("___");
              return (
                <div key={i} className="flex flex-wrap items-center">
                  <span className="whitespace-pre">{pre}</span>
                  <input
                    value={code}
                    disabled={answered}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && code.trim() && !answered) {
                        grade(activity.accepted.some((a) => normalizeCode(a) === normalizeCode(code)));
                      }
                    }}
                    placeholder="type here"
                    className={`mx-1 w-40 rounded-md border bg-surface px-2 py-0.5 font-mono text-sm outline-none ${
                      answered
                        ? correct
                          ? "border-success text-success"
                          : "border-danger text-danger"
                        : "border-brand text-fg focus:border-brand"
                    }`}
                  />
                  <span className="whitespace-pre">{post}</span>
                </div>
              );
            })}
          </pre>
          {!answered && (
            <Button
              className="mt-4"
              disabled={!code.trim()}
              onClick={() => grade(activity.accepted.some((a) => normalizeCode(a) === normalizeCode(code)))}
            >
              Run check
            </Button>
          )}
          {answered && !correct && (
            <p className="mt-2 font-mono text-sm text-muted">
              Accepted answer: <span className="text-success">{activity.accepted[0]}</span>
            </p>
          )}
        </div>
      )}

      {/* progressive hints (not on info/signals/code — those handle their own) */}
      {activity.kind !== "info" &&
        activity.kind !== "signals" &&
        activity.kind !== "code" &&
        !answered && (
          <HintPanel
            hints={activity.hints ?? []}
            revealed={revealed}
            onReveal={() => setRevealed((r) => r + 1)}
          />
        )}

      {/* feedback + continue */}
      {answered && activity.kind !== "info" && activity.kind !== "signals" && (
        <div className="mt-6">
          <div
            className={`rounded-xl border px-4 py-3 ${
              correct
                ? "border-success/40 bg-success/10 text-fg"
                : "border-danger/40 bg-danger/10 text-fg"
            }`}
          >
            <p className={`font-semibold ${correct ? "text-success" : "text-danger"}`}>
              {correct ? "Correct" : "Not quite"}
            </p>
            {activity.explanation && (
              <p className="mt-1 text-sm text-muted">{activity.explanation}</p>
            )}
          </div>
          <Button className="mt-4" onClick={onContinue}>
            Continue →
          </Button>
        </div>
      )}
    </div>
  );
}
