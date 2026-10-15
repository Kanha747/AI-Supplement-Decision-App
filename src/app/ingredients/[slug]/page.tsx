import Link from "next/link";
import { notFound } from "next/navigation";
import { CompareToggle } from "@/components/compare-controls";
import { GradeMark } from "@/components/grade-mark";
import { SaveButton } from "@/components/save-button";
import { goalById } from "@/data/goals";
import { gradeMeaning } from "@/lib/format";
import { getIngredient, productsForIngredient } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function IngredientPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ingredient = await getIngredient(slug);
  if (!ingredient) notFound();
  const related = await productsForIngredient(slug);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <p className="eyebrow text-copper">{ingredient.category}</p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl leading-tight md:text-6xl">{ingredient.name}</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-[#3d4f46]">{ingredient.summary}</p>
        </div>
        <GradeMark grade={ingredient.evidenceGrade} />
      </div>
      <p className="mt-3 text-sm text-muted">{gradeMeaning(ingredient.evidenceGrade)} Primary use: {ingredient.primaryUse}.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <SaveButton
          item={{
            kind: "ingredient",
            ref: ingredient.slug,
            title: ingredient.name,
            subtitle: ingredient.category,
            href: `/ingredients/${ingredient.slug}`,
          }}
          tone="primary"
        />
        <CompareToggle slug={ingredient.slug} name={ingredient.name} />
        <Link href="/consultant" className="btn btn-ghost text-sm">Ask the guide</Link>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Meter label="Effectiveness for the primary use" value={ingredient.effectiveness} />
        <Meter label="Safety margin in ordinary adults" value={ingredient.safety} />
        <div className="panel p-5">
          <p className="eyebrow text-muted">Also called</p>
          <p className="mt-2 text-sm leading-6">{ingredient.aliases.join(", ")}</p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-6">
          <h2 className="text-3xl">What it is doing</h2>
          <p className="mt-3 leading-7 text-[#3d4f46]">{ingredient.mechanism}</p>
          <h3 className="mt-6 text-xl">Forms</h3>
          <ul className="mt-3 space-y-3">
            {ingredient.forms.map((form) => (
              <li key={form.name}>
                <p className="font-semibold">{form.name}</p>
                <p className="text-sm leading-6 text-[#3d4f46]">{form.note}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="ink-panel rounded-[1.4rem] p-6">
          <p className="eyebrow text-[#e7c7a4]">Dose</p>
          <p className="mt-3 text-lg leading-8">{ingredient.typicalDose}</p>
          <p className="mt-4 text-sm leading-6 text-[#d5e0d8]">{ingredient.upperLimit}</p>
          <p className="mt-4 text-sm leading-6 text-[#e7c7a4]">{ingredient.timing}</p>
          {ingredient.testFirst ? <p className="mt-4 text-sm">Test first. A lab is more informative than a head start.</p> : null}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-3xl">Outcomes, not slogans</h2>
        <div className="mt-4 overflow-hidden rounded-3xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f3ece2] text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Goal</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Reading</th>
              </tr>
            </thead>
            <tbody>
              {ingredient.outcomes.map((outcome) => (
                <tr key={`${outcome.goal}-${outcome.grade}`} className="border-t border-line align-top">
                  <td className="px-4 py-4 font-medium">{goalById[outcome.goal]?.name ?? outcome.goal}</td>
                  <td className="px-4 py-4"><GradeMark grade={outcome.grade} size="sm" /></td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{outcome.effect}</p>
                    <p className="mt-1 text-[#3d4f46]">{outcome.detail}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="panel p-6">
          <h2 className="text-2xl">Cautions</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            {ingredient.cautions.map((item) => <li key={item}>• {item}</li>)}
          </ul>
          <h3 className="mt-5 text-lg">Who should avoid it</h3>
          <ul className="mt-2 space-y-2 text-sm leading-6">
            {ingredient.whoShouldAvoid.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
        <div className="panel p-6">
          <h2 className="text-2xl">Interactions</h2>
          <ul className="mt-3 space-y-3">
            {ingredient.interactions.map((item) => (
              <li key={item.with} className="rounded-2xl border border-line p-3">
                <p className="text-xs uppercase tracking-widest text-copper">{item.severity} · {item.with}</p>
                <p className="mt-1 text-sm leading-6">{item.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-3xl">Key studies</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {ingredient.keyStudies.map((study) => (
            <article key={study.title} className="panel p-5">
              <p className="text-xs uppercase tracking-widest text-muted">{study.year} · {study.design}</p>
              <h3 className="mt-2 text-2xl">{study.title}</h3>
              <p className="mt-2 text-sm leading-6">{study.finding}</p>
              <p className="mt-3 text-xs text-muted">{study.citation}</p>
            </article>
          ))}
        </div>
      </section>

      {related.length ? (
        <section className="mt-10">
          <h2 className="text-3xl">Labels that contain it</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {related.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="panel p-4">
                <p className="text-xs uppercase tracking-widest text-copper">{product.brand}</p>
                <p className="font-display text-2xl">{product.name}</p>
                <p className="text-sm text-muted">UPC {product.barcode}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="text-2xl">Sources</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {ingredient.sources.map((source) => (
            <li key={source.url}>
              <a className="underline" href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-5 text-muted">
          Educational summary for decision support. It is not medical advice, not a complete interaction check, and not a substitute for a clinician who knows your chart.
        </p>
      </section>
    </main>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-4xl">{value}</p>
      <div className="meter mt-3"><span style={{ width: `${value}%` }} /></div>
    </div>
  );
}
