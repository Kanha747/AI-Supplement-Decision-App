import { goalById } from "@/data/goals";
import type { Profile } from "@/data/consultant-options";
import { medicationOptions } from "@/data/consultant-options";
import type { EvidenceGrade, GoalId } from "@/data/types";
import { db } from "@/db";
import { consultations } from "@/db/schema";
import { polishNarrative } from "@/lib/llm";
import { matchIngredient } from "@/lib/match";
import { listIngredients, listProductLines, listProducts } from "@/lib/queries";
import type { IngredientRow } from "@/lib/match";
import { and, desc, eq } from "drizzle-orm";

export type ConsultationHistoryItem = {
  id: number;
  createdAt: Date;
  summary: string;
  goals: string[];
};

export type Recommendation = {
  slug: string;
  name: string;
  tier: "start-here" | "consider" | "test-first";
  grade: EvidenceGrade;
  forGoals: string[];
  why: string;
  dose: string;
  timing: string;
  caution: string;
};

export type ConsultationResult = {
  headline: string;
  confidence: "high" | "moderate" | "limited";
  narrative: string[];
  recommendations: Recommendation[];
  avoid: { slug: string; name: string; reason: string }[];
  testing: string[];
  interactions: string[];
  questions: string[];
  products: { slug: string; name: string; brand: string; reason: string }[];
  alreadyTaking: string[];
  polished: boolean;
  modelNote: string;
};

const gradeWeight: Record<EvidenceGrade, number> = {
  A: 100,
  B: 76,
  C: 46,
  D: 6,
  I: 4,
};

const shortConstraints: Record<string, string> = {
  kidney: "kidney disease",
  liver: "liver disease",
  bleeding: "bleeding risk",
  thyroid: "thyroid disease",
  diabetes: "diabetes",
  bipolar: "bipolar disorder",
  autoimmune: "autoimmune disease",
  stones: "kidney stones",
  gallbladder: "gallbladder disease",
  warfarin: "warfarin",
  ssri: "an antidepressant",
  statin: "a statin",
  levothyroxine: "levothyroxine",
  metformin: "metformin",
  ppi: "acid suppression",
  blood_pressure: "blood pressure medicine",
  diabetes_meds: "diabetes medicine",
  birth_control: "hormonal contraception",
  immunosuppressant: "immunosuppression",
  sedative: "a sedative",
  antibiotic: "an antibiotic",
};

function labelFor(id: string) {
  return shortConstraints[id] ?? id;
}

function goalNames(goals: GoalId[]) {
  return goals.map((goal) => goalById[goal]?.name ?? goal);
}

function blockedReason(ingredient: IngredientRow, profile: Profile) {
  const flags = ingredient.safetyFlags;
  if ((profile.pregnant || profile.lactating) && flags.pregnancy === "avoid") {
    return "The safety file does not support using this in pregnancy or lactation.";
  }
  if (profile.conditions.includes("kidney") && flags.kidney === "avoid") {
    return "Kidney disease is a reason not to self-start this.";
  }
  if (profile.conditions.includes("liver") && (flags.liver === "avoid" || ["ashwagandha", "valerian", "st-johns-wort", "berberine"].includes(ingredient.slug))) {
    return "Liver disease makes this a poor self-experiment.";
  }
  if (profile.conditions.includes("bleeding") && flags.bleeding === "avoid") {
    return "Bleeding risk or upcoming surgery rules this out for now.";
  }
  if (profile.conditions.includes("gallbladder") && ingredient.slug === "curcumin") {
    return "Curcumin can increase gallbladder contraction.";
  }
  if (profile.conditions.includes("bipolar") && ["same", "st-johns-wort", "rhodiola"].includes(ingredient.slug)) {
    return "Mood-shifting or stimulating supplements can destabilize bipolar disorder.";
  }
  if (profile.conditions.includes("autoimmune") && ingredient.slug === "elderberry") {
    return "Immune-stimulating herbs are a poor fit with autoimmune disease.";
  }
  if (profile.conditions.includes("thyroid") && flags.thyroid === "caution" && ingredient.herb) {
    return "This can move thyroid hormone levels.";
  }
  if (profile.medications.includes("ssri") && flags.moodMeds === "avoid") {
    return "This combines poorly with antidepressant medicines.";
  }
  if (profile.medications.includes("warfarin") && flags.warfarin === "avoid") {
    return "This can oppose or destabilize warfarin.";
  }
  if (profile.medications.includes("birth_control") && flags.birthControl === "avoid") {
    return "This can reduce the effectiveness of hormonal contraception.";
  }
  if (profile.medications.includes("diabetes_meds") && flags.diabetesMeds === "avoid") {
    return "This can stack with diabetes medicines and push glucose too low.";
  }
  if (profile.medications.includes("immunosuppressant") && flags.immunosuppressants === "avoid") {
    return "Not compatible with immunosuppressant therapy as a self-started supplement.";
  }
  if (profile.medications.includes("sedative") && flags.sedatives === "avoid") {
    return "This adds to sedation from medicines you already take.";
  }
  if (profile.avoidHerbs && ingredient.herb) {
    return "You asked to leave botanicals out.";
  }
  if (profile.pregnant && ingredient.slug === "caffeine") {
    return "Keep caffeine at or below about 200 mg/day in pregnancy, and do not add a stimulant product.";
  }
  return null;
}

