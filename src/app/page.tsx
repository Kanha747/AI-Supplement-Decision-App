import Link from "next/link";
import { goals } from "@/data/goals";
import { GradeMark } from "@/components/grade-mark";
import { listIngredients, listProductLines, listProducts } from "@/lib/queries";
import { buildCuratedReview } from "@/lib/scoring";

export const dynamic = "force-dynamic";

const hero = "https://images.pexels.com/photos/7526060/pexels-photo-7526060.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=1100";
const lab = "https://images.pexels.com/photos/6208941/pexels-photo-6208941.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const bowl = "https://images.pexels.com/photos/7111398/pexels-photo-7111398.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200";

export default async function HomePage() {
  const library = await listIngredients();
  const catalog = await listProducts();
  const lines = await listProductLines();
  const featured = catalog
    .filter((product) => product.featured)
    .slice(0, 4)
    .map((product) => ({
      product,
      review: buildCuratedReview(
        product,
        lines.filter((line) => line.productId === product.id),
        library,
      ),
    }));
  const spotlight = [...library].sort((a, b) => b.effectiveness - a.effectiveness).slice(0, 6);

  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-end gap-10 px-4 pb-8 pt-10 md:px-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-copper">Volume 01 · Supplement decisions</p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[0.95] text-ink md:text-7xl">
            Know what the capsule is actually doing.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#3d4f46]">
            Evidra reads a label the way a careful reviewer would: ingredient, dose, evidence, and whether it fits the goal you named. Scan a barcode, or start from the science.
          </p>
          <form action="/search" className="mt-7 flex flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="q">Search</label>
            <input id="q" name="q" className="field" placeholder="Vitamin D, creatine, sleep, a brand…" />
            <button className="btn btn-primary" type="submit">Search</button>
          </form>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/scan" className="btn btn-copper">Scan a barcode</Link>
            <Link href="/consultant" className="btn btn-ghost">Ask the goals guide</Link>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-5 text-sm">
            <div>
              <dt className="text-muted">Monographs</dt>
              <dd className="font-display text-3xl">{library.length}</dd>
            </div>
            <div>
              <dt className="text-muted">Curated labels</dt>
              <dd className="font-display text-3xl">{catalog.length}</dd>
            </div>
            <div>
              <dt className="text-muted">Live lookup</dt>
              <dd className="font-display text-3xl">NIH</dd>
            </div>
          </dl>
        </div>
        <div className="relative lg:col-span-5">
          <img src={hero} alt="Glass bottles, capsules, and botanicals arranged on a warm yellow surface" className="h-[520px] w-full rounded-[2rem] object-cover" />
          <div className="absolute -left-4 bottom-8 max-w-xs rounded-3xl bg-card p-4 shadow-xl md:-left-10">
            <p className="eyebrow text-copper">Example reading</p>
            <p className="mt-2 font-display text-2xl">Magnesium glycinate, 200 mg elemental</p>
            <p className="mt-1 text-sm text-muted">Studied range. Oxide in a gummy usually is not.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl">Start from the outcome, not the aisle.</h2>
          <Link href="/consultant" className="text-sm underline">Open the guide</Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {goals.slice(0, 8).map((goal) => (
            <Link key={goal.id} href={`/consultant?goal=${goal.id}`} className="panel block p-4 hover:-translate-y-0.5 hover:border-moss">
              <p className="text-xs uppercase tracking-widest text-muted">{goal.kicker}</p>
              <p className="mt-1 font-display text-2xl">{goal.name}</p>
              <p className="mt-2 text-sm leading-5 text-[#3d4f46]">{goal.question}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="ink-panel grid gap-8 rounded-[2rem] p-6 md:grid-cols-3 md:p-10">
          {[
            ["01", "Name the ingredient", "A blend is not a finding. Evidra splits the label into compounds that have monographs."],
            ["02", "Grade the claim", "A is for a specific outcome with solid trials. Insufficient means the marketing arrived first."],
            ["03", "Check the dose and the person", "A studied milligram can still be the wrong product in pregnancy, on warfarin, or with an SSRI."],
          ].map(([index, title, copy]) => (
            <div key={index}>
              <p className="font-display text-4xl text-[#e7c7a4]">{index}</p>
              <h3 className="mt-2 text-2xl">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#d5e0d8]">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow text-copper">Curated labels</p>
            <h2 className="mt-2 text-4xl">Clarity is not the same as “good for you.”</h2>
          </div>
          <Link href="/search" className="hidden text-sm underline md:inline">Browse all</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {featured.map(({ product, review }) => (
            <Link key={product.slug} href={`/products/${product.slug}`} className="panel grid grid-cols-[auto_1fr] gap-4 p-5">
              <div>
                <p className="font-display text-5xl leading-none">{review.scores.clarity}</p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-muted">Clarity</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-copper">{product.brand}</p>
                <h3 className="text-2xl">{product.name}</h3>
                <p className="mt-1 text-sm text-muted">{product.form} · UPC {product.barcode}</p>
                <p className="mt-3 text-sm leading-6 text-[#3d4f46]">{product.highlights[0]}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <img src={bowl} alt="A breakfast bowl with turmeric, figs, and honey" className="h-full min-h-72 w-full rounded-[2rem] object-cover" />
        <div>
          <p className="eyebrow text-copper">Evidence index</p>
          <h2 className="mt-2 text-4xl">A short shelf of graded ingredients.</h2>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {spotlight.map((item) => (
              <li key={item.slug}>
                <Link href={`/ingredients/${item.slug}`} className="flex items-center justify-between gap-4 py-3">
                  <span>
                    <span className="block font-medium">{item.name}</span>
                    <span className="text-sm text-muted">{item.primaryUse}</span>
                  </span>
                  <GradeMark grade={item.evidenceGrade} />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/ingredients" className="mt-4 inline-block text-sm underline">Open the full library</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:px-6 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-copper">Health-goals guide</p>
          <h2 className="mt-2 text-4xl leading-tight md:text-5xl">Tell it the goal, the medicine, and what you already take.</h2>
          <p className="mt-4 text-lg leading-8 text-[#3d4f46]">
            The guide writes a short consultation from the monograph library. It will refuse a plan for anyone under 18, flag St. John’s wort against birth control, and send you to a ferritin test before it talks about iron.
          </p>
          <Link href="/consultant" className="btn btn-primary mt-6">Start a note</Link>
        </div>
        <img src={lab} alt="A person writing notes beside laboratory glassware" className="h-80 w-full rounded-[2rem] object-cover" />
      </section>
    </main>
  );
}
