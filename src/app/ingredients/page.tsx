import Link from "next/link";
import { GradeMark } from "@/components/grade-mark";
import { firstParam } from "@/lib/format";
import { listIngredients } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function IngredientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const category = firstParam(params.category) ?? "";
  const library = await listIngredients();
  const categories = [...new Set(library.map((item) => item.category))].sort();
  const visible = library
    .filter((item) => !category || item.category === category)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <p className="eyebrow text-copper">Library</p>
      <h1 className="mt-2 text-5xl">Ingredient monographs</h1>
      <p className="mt-3 max-w-2xl text-lg leading-8 text-[#3d4f46]">
        Each grade belongs to a specific use, not to the ingredient as a personality. Vitamin D can be grade A for deficiency and unhelpful for everything else.
      </p>
      <div className="mt-5 flex gap-2 overflow-x-auto">
        <Link href="/ingredients" className={`chip shrink-0 ${!category ? "border-moss bg-sage" : ""}`}>All</Link>
        {categories.map((item) => (
          <Link key={item} href={`/ingredients?category=${encodeURIComponent(item)}`} className={`chip shrink-0 ${category === item ? "border-moss bg-sage" : ""}`}>
            {item}
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {visible.map((item) => (
          <Link key={item.slug} href={`/ingredients/${item.slug}`} className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">{item.category}</p>
                <h2 className="text-3xl">{item.name}</h2>
              </div>
              <GradeMark grade={item.evidenceGrade} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[#3d4f46]">{item.primaryUse}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs uppercase tracking-widest text-muted">
              <span>Effect {item.effectiveness}</span>
              <span>Safety {item.safety}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
