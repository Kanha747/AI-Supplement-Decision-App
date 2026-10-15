import Link from "next/link";
import { GradeMark } from "@/components/grade-mark";
import { SaveButton } from "@/components/save-button";
import type { ReviewModel } from "@/lib/scoring";

const toneClass = {
  good: "border-[#cfe3d4] bg-[#f3faf5]",
  warn: "border-[#ead7b4] bg-[#fbf6ea]",
  bad: "border-[#f0cfc0] bg-[#fdf4ef]",
  info: "border-line bg-white/70",
};

export function ReviewView({ review }: { review: ReviewModel }) {
  return (
    <article className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <p className="eyebrow text-copper">{review.eyebrow}</p>
      <div className="mt-3 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="text-sm text-muted">{review.brand}</p>
          <h1 className="mt-1 text-4xl leading-tight text-ink md:text-6xl">{review.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#3d4f46]">{review.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="chip">{review.form}</span>
            <span className="chip">Serving {review.serving}</span>
            <span className="chip">{review.container} per container</span>
            {review.barcode ? <span className="chip">UPC {review.barcode}</span> : null}
            {review.offMarket ? <span className="chip">Off market in DSLD</span> : null}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <SaveButton item={review.save} tone="primary" />
            <Link href="/scan" className="btn btn-ghost text-sm">Scan another</Link>
          </div>
        </div>
        <aside className="panel p-5">
          <p className="eyebrow text-muted">Label clarity</p>
          <p className="mt-2 font-display text-6xl text-ink">{review.scores.clarity}</p>
          <p className="text-sm text-muted">Not a personal recommendation. It scores disclosure, dose alignment, and how mature the evidence is for the named ingredients.</p>
          <dl className="mt-5 space-y-3 text-sm">
            <ScoreRow label="Dose alignment" value={review.scores.dose} />
            <ScoreRow label="Evidence maturity" value={review.scores.evidence} />
            <ScoreRow label="Transparency" value={review.scores.transparency} />
          </dl>
          {review.thirdParty ? <p className="mt-4 text-sm text-moss">Third-party testing is part of this record.</p> : null}
        </aside>
      </div>

      <section className="mt-8 grid gap-3 md:grid-cols-2">
        {review.flags.map((flag) => (
          <div key={`${flag.title}-${flag.detail}`} className={`rounded-2xl border p-4 ${toneClass[flag.tone]}`}>
            <p className="text-sm font-semibold">{flag.title}</p>
            <p className="mt-1 text-sm leading-6 text-[#3d4f46]">{flag.detail}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl">What the label is actually saying</h2>
          <p className="hidden text-sm text-muted md:block">Each line is matched to a monograph when the name is recognizable.</p>
        </div>
        <div className="mt-4 overflow-hidden rounded-3xl border border-line bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f3ece2] text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Ingredient</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Reading</th>
              </tr>
            </thead>
            <tbody>
              {review.lines.map((line) => (
                <tr key={`${line.name}-${line.amount}`} className="border-t border-line align-top">
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {line.slug ? (
                        <Link href={`/ingredients/${line.slug}`} className="font-semibold underline decoration-line">
                          {line.name}
                        </Link>
                      ) : (
                        <span className="font-semibold">{line.name}</span>
                      )}
                      {line.grade ? <GradeMark grade={line.grade} size="sm" /> : null}
                    </div>
                    {line.form ? <p className="mt-1 text-xs text-muted">{line.form}</p> : null}
                    <p className="mt-2 max-w-xl text-[#3d4f46] md:hidden">{line.note}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{line.amount}</p>
                    <p className="mt-1 text-xs text-copper">{line.assessmentLabel}</p>
                  </td>
                  <td className="hidden px-4 py-4 text-[#3d4f46] md:table-cell">{line.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {review.statements.length ? (
        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {review.statements.map((statement) => (
            <blockquote key={statement.notes} className="panel p-5">
              <p className="eyebrow text-muted">{statement.type}</p>
              <p className="mt-2 text-sm leading-6">{statement.notes}</p>
            </blockquote>
          ))}
        </section>
      ) : null}

      <section className="mt-10 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="panel p-6">
          <h2 className="text-2xl">Quality notes</h2>
          <p className="mt-3 leading-7 text-[#3d4f46]">{review.qualityNotes}</p>
          {review.certifications.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {review.certifications.map((item) => (
                <span key={item} className="chip">{item}</span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="ink-panel rounded-[1.4rem] p-6">
          <p className="eyebrow text-[#e7c7a4]">Before you buy</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#e7eee9]">
            <li>Do you have a reason other than the front-of-label claim?</li>
            <li>Is the dose in the range that was studied?</li>
            <li>Does the form matter, or is it just a trademark?</li>
            <li>What medicine or condition would make this a bad idea?</li>
          </ul>
        </div>
      </section>
      <p className="mt-8 text-xs leading-5 text-muted">{review.sourceNote} Educational only. Not medical advice.</p>
    </article>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
      <div className="meter"><span style={{ width: `${value}%` }} /></div>
    </div>
  );
}