function cautionFor(ingredient: IngredientRow, profile: Profile) {
  const notes: string[] = [];
  if (profile.medications.includes("levothyroxine") && ["iron", "calcium", "magnesium", "zinc"].includes(ingredient.slug)) {
    notes.push("Separate from levothyroxine by at least four hours.");
  }
  if (profile.medications.includes("warfarin") && ingredient.safetyFlags.warfarin === "caution") {
    notes.push("Mention this to the clinician who manages your INR before you start.");
  }
  if (profile.medications.includes("sedative") && ingredient.safetyFlags.sedatives === "caution") {
    notes.push("This can add to drowsiness from your current medicines.");
  }
  if (profile.conditions.includes("stones") && ["calcium", "vitamin-c", "beetroot"].includes(ingredient.slug)) {
    notes.push("Kidney-stone history means large doses are a poor idea.");
  }
  if (profile.conditions.includes("diabetes") && ingredient.slug === "berberine") {
    notes.push("Do not add berberine to diabetes treatment without the prescriber.");
  }
  if (ingredient.testFirst) {
    notes.push("A lab is more useful than a head start.");
  }
  if (!notes.length && ingredient.cautions[0]) notes.push(ingredient.cautions[0]);
  return notes[0] ?? "Stop if you feel worse, and do not stack a second product with the same ingredient.";
}

function scoreIngredient(ingredient: IngredientRow, profile: Profile) {
  const matched = ingredient.outcomes.filter((outcome) => profile.goals.includes(outcome.goal) && outcome.grade !== "D");
  if (!matched.length) return 0;
  let score = matched.reduce((sum, outcome) => sum + gradeWeight[outcome.grade], 0);
  score += ingredient.safety / 10;
  if (ingredient.testFirst) score -= 4;
  if (profile.current.includes(ingredient.slug)) score -= 36;
  if (profile.diet === "vegan" && ["vitamin-b12", "iodine", "vitamin-d", "omega-3", "iron", "choline"].includes(ingredient.slug)) {
    score += 18;
  }
  if (profile.diet === "vegetarian" && ["vitamin-b12", "iron", "vitamin-d", "omega-3"].includes(ingredient.slug)) {
    score += 10;
  }
  if (profile.ageBand === "65+" && ["vitamin-b12", "vitamin-d", "protein", "creatine", "calcium", "magnesium"].includes(ingredient.slug)) {
    score += 10;
  }
  if (profile.ageBand === "51-64" && ["vitamin-d", "protein", "calcium", "vitamin-b12"].includes(ingredient.slug)) {
    score += 6;
  }
  if (profile.medications.includes("metformin") && ingredient.slug === "vitamin-b12") score += 26;
  if (profile.medications.includes("ppi") && ["vitamin-b12", "magnesium"].includes(ingredient.slug)) score += 16;
  if (profile.medications.includes("statin") && ingredient.slug === "coq10") score += 20;
  if (profile.medications.includes("antibiotic") && ingredient.slug === "probiotics") score += 24;
  if (profile.pregnant && ingredient.safetyFlags.pregnancy === "core") score += 34;
  if (profile.pregnant && ingredient.safetyFlags.pregnancy === "discuss") score += 8;
  const notes = profile.notes.toLowerCase();
  if (/migraine/.test(notes) && ingredient.slug === "magnesium") score += 22;
  if (/constipat/.test(notes) && ["psyllium", "magnesium"].includes(ingredient.slug)) score += 14;
  if (/(cholesterol|ldl|triglyceride)/.test(notes) && ["psyllium", "omega-3"].includes(ingredient.slug)) score += 16;
  if (/(jet lag|shift work)/.test(notes) && ingredient.slug === "melatonin") score += 16;
  if (/(hair|nails)/.test(notes) && ingredient.slug === "biotin") score -= 30;
  if (/(lift|strength|gym|hypertrophy)/.test(notes) && ["creatine", "protein"].includes(ingredient.slug)) score += 12;
  if (profile.goals.includes("sleep") && ingredient.slug === "melatonin" && !/(jet lag|shift|circadian)/.test(notes)) {
    score -= 8;
  }
  return score;
}

