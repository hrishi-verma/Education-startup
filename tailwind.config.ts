import type { Config } from "tailwindcss";

// Semantic color tokens map to the CSS variables in globals.css, so every
// utility (bg-surface, text-muted, border-line, bg-brand…) is theme-aware and
// AA-contrast by construction. See docs/frontend/design-system.md.
function token(name: string) {
  return `rgb(var(--${name}) / <alpha-value>)`;
}

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        "surface-2": token("surface-2"),
        line: token("line"),
        fg: token("fg"),
        muted: token("muted"),
        faint: token("faint"),
        brand: token("brand"),
        "brand-fg": token("brand-fg"),
        success: token("success"),
        warn: token("warn"),
        danger: token("danger"),
        accent: token("accent"),
        info: token("info"),
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        xl: "var(--radius)",
        "2xl": "calc(var(--radius) + 0.375rem)",
      },
      boxShadow: {
        card: "var(--shadow)",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      maxWidth: {
        content: "56rem",
      },
    },
  },
  plugins: [],
};

export default config;
