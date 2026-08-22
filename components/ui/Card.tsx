import type { ReactNode } from "react";

type Tone = "default" | "brand" | "accent" | "success";

const tones: Record<Tone, string> = {
  default: "border-line bg-surface",
  brand: "border-brand/30 bg-brand/5",
  accent: "border-accent/30 bg-accent/5",
  success: "border-success/40 bg-success/5",
};

export function Card({
  tone = "default",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-2xl border ${tones[tone]} ${className ?? ""}`}>
      {children}
    </div>
  );
}

/** A small labeled section heading used across the app (signaling principle). */
export function SectionHeading({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-3">
      <h3 className="text-lg font-semibold text-fg">{title}</h3>
      {hint && <p className="mt-0.5 text-sm text-faint">{hint}</p>}
    </div>
  );
}
