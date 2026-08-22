import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Code execution proxy (blueprint §20, §36). Student code is UNTRUSTED, so we
// never run it on our own server — we forward to an isolated sandbox that
// enforces CPU/memory/time limits and process isolation. This route only
// builds a test harness around the submission and relays the result.
//
// Sandbox: Wandbox (keyless public API). We originally targeted Piston, but its
// public instance became whitelist-only on 2026-02-15. Wandbox is a drop-in
// keyless alternative for the MVP; swap for a self-hosted Piston/Judge0 (with
// auth + rate limits) before production — see docs/backend/architecture.md.
//
// MVP scope: single language (Python), no auth/rate-limit yet.
// ---------------------------------------------------------------------------

const WANDBOX_URL = "https://wandbox.org/api/compile.json";
const PYTHON_COMPILER = "cpython-3.10.15";

interface TestCase {
  call: string;
  expected: string;
}

// Wrap the submission in a harness that evaluates each test call and prints a
// tab-separated PASS/FAIL line, then a SUMMARY line the client parses.
function buildProgram(source: string, tests: TestCase[]): string {
  const cases = JSON.stringify(tests.map((t) => [t.call, t.expected]));
  return `${source}

__CASES = ${cases}
__passed = 0
for __call, __expected in __CASES:
    try:
        __got = repr(eval(__call))
    except Exception as __e:
        __got = "ERROR: " + repr(__e)
    __ok = __got == __expected
    if __ok:
        __passed += 1
    print(("PASS" if __ok else "FAIL") + "\\t" + __call + "\\t" + __got + ("" if __ok else "  (want " + __expected + ")"))
print("SUMMARY\\t" + str(__passed) + "\\t" + str(len(__CASES)))
`;
}

export async function POST(req: NextRequest) {
  let body: { source?: string; tests?: TestCase[]; language?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { source, tests } = body;
  if (typeof source !== "string" || !Array.isArray(tests) || tests.length === 0) {
    return NextResponse.json({ error: "source and tests are required" }, { status: 400 });
  }

  const program = buildProgram(source, tests);

  let sandboxRes: Response;
  try {
    sandboxRes = await fetch(WANDBOX_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ compiler: PYTHON_COMPILER, code: program, stdin: "" }),
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the code sandbox." }, { status: 502 });
  }

  if (!sandboxRes.ok) {
    return NextResponse.json(
      { error: `Sandbox error (${sandboxRes.status}).` },
      { status: 502 },
    );
  }

  const data = (await sandboxRes.json()) as {
    program_output?: string;
    program_error?: string;
    compiler_error?: string;
  };
  const stdout = data.program_output ?? "";
  // Prefer the program's stderr; fall back to compile-time errors (syntax).
  const stderr = (data.program_error || data.compiler_error) ?? "";

  // Parse the harness output.
  const lines = stdout.split("\n").filter(Boolean);
  const summary = lines.find((l) => l.startsWith("SUMMARY"));
  let passed = 0;
  let total = tests.length;
  if (summary) {
    const parts = summary.split("\t");
    passed = Number(parts[1]) || 0;
    total = Number(parts[2]) || tests.length;
  }
  const results = lines
    .filter((l) => l.startsWith("PASS") || l.startsWith("FAIL"))
    .map((l) => {
      const [status, call, ...rest] = l.split("\t");
      return { pass: status === "PASS", call, detail: rest.join("\t") };
    });

  return NextResponse.json({
    passed,
    total,
    allPassed: total > 0 && passed === total,
    results,
    stderr: stderr.trim(),
  });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
