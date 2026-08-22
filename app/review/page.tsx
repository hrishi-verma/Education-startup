import Link from "next/link";
import ReviewPlayer from "@/components/ReviewPlayer";
import { reviewPool } from "@/content/review";

export default function ReviewPage() {
  return (
    <div>
      <Link href="/" className="text-sm text-muted hover:text-fg">
        ← Roadmap
      </Link>
      <div className="mt-3 mb-6">
        <h1 className="text-2xl font-bold text-fg">Mixed review</h1>
        <p className="text-muted">
          No topic labels — decide which technique each problem needs. This is where pattern
          recognition actually gets built.
        </p>
      </div>
      <ReviewPlayer pool={reviewPool} />
    </div>
  );
}
