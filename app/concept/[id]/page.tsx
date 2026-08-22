import Link from "next/link";
import { notFound } from "next/navigation";
import { concepts, getConcept } from "@/lib/content";
import Dashboard from "@/components/Dashboard";

export function generateStaticParams() {
  return concepts.map((c) => ({ id: c.id }));
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concept = getConcept(id);
  if (!concept) notFound();

  return (
    <div>
      <Link href="/" className="text-sm text-muted hover:text-fg">
        ← Roadmap
      </Link>
      <div className="mt-3">
        <Dashboard concept={concept} />
      </div>
    </div>
  );
}
