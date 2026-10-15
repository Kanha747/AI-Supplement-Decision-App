import Link from "next/link";
import { ConsultantStudio } from "@/components/consultant-studio";
import { firstParam } from "@/lib/format";
import { listConsultations, type ConsultationHistoryItem } from "@/lib/consultant";
import { listIngredients } from "@/lib/queries";
import { readSessionId } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ConsultantPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const library = await listIngredients();
  const sessionId = await readSessionId();
  const history: ConsultationHistoryItem[] = sessionId ? await listConsultations(sessionId) : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <p className="eyebrow text-copper">Health-goals guide</p>
      <h1 className="mt-2 max-w-3xl text-5xl leading-tight">A consultation that shows its work.</h1>
      <p className="mt-3 max-w-2xl text-lg leading-8 text-[#3d4f46]">
        Pick a goal, mark the constraints, and Evidra writes a short note from the monograph library. Follow-up questions stay inside that evidence, instead of wandering into a new claim.
      </p>
      <div className="mt-8">
        <ConsultantStudio
          initialGoal={firstParam(params.goal)}
          ingredients={library.map((item) => ({ slug: item.slug, name: item.name, category: item.category }))}
        />
      </div>
      {history.length ? (
        <section className="mt-12">
          <h2 className="text-3xl">Notes on this browser</h2>
          <ul className="mt-4 space-y-2">
            {history.map((item) => (
              <li key={item.id}>
                <Link href={`/consultant/${item.id}`} className="panel block p-4">
                  <p className="text-xs uppercase tracking-widest text-muted">{item.goals.join(" · ")}</p>
                  <p className="font-display text-2xl">{item.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
