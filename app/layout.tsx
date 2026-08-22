import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ThemeToggle, themeInitScript } from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "Chunk — Visual Coding Mastery",
  description:
    "Learn to think, decompose, and recognize patterns — chunk by chunk. A visual, chunk-based coding education platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur">
          <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-fg">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-brand-fg">
                ◧
              </span>
              Chunk
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/"
                className="rounded-lg px-3 py-1.5 text-sm text-muted transition hover:bg-surface-2 hover:text-fg"
              >
                Roadmap
              </Link>
              <Link
                href="/review"
                className="rounded-lg px-3 py-1.5 text-sm text-muted transition hover:bg-surface-2 hover:text-fg"
              >
                Review
              </Link>
              <span className="mx-1 h-5 w-px bg-line" />
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-content px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
