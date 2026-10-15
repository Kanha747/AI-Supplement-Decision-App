import type { Metadata } from "next";

export const metadata: Metadata = { title: "Method" };

export default function MethodPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <p className="eyebrow text-copper">Method</p>
      <h1 className="mt-2 text-5xl">How a grade gets onto the page.</h1>
      <div className="mt-6 space-y-5 text-lg leading-8 text-[#24352d]">
        <p>
          Evidra is a decision desk, not a clinic. Grades describe the human evidence for a named outcome. They do not describe the ingredient as universally good or bad.
        </p>
        <p>
          Grade A means a consistent benefit in well-conducted trials or established clinical use for that outcome. B is a real, often modest or population-specific signal. C is limited or mixed. D means the usual marketing claim is not supported. Insufficient means the claim is ahead of the data.
        </p>
        <p>
          Dose alignment is separate. A product can contain a grade A ingredient at a token dose and still be a weak label. The clarity score combines dose alignment, evidence maturity of the named ingredients, and whether the label discloses amounts and third-party testing. It is not a health score and it is not personalized.
        </p>
        <p>
          The health-goals guide ranks monographs against the goals you select, then applies hard stops for pregnancy, kidney disease, warfarin, antidepressants, hormonal contraception, and a short list of other constraints. If an OpenAI key is configured on the server, a language model may edit the wording. It is instructed not to add supplements or claims. Without a key, the note is written entirely by the evidence model.
        </p>
        <p>
          Barcode search checks curated teaching labels first, then the NIH Dietary Supplement Label Database, then Open Food Facts for foods. NIH label text is used to identify a product. Evidence grades are Evidra’s and apply only when an ingredient name matches a monograph.
        </p>
        <p>
          Sources lean on NIH Office of Dietary Supplements fact sheets, named trials, and Cochrane-style reviews. A monograph is a summary, not a systematic review, and interaction lists are not exhaustive. Talk with a clinician or pharmacist before starting, stopping, or combining supplements with medicines.
        </p>
      </div>
    </main>
  );
}
