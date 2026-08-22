import Link from "next/link";
import { notFound } from "next/navigation";
import { concepts, getLesson } from "@/lib/content";
import LessonPlayer from "@/components/LessonPlayer";
import { Badge } from "@/components/ui/Badge";

// Pre-render every lesson route from the content registry (static, no DB).
export function generateStaticParams() {
  return concepts.flatMap((c) => c.lessons.map((l) => ({ id: l.id })));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const found = getLesson(id);
  if (!found) notFound();
  const { lesson, concept } = found;

  // Sequential position in the topic's journey (lesson 1..n), so the player can
  // hand off straight to the next lesson instead of bouncing to the dashboard.
  const ordered = [...concept.lessons].sort((a, b) => a.order - b.order);
  const pos = ordered.findIndex((l) => l.id === lesson.id);
  const prev = pos > 0 ? ordered[pos - 1] : null;
  const next = pos < ordered.length - 1 ? ordered[pos + 1] : null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link href={`/concept/${concept.id}`} className="text-sm text-muted hover:text-fg">
          ← {concept.title}
        </Link>
        <span className="text-sm tabular-nums text-faint">
          Lesson {pos + 1} of {ordered.length}
        </span>
      </div>

      <div className="mt-3 mb-6 flex items-center gap-3">
        <Badge tone="brand" mono>
          {lesson.stage}
        </Badge>
        <h1 className="text-2xl font-bold leading-tight text-fg">{lesson.title}</h1>
      </div>

      <LessonPlayer
        lesson={lesson}
        conceptId={concept.id}
        prev={prev ? { id: prev.id, title: prev.title } : null}
        next={next ? { id: next.id, title: next.title } : null}
      />
    </div>
  );
}
