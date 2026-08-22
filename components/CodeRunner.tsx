"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { CodeActivity } from "@/lib/types";
import type { AttemptResult } from "@/components/ActivityView";
import HintPanel from "@/components/HintPanel";
import { Button } from "@/components/ui/Button";

// Monaco is heavy and browser-only — load it client-side with a placeholder so
// it never runs during SSR.
const MonacoEditor = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="grid h-[280px] place-items-center rounded-xl border border-line bg-surface-2 text-sm text-muted">
      Loading editor…
    </div>
  ),
});

interface RunResult {
  passed: number;
  total: number;
  allPassed: boolean;
  results: { pass: boolean; call: string; detail: string }[];
  stderr?: string;
  error?: string;
}

// Full coding challenge (blueprint §7, §20). Student writes real Python in
// Monaco; Run posts to /api/execute, which runs it in the Piston sandbox
// against the activity's tests. Each run is a graded attempt.
export default function CodeRunner({
  activity,
  onAnswered,
  onContinue,
}: {
  activity: CodeActivity;
  onAnswered: (r: AttemptResult) => void;
  onContinue: () => void;
}) {
  const [code, setCode] = useState(activity.starter);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [revealed, setRevealed] = useState(0);

  async function run() {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: activity.language, source: code, tests: activity.tests }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ passed: 0, total: activity.tests.length, allPassed: false, results: [], error: data.error ?? "Execution failed." });
      } else {
        setResult(data as RunResult);
        onAnswered({ correct: !!data.allPassed, hintsUsed: revealed });
      }
    } catch {
      setResult({ passed: 0, total: activity.tests.length, allPassed: false, results: [], error: "Network error reaching the sandbox." });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="mt-5">
      <div className="overflow-hidden rounded-xl border border-line">
        <MonacoEditor
          height="280px"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            tabSize: 4,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Button onClick={run} disabled={running}>
          {running ? "Running…" : "Run tests"}
        </Button>
        <span className="text-sm text-faint">Runs in an isolated sandbox.</span>
      </div>

      {!result && (
        <HintPanel hints={activity.hints ?? []} revealed={revealed} onReveal={() => setRevealed((r) => r + 1)} />
      )}

      {result && (
        <div className="mt-4">
          {result.error ? (
            <div className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-fg">
              {result.error}
            </div>
          ) : (
            <>
              <div
                className={`rounded-xl border px-4 py-3 ${
                  result.allPassed ? "border-success/40 bg-success/10" : "border-danger/40 bg-danger/10"
                }`}
              >
                <p className={`font-semibold ${result.allPassed ? "text-success" : "text-danger"}`}>
                  {result.allPassed ? "All tests passed" : `${result.passed} / ${result.total} tests passed`}
                </p>
              </div>
              <ul className="mt-2 space-y-1">
                {result.results.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 font-mono text-xs">
                    <span className={r.pass ? "text-success" : "text-danger"}>{r.pass ? "✓" : "✗"}</span>
                    <span className="text-muted">
                      {r.call} <span className="text-faint">→ {r.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
              {result.stderr && (
                <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-surface-2 p-3 font-mono text-xs text-danger">
                  {result.stderr}
                </pre>
              )}
            </>
          )}

          <div className="mt-4 flex items-center gap-3">
            <Button variant="secondary" onClick={run} disabled={running}>
              Run again
            </Button>
            {result.allPassed && (
              <Button onClick={onContinue}>Continue →</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
