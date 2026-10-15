import Link from "next/link";
import { GradeMark } from "@/components/grade-mark";
import { firstParam } from "@/lib/format";
import { listIngredients } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const requested = (firstParam(params.items) ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
  const library = await listIngredients();
  const selected = requested
    .map((slug) => library.find((item) => item.slug === slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <p className="eyebrow text-copper">Compare</p>
      <h1 className="mt-2 text-5xl">Three ingredients, one table.</h1>
      <p className="mt-3 max-w-2xl text-[#3d4f46]">
        Add ingredients from any monograph with Compare. The tray holds three. This page does not rank them for you — it puts the dose, grade, and avoid list side by side.
      </p>
      {!selected.length ? (
        <div className="panel mt-8 p-6">
          <p>Nothing selected yet.</p>
          <Link href="/ingredients" className="btn btn-primary mt-4">Browse the library</Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-3 text-left text-sm">
            <thead>
              <tr>
                <th className="w-36" />
                {selected.map((item) => (
                  <th key={item.slug} className="panel p-4 align-bottom">
                    <Link href={`/ingredients/${item.slug}`} className="font-display text-3xl underline decoration-line">{item.name}</Link>
                    <div className="mt-2"><GradeMark grade={item.evidenceGrade} /></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Primary use" values={selected.map((item) => item.primaryUse)} />
              <Row label="Dose" values={selected.map((item) => item.typicalDose)} />
              <Row label="Ceiling" values={selected.map((item) => item.upperLimit)} />
              <Row label="Safety" values={selected.map((item) => `${item.safety}/100`)} />
              <Row label="Best outcomes" values={selected.map((item) => item.outcomes.slice(0, 2).map((outcome) => `${outcome.goal} ${outcome.grade}`).join(", "))} />
              <Row label="Avoid if" values={selected.map((item) => item.whoShouldAvoid[0] ?? "See monograph")} />
              <Row label="Interaction" values={selected.map((item) => item.interactions[0] ? `${item.interactions[0].with}: ${item.interactions[0].note}` : "None highlighted")} />
            </tbody>
          </table>
        </div>
      )}
      <section className="mt-8">
        <h2 className="text-2xl">Add another</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {library.slice(0, 18).map((item) => {
            const next = [...new Set([...requested, item.slug])].slice(-3);
            return (
              <Link key={item.slug} href={`/compare?items=${next.join(",")}`} className="chip">
                {item.name}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function Row({ label, values }: { label: string; values: string[] }) {
  return (
    <tr>
      <th className="align-top text-xs uppercase tracking-widest text-muted">{label}</th>
      {values.map((value, index) => (
        <td key={`${label}-${index}`} className="panel p-4 align-top leading-6">{value}</td>
      ))}
    </tr>
  );
}
