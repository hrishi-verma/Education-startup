"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

// Small light/dark/system control. Persists to localStorage and stamps
// data-theme on <html>; the tokens in globals.css do the rest. Accessibility
// (blueprint §35): adjustable presentation, keyboard-operable.
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) ?? "system";
    setTheme(saved);
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    const root = document.documentElement;
    if (next === "system") {
      root.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    } else {
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    }
  }

  const order: Theme[] = ["system", "light", "dark"];
  const icon = { system: "🖥", light: "☀", dark: "☾" } as const;

  return (
    <button
      type="button"
      onClick={() => apply(order[(order.indexOf(theme) + 1) % order.length])}
      aria-label={`Theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-fg transition hover:border-muted"
    >
      <span aria-hidden>{icon[theme]}</span>
    </button>
  );
}

/** Inline script (no external deps) that sets the theme before paint (no FOUC). */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
