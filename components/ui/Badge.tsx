import type { ReactNode } from "react";

type Tone = "neutral" | "brand" | "accent" | "success" | "warn";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted",
  brand: "bg-brand/15 text-brand",
  accent: "bg-accent/15 text-accent",
  success: "bg-success/15 text-success",
  warn: "bg-warn/15 text-warn",
};

/** Small pill for stage labels, tags, statuses (signaling cue). */
export function Badge({
  tone = "neutral",
  mono = false,
  className,
  children,
}: {
  tone?: Tone;
  mono?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        mono ? "font-mono" : ""
      } ${tones[tone]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
