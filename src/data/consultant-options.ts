import { GOAL_IDS, type GoalId } from "@/data/types";

export const ageBands = [
  { id: "under-18", label: "Under 18" },
  { id: "18-30", label: "18–30" },
  { id: "31-50", label: "31–50" },
  { id: "51-64", label: "51–64" },
  { id: "65+", label: "65 or older" },
  { id: "unspecified", label: "Prefer not to say" },
] as const;

export const sexOptions = [
  { id: "female", label: "Female" },
  { id: "male", label: "Male" },
  { id: "other", label: "Other / non-binary" },
  { id: "unspecified", label: "Prefer not to say" },
] as const;

export const dietOptions = [
  { id: "omnivore", label: "Omnivore" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
] as const;

export const conditionOptions = [
  { id: "kidney", label: "Kidney disease" },
  { id: "liver", label: "Liver disease" },
  { id: "bleeding", label: "Bleeding risk or surgery soon" },
  { id: "thyroid", label: "Thyroid disease" },
  { id: "diabetes", label: "Diabetes" },
  { id: "bipolar", label: "Bipolar disorder" },
  { id: "autoimmune", label: "Autoimmune disease" },
  { id: "stones", label: "Kidney stones" },
  { id: "gallbladder", label: "Gallbladder disease" },
] as const;

export const medicationOptions = [
  { id: "warfarin", label: "Warfarin or another anticoagulant" },
  { id: "ssri", label: "Antidepressant (SSRI, SNRI, or similar)" },
  { id: "statin", label: "A statin" },
  { id: "levothyroxine", label: "Levothyroxine" },
  { id: "metformin", label: "Metformin" },
  { id: "ppi", label: "PPI or long-term acid reducer" },
  { id: "blood_pressure", label: "Blood pressure medicine" },
  { id: "diabetes_meds", label: "Insulin or another diabetes medicine" },
  { id: "birth_control", label: "Hormonal birth control" },
  { id: "immunosuppressant", label: "Transplant or immunosuppressant drug" },
  { id: "sedative", label: "Sleep medicine, benzodiazepine, or opioid" },
  { id: "antibiotic", label: "Antibiotic, current course" },
] as const;

export type AgeBand = (typeof ageBands)[number]["id"];
export type Sex = (typeof sexOptions)[number]["id"];
export type Diet = (typeof dietOptions)[number]["id"];

export type Profile = {
  goals: GoalId[];
  ageBand: AgeBand;
  sex: Sex;
  pregnant: boolean;
  lactating: boolean;
  diet: Diet;
  conditions: string[];
  medications: string[];
  current: string[];
  avoidHerbs: boolean;
  preferTested: boolean;
  notes: string;
};

const ages = new Set(ageBands.map((item) => item.id));
const sexes = new Set(sexOptions.map((item) => item.id));
const diets = new Set(dietOptions.map((item) => item.id));
const conditions = new Set(conditionOptions.map((item) => item.id));
const medications = new Set(medicationOptions.map((item) => item.id));
const goals = new Set<string>(GOAL_IDS);

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function parseProfile(input: unknown): { ok: true; profile: Profile } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "The consultation form was empty." };
  }
  const body = input as Record<string, unknown>;
  const selectedGoals = asStringArray(body.goals).filter((goal): goal is GoalId => goals.has(goal));
  if (selectedGoals.length === 0) {
    return { ok: false, error: "Choose at least one health goal." };
  }
  if (selectedGoals.length > 3) {
    return { ok: false, error: "Choose up to three goals so the note stays specific." };
  }
  const ageBand = typeof body.ageBand === "string" && ages.has(body.ageBand as AgeBand)
    ? (body.ageBand as AgeBand)
    : "unspecified";
  const sex = typeof body.sex === "string" && sexes.has(body.sex as Sex) ? (body.sex as Sex) : "unspecified";
  const diet = typeof body.diet === "string" && diets.has(body.diet as Diet) ? (body.diet as Diet) : "omnivore";
  const notes = typeof body.notes === "string" ? body.notes.slice(0, 500).trim() : "";

  return {
    ok: true,
    profile: {
      goals: selectedGoals,
      ageBand,
      sex,
      pregnant: Boolean(body.pregnant),
      lactating: Boolean(body.lactating),
      diet,
      conditions: asStringArray(body.conditions).filter((id) => conditions.has(id as (typeof conditionOptions)[number]["id"])),
      medications: asStringArray(body.medications).filter((id) => medications.has(id as (typeof medicationOptions)[number]["id"])),
      current: asStringArray(body.current).slice(0, 12),
      avoidHerbs: Boolean(body.avoidHerbs),
      preferTested: body.preferTested !== false,
      notes,
    },
  };
}
