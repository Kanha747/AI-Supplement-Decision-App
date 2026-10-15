import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewView } from "@/components/review-view";
import { listIngredients, getProduct } from "@/lib/queries";
import { buildCuratedReview } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const record = await getProduct(slug);
  if (!record) return { title: "Product" };
  return { title: `${record.product.brand} ${record.product.name}` };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = await getProduct(slug);
  if (!record) notFound();
  const library = await listIngredients();
  const review = buildCuratedReview(record.product, record.lines, library);
  return <ReviewView review={review} />;
}
