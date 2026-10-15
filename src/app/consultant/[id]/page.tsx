import Link from "next/link";
import { notFound } from "next/navigation";
import { AskGuide } from "@/components/ask-guide";
import { GradeMark } from "@/components/grade-mark";
import { SaveButton } from "@/components/save-button";
import { getConsultation } from "@/lib/consultant";
import type { ConsultationResult } from "@/lib/consultant";
import { readSessionId } from "@/lib/session";

export const dynamic = "force-dynamic";

function asResult(value: unknown): ConsultationResult | null {
  if (!value || typeof value !== "object") return null;
  const row = value as ConsultationResult;
  if (!Array.isArray(row.narrative) || !Array.isArray(row.recommendations)) return null;
  return row;
}

export default async function ConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  const sessionId = await readSessionId();
  if (!sessionId || !Number.isFinite(numericId)) notFound();
  const row = await getConsultation(numericId, sessionId);
  const result = asResult(row?.recommendations);
  if (!row || !result) notFound();

  const suggestions = [
    result.recommendations[0] ? `Why ${result.recommendations[0].name}?` : "Why was the list short?",
    result.avoid[0] ? `Why skip ${result.avoid[0].name}?` : "What should I not add?",
    "Is this safe in pregnancy?",
    "How much magnesium?",
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <p className="eyebrow text-copper">Guide note · {result.confidence} confidence · not a diagnosis</p>
      <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{result.headline}</h1>
      <p className="mt-3 text-sm text-muted">{result.modelNote}</p>
      <div className="mt-6 space-y-4">
        {result.narrative.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="text-lg leading-8 text-[#24352d]">{paragraph}</p>
        ))}
      </div>

      <section className="mt-10 space-y-4">
        {result.recommendations.map((item) => (
          <article key={item.slug} className="panel p-5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs uppercase tracking-widest text-copper">{item.tier}</p>
              <GradeMark grade={item.grade} size="sm" />
            </div>
            <h2 className="mt-2 text-3xl">
              <Link href={`/ingredients/${item.slug}`} className="underline decoration-line">{item.name}</Link>
            </h2>
            <p className="mt-2 text-sm text-muted">{item.forGoals.join(" · ")}</p>
            <p className="mt-3 leading-7">{item.why}</p>
            <p className="mt-3 text-sm leading-6"><strong>Dose. </strong>{item.dose}</p>
            <p className="mt-2 text-sm leading-6"><strong>Timing. </strong>{item.timing}</p>
            <p className="mt-2 text-sm leading-6 text-copper">{item.caution}</p>
            <div className="mt-4">
              <SaveButton
                item={{
                  kind: "ingredient",
                  ref: item.slug,
                  title: item.name,
                  subtitle: item.tier,
                  href: `/ingredients/${item.slug}`,
                }}
              />
            </div>
          </article>
        ))}
        {!result.recommendations.length ? (
          <p className="panel p-5 text-sm leading-6">No product was recommended. Use the testing prompts below, or talk with a clinician before adding anything.</p>
        ) : null}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-2xl">Leave these alone</h2>
          <ul className="mt-3 space-y-3 text-sm leading-6">
            {result.avoid.map((item) => (
              <li key={item.slug}>
                <Link href={`/ingredients/${item.slug}`} className="font-semibold underline">{item.name}</Link>
                <p>{item.reason}</p>
              </li>
            ))}
            {!result.avoid.length ? <li>Nothing high-priority was flagged from the context you entered.</li> : null}
          </ul>
        </div>
        <div className="panel p-5">
          <h2 className="text-2xl">Test before you swallow</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            {result.testing.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      </section>

      {result.interactions.length ? (
        <section className="mt-4 rounded-3xl border border-[#f0cfc0] bg-[#fdf4ef] p-5">
          <h2 className="text-2xl">Interaction flags</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            {result.interactions.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </section>
      ) : null}

      {result.products.length ? (
        <section className="mt-8">
          <h2 className="text-2xl">Labels that match the short list</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {result.products.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="panel p-4">
                <p className="text-xs uppercase tracking-widest text-copper">{product.brand}</p>
                <p className="font-display text-2xl">{product.name}</p>
                <p className="mt-2 text-sm text-muted">{product.reason}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8 panel p-5">
        <h2 className="text-2xl">Questions for a clinician</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6">
          {result.questions.map((item) => <li key={item}>• {item}</li>)}
        </ul>
      </section>

      <div className="mt-8">
        <AskGuide consultationId={numericId} suggestions={suggestions} />
      </div>
      <p className="mt-6 text-xs leading-5 text-muted">
        This note was generated for the browser session that requested it. It is educational, incomplete as a medication review, and not a personalized medical recommendation.
      </p>
    </main>
  );
}
