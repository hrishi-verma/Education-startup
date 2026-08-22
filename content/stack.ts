import type { Concept } from "@/lib/types";

// ---------------------------------------------------------------------------
// Stack — uses the new StackViz. 12-step template. Running example: valid
// parentheses — push openers, pop on a closer and check the match. LIFO gives
// O(1) access to the most-recent unmatched bracket.
// ---------------------------------------------------------------------------

export const stack: Concept = {
  id: "stack",
  title: "Stack",
  tagline: "Last-in, first-out: O(1) access to the most recent thing you saw.",
  chunks: [
    { id: "push", label: "Push", description: "Add an item to the top of the stack.", subgoalLabel: "Remember this for later", reusedIn: ["Valid Parentheses", "Min Stack", "Daily Temperatures"] },
    { id: "pop", label: "Pop", description: "Remove and return the top item.", subgoalLabel: "Handle the most recent item", reusedIn: ["Valid Parentheses", "Evaluate RPN"] },
    { id: "peek-top", label: "Peek the top", description: "Look at the top without removing it.", subgoalLabel: "Inspect the most recent item", reusedIn: ["Min Stack", "Monotonic Stack"] },
    { id: "empty-check", label: "Check empty", description: "Guard pops so you never pop an empty stack.", subgoalLabel: "Guard against underflow", reusedIn: ["Valid Parentheses", "Evaluate RPN"] },
    { id: "match-pair", label: "Match a pair", description: "Compare a closer to the popped opener.", subgoalLabel: "Verify the pairing", reusedIn: ["Valid Parentheses"] },
    { id: "forward-planning", label: "Plan the subgoals", description: "Name the plan (push opens → pop+match closes → end empty) first.", subgoalLabel: "Sketch the plan before implementing", reusedIn: ["Every pattern"] },
    { id: "pattern-recognition", label: "Recognize the pattern", description: "Spot 'most recent unmatched / nested / undo' problems.", subgoalLabel: "Match problem signals to the technique", reusedIn: ["Every pattern"] },
  ],
  signals: [
    { trigger: "Matching or balanced pairs, nesting, brackets", pattern: "Push openers, pop on closers" },
    { trigger: "You need the MOST RECENT unmatched / innermost item", pattern: "A stack (LIFO) gives it in O(1)" },
    { trigger: "'Undo', 'backtrack the last step', reverse order", pattern: "Push forward, pop to undo" },
    { trigger: "Next greater / warmer element to the right", pattern: "Monotonic stack" },
  ],
  lessons: [
    {
      id: "st-1-see", conceptId: "stack", order: 1, title: "See the stack", subtitle: "Last in, first out", stage: "SEE",
      activities: [{
        id: "st-1-a1", kind: "info", chunks: ["push", "peek-top"],
        prompt: "A stack grows and shrinks at one end — the top. To validate '([])', we push each opener. The top is always the most recent unmatched bracket.",
        viz: { type: "stack", label: "stack", values: ["(", "["], highlightTop: true, caption: "pushed ( then [ · top is the newest opener" },
      }],
    },
    {
      id: "st-2-predict", conceptId: "stack", order: 2, title: "Predict the pop", subtitle: "Does it match?", stage: "PREDICT",
      activities: [{
        id: "st-2-a1", kind: "predict", chunks: ["pop", "match-pair"],
        prompt: "Input so far: '([' , now we read ']'. The top is '['. What happens?",
        viz: { type: "stack", label: "stack", values: ["(", "["], highlightTop: true, caption: "next char: ]" },
        revealViz: { type: "stack", label: "stack", values: ["("], highlightTop: true, caption: "] matches [ → pop it. Top is now (" },
        options: ["']' matches the top '[' → pop it and continue", "Push ']' onto the stack", "It's invalid — ']' never matches", "Clear the whole stack"],
        correctIndex: 0,
        explanation: "A closer must match the most recent opener — the top. ']' pairs with '[', so we pop and move on. The '(' is still waiting for its ')'.",
        hints: [{ level: 1, kind: "nudge", text: "Which opener is a closer supposed to match — the first or the most recent?" }],
      }],
    },
    {
      id: "st-3-chunks", conceptId: "stack", order: 3, title: "Practice the chunks", subtitle: "Fluency before composition", stage: "PRACTICE CHUNK",
      activities: [
        { id: "st-3-a1", kind: "fill-code", chunks: ["push"], prompt: "Push an opening bracket onto the stack (a Python list).", template: ["stack.___(ch)"], accepted: ["append"], explanation: "`list.append` is push — it adds to the end, which we treat as the top." },
        { id: "st-3-a2", kind: "fill-code", chunks: ["empty-check", "pop"], prompt: "Before popping on a closer, guard against an empty stack.", template: ["if not stack:", "    return ___"], accepted: ["False"], explanation: "A closer with nothing to match means the string is invalid." },
        { id: "st-3-a3", kind: "fill-code", chunks: ["pop"], prompt: "Pop the top opener to compare against the closer.", template: ["top = stack.___()"], accepted: ["pop"], explanation: "`list.pop()` removes and returns the last item — the top." },
      ],
    },
    {
      id: "st-4-signals", conceptId: "stack", order: 4, title: "Read the signals", subtitle: "When to reach for a stack", stage: "SIGNALS",
      activities: [
        { id: "st-4-a1", kind: "signals", chunks: ["pattern-recognition"], prompt: "Learn the triggers that should make 'stack' pop into your head.", signals: [
          { trigger: "Balanced / nested pairs, brackets", pattern: "Push openers, pop on closers" },
          { trigger: "Need the MOST RECENT unmatched item", pattern: "Stack (LIFO), O(1)" },
          { trigger: "Undo / backtrack the last action", pattern: "Push forward, pop to undo" },
          { trigger: "Next greater / warmer to the right", pattern: "Monotonic stack" },
        ] },
        { id: "st-4-a2", kind: "discriminate", chunks: ["pattern-recognition"], prompt: "“For each day, how many days until a warmer temperature?” Which technique?", options: ["Monotonic stack of indices waiting for a warmer day", "Sliding window", "Binary search", "Hash map of temperatures"], correctIndex: 0, explanation: "Each day pops all earlier, colder days it resolves — a decreasing (monotonic) stack. It's the 'most recent unresolved item' signal." },
      ],
    },
    {
      id: "st-5-forward", conceptId: "stack", order: 5, title: "Plan before you code", subtitle: "Forward reasoning", stage: "FORWARD PLAN",
      activities: [{
        id: "st-5-a1", kind: "forward-plan", chunks: ["forward-planning", "pattern-recognition"],
        prompt: "Validate a string of brackets. Arrange the subgoal plan before coding.",
        items: ["Start an empty stack and a closer→opener map", "For each character:", "If it's an opener, push it", "If it's a closer: fail if empty, else pop and check it matches", "At the end, valid only if the stack is empty"],
        explanation: "Push opens, match closes against the top, and require an empty stack at the end (no unclosed openers).",
        hints: [{ level: 2, kind: "direction", text: "Leftover openers at the end mean the string is invalid." }],
      }],
    },
    {
      id: "st-6-combine", conceptId: "stack", order: 6, title: "Order the steps", subtitle: "Compose the loop", stage: "COMBINE",
      activities: [{
        id: "st-6-a1", kind: "ordering", chunks: ["push", "pop", "empty-check", "match-pair"],
        prompt: "Arrange a correct valid-parentheses check.",
        items: ["pairs = {')':'(', ']':'[', '}':'{'}", "stack = []", "for ch in s:", "if ch in '([{': stack.append(ch)", "elif not stack or stack.pop() != pairs[ch]: return False", "return not stack"],
        explanation: "Push openers; on a closer, fail if empty or the popped opener doesn't match; at the end require an empty stack.",
        hints: [{ level: 1, kind: "nudge", text: "The map and the empty stack must exist before the loop." }],
      }],
    },
    {
      id: "st-7-implement", conceptId: "stack", order: 7, title: "Implement it", subtitle: "Write and run real code", stage: "IMPLEMENT",
      activities: [{
        id: "st-7-a1", kind: "code", chunks: ["push", "pop", "empty-check", "match-pair"], language: "python",
        prompt: "Implement is_valid(s): True if the brackets in s are balanced and correctly nested. Run it against the tests.",
        starter: "def is_valid(s):\n    pairs = {')': '(', ']': '[', '}': '{'}\n    stack = []\n    # Push openers; on a closer, pop and check it matches.\n    # Valid only if the stack ends empty.\n    pass\n",
        tests: [
          { call: "is_valid('([])')", expected: "True" },
          { call: "is_valid('([)]')", expected: "False" },
          { call: "is_valid('(')", expected: "False" },
          { call: "is_valid('')", expected: "True" },
          { call: "is_valid('{[]}()')", expected: "True" },
        ],
        hints: [
          { level: 1, kind: "nudge", text: "Openers get pushed; closers pop and compare." },
          { level: 3, kind: "structure", text: "for ch in s: push if opener; else if not stack or stack.pop()!=pairs[ch]: return False. return not stack" },
        ],
      }],
    },
    {
      id: "st-8-transfer", conceptId: "stack", order: 8, title: "Transfer", subtitle: "Same idea, different disguise", stage: "TRANSFER",
      activities: [{
        id: "st-8-a1", kind: "mcq", chunks: ["pattern-recognition"],
        prompt: "“Evaluate a reverse-Polish expression like ['2','1','+','3','*'].” Why is a stack the natural fit?",
        options: ["Operands wait on the stack; an operator pops the two most recent and pushes the result", "Sort the tokens then two-pointer", "Binary search the operators", "Sliding window over the tokens"],
        correctIndex: 0,
        explanation: "An operator always applies to the two most recent operands — exactly LIFO. Push numbers; on an operator, pop two, combine, push back. Same 'most recent' signal, no brackets in sight.",
        hints: [{ level: 1, kind: "nudge", text: "Which operands does an operator act on — the oldest or the newest?" }],
      }],
    },
  ],
};