function tierFor(ingredient: IngredientRow, profile: Profile): Recommendation["tier"] {
  if (ingredient.testFirst && !(profile.pregnant && ingredient.slug === "iron")) return "test-first";
  if (ingredient.evidenceGrade === "A" || ingredient.evidenceGrade === "B") return "start-here";
  return "consider";
}

function whyFor(ingredient: IngredientRow, profile: Profile) {
  const matched = ingredient.outcomes.filter((outcome) => profile.goals.includes(outcome.goal));
  const best = [...matched].sort((a, b) => gradeWeight[b.grade] - gradeWeight[a.grade])[0];
  const notes = profile.notes.toLowerCase();
  const extras: string[] = [];
  if (/migraine/.test(notes) && ingredient.slug === "magnesium") {
    extras.push("You mentioned migraines. Magnesium also has a guideline-level role in prevention, which is a stronger reason than a generic sleep gummy.");
  }
  if (/(cholesterol|ldl|triglyceride)/.test(notes) && ingredient.slug === "omega-3") {
    extras.push("Triglyceride lowering needs a multi-gram EPA+DHA dose and a clinician, not a 300 mg fish-oil capsule.");
  }
  if (/(hair|nails)/.test(notes) && ingredient.slug === "iron") {
    extras.push("Hair changes are a reason to check ferritin, not a reason to start biotin.");
  }
  if (!best) return [ingredient.summary, ...extras].join(" ");
  const goal = goalById[best.goal]?.name.toLowerCase() ?? best.goal;
  return [`${best.effect} for ${goal}. ${best.detail}`, ...extras].join(" ");
}

function marketedButWeak(profile: Profile) {
  const slugs = new Set<string>();
  if (profile.goals.some((goal) => ["cognition", "energy"].includes(goal))) slugs.add("lions-mane");
  if (profile.goals.includes("cognition")) slugs.add("ginkgo");
  if (profile.goals.includes("skin")) slugs.add("biotin");
  if (profile.goals.includes("immunity")) slugs.add("elderberry");
  if (profile.goals.includes("mood")) slugs.add("st-johns-wort");
  if (profile.goals.includes("sleep")) slugs.add("valerian");
  if (profile.goals.includes("joint")) slugs.add("glucosamine");
  return [...slugs];
}

