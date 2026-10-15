import type { Metadata } from "next";
import Link from "next/link";
import { ReviewView } from "@/components/review-view";
import { getDsldLabel } from "@/lib/dsld";
import { listIngredients } from "@/lib/queries";
import { buildLabelReview } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `NIH label ${id}` };
}

export default async function LabelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return <Missing id={id} />;
  }
  let review: ReturnType<typeof buildLabelReview> | null = null;
  try {
    const [label, library] = await Promise.all([getDsldLabel(id), listIngredients()]);
    review = buildLabelReview(label, library, id);
  } catch {
    review = null;
  }
  if (!review) {
    return <Missing id={id} />;
  }
  return <ReviewView review={review} />;
}

function Missing({ id }: { id: string }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="eyebrow text-copper">Label unavailable</p>
      <h1 className="mt-2 text-4xl">NIH did not return label {id}.</h1>
      <p className="mt-3 text-[#3d4f46]">The database may be busy, or the id is not a DSLD label. Search by name, or try a curated demo barcode.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/search" className="btn btn-primary">Search</Link>
        <Link href="/scan" className="btn btn-ghost">Scan</Link>
      </div>
    </main>
  );
}
