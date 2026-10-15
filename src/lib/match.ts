import type { IngredientRecord } from "@/data/types";
import type { ingredients } from "@/db/schema";

export type IngredientRow = typeof ingredients.$inferSelect;

const EXCIPIENTS = [
  "cellulose",
  "magnesium stearate",
  "silicon dioxide",
  "stearic acid",
  "hypromellose",
  "hydroxypropyl",
  "gelatin",
  "rice flour",
  "titanium dioxide",
  "citric acid",
  "natural flavor",
  "maltodextrin",
  "silica",
  "croscarmellose",
  "glycerin",
  "pectin",
  "sucrose",
  "tapioca",
  "sunflower oil",
  "beeswax",
];

export function isExcipient(name: string) {
  const hay = name.toLowerCase();
  return EXCIPIENTS.some((item) => hay.includes(item));
}

export function matchIngredient(text: string, library: IngredientRow[]) {
  const hay = text.toLowerCase();
  let best: { row: IngredientRow; score: number } | null = null;
  for (const row of library) {
    const keys = [row.name, row.slug.replaceAll("-", " "), ...(row.aliases ?? [])];
    for (const key of keys) {
      const needle = key.toLowerCase().trim();
      if (needle.length < 4) continue;
      if (!hay.includes(needle)) continue;
      if (!best || needle.length > best.score) {
        best = { row, score: needle.length };
      }
    }
  }
  return best?.row ?? null;
}

export function ingredientToRecord(row: IngredientRow): IngredientRecord {
  return {
    slug: row.slug,
    name: row.name,
    aliases: row.aliases,
    category: row.category,
    summary: row.summary,
    mechanism: row.mechanism,
    evidenceGrade: row.evidenceGrade,
    effectiveness: row.effectiveness,
    safety: row.safety,
    primaryUse: row.primaryUse,
    typicalDose: row.typicalDose,
    upperLimit: row.upperLimit,
    doseRange: row.doseRange,
    forms: row.forms,
    outcomes: row.outcomes,
    cautions: row.cautions,
    interactions: row.interactions,
    whoShouldAvoid: row.whoShouldAvoid,
    keyStudies: row.keyStudies,
    sources: row.sources,
    goals: row.goals,
    safetyFlags: row.safetyFlags,
    timing: row.timing,
    testFirst: row.testFirst,
    herb: row.herb,
  };
}