export async function buildConsultation(profile: Profile): Promise<ConsultationResult> {
  const library = await listIngredients();
  const catalog = await listProducts();
  const productLines = await listProductLines();
  const names = goalNames(profile.goals);

  if (profile.ageBand === "under-18") {
    return {
      headline: "This guide does not write supplement plans for people under 18.",
      confidence: "limited",
      narrative: [
        `You selected ${names.join(", ")}. Supplement decisions for adolescents belong with a pediatric clinician, not a shelf or an evidence model.`,
        "Iron, vitamin D, and restricted diets can matter at this age, and so can accidental overdose. A clinician can order the right test and the right dose. Evidra will not guess either one.",
      ],
      recommendations: [],
      avoid: [],
      testing: ["Ask a pediatric clinician before starting any supplement, including melatonin and protein powders."],
      interactions: [],
      questions: ["Which of these symptoms needs a lab rather than a product?", "Is there a food pattern that covers this without a capsule?"],
      products: [],
      alreadyTaking: [],
      polished: false,
      modelNote: "Age screen. No product recommendations were generated.",
    };
  }

  const ranked = library
    .map((ingredient) => ({
      ingredient,
      score: scoreIngredient(ingredient, profile),
      block: blockedReason(ingredient, profile),
    }))
    .sort((a, b) => b.score - a.score);

  const recommendations: Recommendation[] = [];
  for (const item of ranked) {
    if (item.block || item.score < 42) continue;
    if (profile.pregnant && !["core", "discuss", "ok"].includes(item.ingredient.safetyFlags.pregnancy)) continue;
    if (recommendations.some((existing) => existing.slug === item.ingredient.slug)) continue;
    const herbs = recommendations.filter((existing) => library.find((row) => row.slug === existing.slug)?.herb).length;
    if (item.ingredient.herb && herbs >= 1) continue;
    recommendations.push({
      slug: item.ingredient.slug,
      name: item.ingredient.name,
      tier: tierFor(item.ingredient, profile),
      grade: item.ingredient.evidenceGrade,
      forGoals: item.ingredient.outcomes.filter((outcome) => profile.goals.includes(outcome.goal)).map((outcome) => goalById[outcome.goal]?.name ?? outcome.goal),
      why: whyFor(item.ingredient, profile),
      dose: item.ingredient.typicalDose,
      timing: item.ingredient.timing,
      caution: cautionFor(item.ingredient, profile),
    });
    if (recommendations.length === 4) break;
  }

  const avoid = ranked
    .filter((item) => item.block && (item.score > 30 || marketedButWeak(profile).includes(item.ingredient.slug) || profile.current.includes(item.ingredient.slug)))
    .slice(0, 5)
    .map((item) => ({
      slug: item.ingredient.slug,
      name: item.ingredient.name,
      reason: item.block || "Blocked by the safety screen.",
    }));

  for (const slug of marketedButWeak(profile)) {
    if (avoid.some((item) => item.slug === slug) || recommendations.some((item) => item.slug === slug)) continue;
    const ingredient = library.find((item) => item.slug === slug);
    if (!ingredient) continue;
    const block = blockedReason(ingredient, profile);
    avoid.push({
      slug,
      name: ingredient.name,
      reason: block || `Often marketed for ${names.join(" or ").toLowerCase()}, but the evidence grade is ${ingredient.evidenceGrade === "I" ? "insufficient" : `grade ${ingredient.evidenceGrade}`}. ${ingredient.summary.split(". ")[0]}.`,
    });
  }

  const testing = new Set<string>();
  if (recommendations.some((item) => item.slug === "vitamin-d") || profile.goals.some((goal) => ["bone", "immunity", "aging"].includes(goal))) {
    testing.add("A 25-hydroxyvitamin D test tells you whether vitamin D is a treatment or a habit.");
  }
  if (recommendations.some((item) => item.slug === "iron") || /fatigue|tired|hair|heavy period/.test(profile.notes.toLowerCase())) {
    testing.add("Ferritin and a complete blood count before iron. Fatigue has many causes, and extra iron is harmful if you are not low.");
  }
  if (profile.diet !== "omnivore" || profile.medications.some((item) => ["metformin", "ppi"].includes(item)) || profile.ageBand === "65+") {
    testing.add("Vitamin B12 if you are vegan, over 65, on metformin, or on long-term acid suppression.");
  }
  if (profile.pregnant) {
    testing.add("Prenatal labs — hemoglobin, and ferritin when offered — should set the iron dose, not the front of the bottle.");
  }
  if (!testing.size) {
    testing.add("If a symptom is new, worsening, or unexplained, a visit beats a capsule. Supplements cover gaps; they do not investigate them.");
  }

  const interactions = new Set<string>();
  const medNeedles: Record<string, string[]> = {
    warfarin: ["warfarin", "anticoagul"],
    ssri: ["ssri", "snri", "antidepress", "seroton"],
    statin: ["statin"],
    levothyroxine: ["levothyroxine", "thyroid"],
    metformin: ["metformin"],
    ppi: ["acid", "proton"],
    blood_pressure: ["blood pressure", "antihypertens"],
    diabetes_meds: ["diabetes", "insulin"],
    birth_control: ["contracept"],
    immunosuppressant: ["immunosuppress", "transplant", "cyclospor"],
    sedative: ["sedative", "benzodiazep", "opioid", "alcohol"],
    antibiotic: ["antibiotic", "tetracycline", "quinolone"],
  };
  for (const item of recommendations) {
    const ingredient = library.find((row) => row.slug === item.slug);
    if (!ingredient) continue;
    for (const interaction of ingredient.interactions) {
      const hay = interaction.with.toLowerCase();
      const relevant = profile.medications.some((med) => (medNeedles[med] ?? []).some((needle) => hay.includes(needle)));
      if (relevant) interactions.add(`${ingredient.name} with ${interaction.with}: ${interaction.note}`);
    }
  }
  if (profile.medications.includes("ssri")) {
    interactions.add("Do not add St. John's wort or SAMe to an antidepressant. That combination can cause serotonin syndrome.");
  }
  if (profile.medications.includes("birth_control")) {
    interactions.add("St. John's wort can cause hormonal contraception to fail. It should not be anywhere near this plan.");
  }
  if (profile.medications.includes("warfarin")) {
    interactions.add("Vitamin K2, ginkgo, and St. John's wort are incompatible with warfarin. High-dose omega-3 and glucosamine need an INR check if a clinician agrees to them.");
  }
  if (profile.medications.includes("levothyroxine")) {
    interactions.add("Iron, calcium, and magnesium bind levothyroxine. Separate them by at least four hours.");
  }

  const questions = [
    "Which of these is worth a 8–12 week trial, and which should wait for a lab?",
    "Are any of my current prescriptions affected by the short list above?",
    profile.pregnant
      ? "Does my prenatal cover folic acid, iodine, and choline, or only the first two?"
      : "Is there a food change that makes a supplement unnecessary?",
  ];

  const alreadyTaking = profile.current
    .map((slug) => library.find((item) => item.slug === slug))
    .filter((item): item is IngredientRow => Boolean(item))
    .map((item) => item.name);

  const productMatches: ConsultationResult["products"] = [];
  if (profile.preferTested) {
    const wanted = recommendations
      .filter((item) => item.tier !== "test-first" || profile.pregnant)
      .map((item) => item.slug);
    for (const slug of wanted) {
      const line = productLines.find((item) => item.ingredientSlug === slug);
      if (!line) continue;
      const product = catalog.find((item) => item.id === line.productId);
      if (!product || !product.thirdPartyTested || product.proprietaryBlend || product.gummy) continue;
      if (productMatches.some((item) => item.slug === product.slug)) continue;
      const name = library.find((item) => item.slug === slug)?.name ?? slug;
      productMatches.push({
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        reason: `A transparent label that discloses ${name} at a readable dose.`,
      });
      if (productMatches.length === 3) break;
    }
  }

  const top = recommendations[0];
  const constraintBits = [
    profile.pregnant ? "pregnancy" : "",
    profile.lactating ? "lactation" : "",
    profile.diet === "vegan" ? "a vegan pattern" : profile.diet === "vegetarian" ? "a vegetarian pattern" : "",
    ...profile.conditions.slice(0, 2).map((id) => labelFor(id)),
    ...profile.medications.slice(0, 2).map((id) => labelFor(id)),
  ].filter(Boolean);

  const narrative = [
    `You asked about ${names.join(", ")}.${constraintBits.length ? ` The note also has to respect ${constraintBits.join(", ")}.` : ""} This is an evidence brief, not a diagnosis and not a prescription.`,
    top
      ? `The strongest fit is ${top.name}. ${top.why} The practical dose is: ${top.dose}`
      : "Nothing in the library cleared both the evidence bar and the safety screen for this exact combination. That is a result, not a failure of the search.",
    recommendations.length > 1
      ? `Behind it: ${recommendations.slice(1).map((item) => `${item.name} (${item.tier === "test-first" ? "test first" : item.grade})`).join(", ")}. ${recommendations.some((item) => item.tier === "test-first") ? "Anything marked test-first should not be started just because the form was convenient." : "None of these replace sleep, food, or a medicine that is already working."}`
      : "A short list is intentional. Adding three more bottles would not make the evidence stronger.",
    avoid.length
      ? `Left off on purpose: ${avoid.slice(0, 3).map((item) => item.name).join(", ")}. ${avoid[0].reason}`
      : "No high-priority avoidance came up from the context you entered. That does not mean every other bottle in the shop is fine.",
    alreadyTaking.length
      ? `You already take ${alreadyTaking.join(", ")}. The plan does not stack a second product on top of those unless a dose on the label is clearly below the studied range.`
      : "If you already take a multivitamin, read it before adding any single ingredient. Doubling vitamin A, iron, B6, or selenium is the usual way a careful plan becomes a messy one.",
  ];

  const confidence: ConsultationResult["confidence"] =
    recommendations.some((item) => item.grade === "A") && !profile.pregnant
      ? "high"
      : recommendations.length
        ? "moderate"
        : "limited";

  const headline = top
    ? `${top.name} first. ${recommendations.length > 1 ? `${recommendations.length - 1} more to consider, and a list to leave alone.` : "The rest of the aisle can wait."}`
    : "No supplement earned a recommendation from the context you gave.";

  const draft: ConsultationResult = {
    headline,
    confidence,
    narrative,
    recommendations,
    avoid: avoid.slice(0, 6),
    testing: [...testing],
    interactions: [...interactions].slice(0, 6),
    questions,
    products: productMatches,
    alreadyTaking,
    polished: false,
    modelNote: "Generated by Evidra's evidence model from the curated monograph library. It does not diagnose, prescribe, or see your chart.",
  };

  const polished = await polishNarrative({
    narrative,
    facts: {
      goals: names,
      recommendations: recommendations.map((item) => ({ name: item.name, tier: item.tier, dose: item.dose, why: item.why })),
      avoid: draft.avoid,
      testing: draft.testing,
    },
  });

  if (polished) {
    draft.narrative = polished;
    draft.polished = true;
    draft.modelNote = "Evidence selection by Evidra. Wording edited with a language model constrained to that selection. Still not medical advice.";
  }

  return draft;
}

