import Link from "next/link";
import { goals } from "@/data/goals";
import { GradeMark } from "@/components/grade-mark";
import type { EvidenceGrade, GoalId } from "@/data/types";
import { searchDsld } from "@/lib/dsld";
import { firstParam } from "@/lib/format";
import { listIngredients, listProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

const grades: EvidenceGrade[] = ["A", "B", "C", "D", "I"];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = (firstParam(params.q) ?? "").trim();
  const goal = firstParam(params.goal) ?? "";
  const grade = firstParam(params.grade) ?? "";
  const library = await listIngredients();
  const catalog = await listProducts();
  const query = q.toLowerCase();

  const ingredientHits = library.filter((item) => {
    const blob = `${item.name} ${item.aliases.join(" ")} ${item.summary} ${item.category}`.toLowerCase();
    const matchesQuery = !query || blob.includes(query);
    const matchesGoal = !goal || item.goals.includes(goal as GoalId) || item.outcomes.some((outcome) => outcome.goal === goal);
    const matchesGrade = !grade || item.evidenceGrade === grade;
    return matchesQuery && matchesGoal && matchesGrade;
  });

  const productHits = catalog.filter((item) => {
    const blob = `${item.brand} ${item.name} ${item.description} ${item.category} ${item.barcode}`.toLowerCase();
    return !query || blob.includes(query);
  });

  let dsld: Awaited<ReturnType<typeof searchDsld>> = [];
  let dsldError = false;
  if (query.length >= 3) {
    try {
      dsld = await searchDsld(q, 6);
    } catch {
      dsldError = true;
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <p className="eyebrow text-copper">Search</p>
      <h1 className="mt-2 text-5xl">Find the ingredient, then the claim.</h1>
      <form className="mt-6 flex flex-col gap-2 sm:flex-row" action="/search">
        <input className="field" name="q" defaultValue={q} placeholder="Magnesium, prenatal, barcode, ashwagandha" />
        {goal ? <input type="hidden" name="goal" value={goal} /> : null}
        {grade ? <input type="hidden" name="grade" value={grade} /> : null}
        <button className="btn btn-primary" type="submit">Search</button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/search?q=${encodeURIComponent(q)}`} className={`chip ${!goal && !grade ? "border-moss bg-sage" : ""}`}>All grades</Link>
        {grades.map((item) => (
          <Link key={item} href={`/search?q=${encodeURIComponent(q)}&grade=${item}${goal ? `&goal=${goal}` : ""}`} className={`chip ${grade === item ? "border-moss bg-sage" : ""}`}>
            {item === "I" ? "Insufficient" : `Grade ${item}`}
          </Link>
        ))}
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {goals.map((item) => (
          <Link key={item.id} href={`/search?q=${encodeURIComponent(q)}&goal=${item.id}${grade ? `&grade=${grade}` : ""}`} className={`chip shrink-0 ${goal === item.id ? "border-copper bg-blush" : ""}`}>
            {item.name}
          </Link>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-2xl">Ingredients · {ingredientHits.length}</h2>
        <div className="mt-4 grid gap-3">
          {ingredientHits.map((item) => (
            <Link key={item.slug} href={`/ingredients/${item.slug}`} className="panel grid gap-2 p-4 md:grid-cols-[1fr_auto] md:items-center">
              <span>
                <span className="text-xs uppercase tracking-widest text-muted">{item.category}</span>
                <span className="mt-1 block font-display text-2xl">{item.name}</span>
                <span className="mt-1 block text-sm text-[#3d4f46]">{item.summary.slice(0, 180)}…</span>
              </span>
              <GradeMark grade={item.evidenceGrade} />
            </Link>
          ))}
          {!ingredientHits.length ? <p className="text-sm text-muted">No monographs matched. Try a broader word, or scan the barcode.</p> : null}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">Curated labels · {productHits.length}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {productHits.slice(0, 8).map((item) => (
            <Link key={item.slug} href={`/products/${item.slug}`} className="panel p-4">
              <p className="text-xs uppercase tracking-widest text-copper">{item.brand}</p>
              <p className="font-display text-2xl">{item.name}</p>
              <p className="text-sm text-muted">{item.form} · {item.barcode}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">NIH label database</h2>
        <p className="mt-1 text-sm text-muted">Live search of the Dietary Supplement Label Database. Open a hit for a dose-by-dose reading.</p>
        {dsldError ? <p className="mt-3 text-sm text-copper">The NIH service did not respond. Curated results above are still available.</p> : null}
        <div className="mt-4 grid gap-3">
          {dsld.map((hit) => (
            <Link key={hit.id} href={`/labels/${hit.id}`} className="panel p-4">
              <p className="text-xs uppercase tracking-widest text-muted">DSLD {hit.id}{hit.offMarket ? " · off market" : ""}</p>
              <p className="font-display text-2xl">{hit.name}</p>
              <p className="text-sm text-muted">{hit.brand} · {hit.form} · {hit.productType}</p>
            </Link>
          ))}
          {query.length < 3 ? <p className="text-sm text-muted">Type at least 3 characters to query NIH labels.</p> : null}
        </div>
      </section>
    </main>
  );
}