export async function saveConsultation(sessionId: string, profile: Profile, result: ConsultationResult): Promise<number | null> {
  const inserted = (await db
    .insert(consultations)
    .values({
      sessionId,
      profile: profile as unknown as Record<string, unknown>,
      goals: profile.goals,
      summary: result.headline,
      recommendations: result as unknown as Record<string, unknown>,
      polished: result.polished,
    })
    .returning({ id: consultations.id })) as Array<{ id: number }>;
  return inserted[0]?.id ?? null;
}

export async function getConsultation(id: number, sessionId: string): Promise<typeof consultations.$inferSelect | null> {
  const rows = (await db
    .select()
    .from(consultations)
    .where(and(eq(consultations.id, id), eq(consultations.sessionId, sessionId)))
    .limit(1)) as Array<typeof consultations.$inferSelect>;
  return rows[0] ?? null;
}

export async function listConsultations(sessionId: string): Promise<Array<ConsultationHistoryItem>> {
  return (db
    .select({
      id: consultations.id,
      createdAt: consultations.createdAt,
      summary: consultations.summary,
      goals: consultations.goals,
    })
    .from(consultations)
    .where(eq(consultations.sessionId, sessionId))
    .orderBy(desc(consultations.createdAt))
    .limit(8)) as Promise<Array<ConsultationHistoryItem>>;
}

export async function answerQuestion(question: string, consultation?: ConsultationResult | null) {
  const library = await listIngredients();
  const text = question.trim();
  if (text.length < 3) {
    return {
      answer: "Ask about a dose, an interaction, or why one option outranked another.",
      related: [] as string[],
    };
  }
  const lower = text.toLowerCase();
  const mentioned = library.filter((item) => {
    const keys = [item.name, ...item.aliases];
    return keys.some((key) => key.length > 3 && lower.includes(key.toLowerCase()));
  });
  const medHit = medicationOptions.find((item) => lower.includes(item.label.toLowerCase().split(" ")[0]) || lower.includes(item.id.replaceAll("_", " ")));

  if (mentioned.length >= 2 && /(vs|versus|or|instead|compare)/.test(lower)) {
    const [a, b] = mentioned;
    const goals = consultation?.recommendations.flatMap((item) => item.forGoals) ?? [];
    return {
      answer: `${a.name} is graded ${a.evidenceGrade} for ${a.primaryUse.toLowerCase()}. ${b.name} is graded ${b.evidenceGrade} for ${b.primaryUse.toLowerCase()}. ${a.summary} ${b.summary}${goals.length ? ` For the goals in your note, prefer the one whose monograph actually names those outcomes.` : ""}`,
      related: [a.slug, b.slug],
    };
  }

  if (mentioned.length === 1) {
    const ingredient = mentioned[0];
    if (/(dose|how much|iu|mg)/.test(lower)) {
      return {
        answer: `${ingredient.name}: ${ingredient.typicalDose} Upper boundary: ${ingredient.upperLimit} ${ingredient.timing}`,
        related: [ingredient.slug],
      };
    }
    if (/(safe|pregnan|interact|warfarin|ssri|antidepress)/.test(lower) || medHit) {
      const interaction = ingredient.interactions.find((item) =>
        medHit ? item.with.toLowerCase().includes(medHit.label.split(" ")[0].toLowerCase()) : item.severity !== "low",
      );
      const pregnancy =
        ingredient.safetyFlags.pregnancy === "avoid"
          ? "Pregnancy is a reason to avoid it."
          : ingredient.safetyFlags.pregnancy === "core"
            ? "This is one of the few ingredients Evidra treats as core in a prenatal pattern."
            : "Pregnancy use should be discussed rather than assumed.";
      return {
        answer: `${ingredient.name} has a safety score of ${ingredient.safety} out of 100 in this library. ${pregnancy} ${interaction ? interaction.note : "No high-severity interaction was matched to the exact wording of your question, which is not the same as a guarantee."} People who should avoid it: ${ingredient.whoShouldAvoid[0] ?? "see the monograph."}`,
        related: [ingredient.slug],
      };
    }
    return {
      answer: `${ingredient.summary} Best-supported use: ${ingredient.primaryUse}. ${ingredient.outcomes[0] ? ingredient.outcomes[0].detail : ""}`,
      related: [ingredient.slug],
    };
  }

  if (consultation && /(why|skip|not recommend|instead)/.test(lower)) {
    const avoid = consultation.avoid[0];
    const top = consultation.recommendations[0];
    return {
      answer: top
        ? `${top.name} ranked first because ${top.why} ${avoid ? `${avoid.name} was left off: ${avoid.reason}` : "The avoid list is short because nothing else you might have expected cleared a safety or evidence screen."}`
        : "The model did not find an option that cleared both evidence and the constraints you entered.",
      related: [top?.slug, avoid?.slug].filter((item): item is string => Boolean(item)),
    };
  }

  const fuzzy = matchIngredient(lower, library);
  if (fuzzy) {
    return {
      answer: fuzzy.summary,
      related: [fuzzy.slug],
    };
  }

  return {
    answer:
      "I can answer from the Evidra monograph library: doses, interactions, pregnancy flags, and why one option outranked another in your note. Try naming an ingredient, a medicine, or asking why something was skipped.",
    related: consultation?.recommendations.slice(0, 2).map((item) => item.slug) ?? [],
  };
}

