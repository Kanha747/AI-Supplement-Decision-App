export const GOAL_IDS = [
  "sleep",
  "stress",
  "energy",
  "immunity",
  "heart",
  "bone",
  "joint",
  "muscle",
  "cognition",
  "mood",
  "gut",
  "skin",
  "glucose",
  "performance",
  "pregnancy",
  "aging",
] as const;

export type GoalId = (typeof GOAL_IDS)[number];

export type EvidenceGrade = "A" | "B" | "C" | "D" | "I";

export type DoseAssessment =
  | "aligned"
  | "low"
  | "high"
  | "excessive"
  | "context"
  | "unknown";

export type SafetyFlag = "avoid" | "caution" | "discuss" | "core" | "ok";

export type SafetyFlags = {
  pregnancy: SafetyFlag;
  kidney: SafetyFlag;
  liver: SafetyFlag;
  bleeding: SafetyFlag;
  thyroid: SafetyFlag;
  moodMeds: SafetyFlag;
  warfarin: SafetyFlag;
  birthControl: SafetyFlag;
  diabetesMeds: SafetyFlag;
  sedatives: SafetyFlag;
  immunosuppressants: SafetyFlag;
};

export type DoseRange = {
  unit: string;
  alignedMin: number;
  alignedMax: number;
  highMax: number;
  note: string;
};

export type Outcome = {
  goal: GoalId;
  grade: EvidenceGrade;
  effect: string;
  detail: string;
};

export type Study = {
  title: string;
  year: number;
  design: string;
  finding: string;
  citation: string;
};

export type Interaction = {
  with: string;
  severity: "high" | "moderate" | "low";
  note: string;
};

export type FormNote = {
  name: string;
  note: string;
};

export type SourceLink = {
  label: string;
  url: string;
};

export type IngredientRecord = {
  slug: string;
  name: string;
  aliases: string[];
  category: string;
  summary: string;
  mechanism: string;
  evidenceGrade: EvidenceGrade;
  effectiveness: number;
  safety: number;
  primaryUse: string;
  typicalDose: string;
  upperLimit: string;
  doseRange: DoseRange | null;
  forms: FormNote[];
  outcomes: Outcome[];
  cautions: string[];
  interactions: Interaction[];
  whoShouldAvoid: string[];
  keyStudies: Study[];
  sources: SourceLink[];
  goals: GoalId[];
  safetyFlags: SafetyFlags;
  timing: string;
  testFirst: boolean;
  herb: boolean;
};

export type ProductLine = {
  ingredientSlug: string;
  labelName: string;
  amountText: string;
  numericAmount: number | null;
  unit: string | null;
  formName: string | null;
  note: string | null;
  assessmentOverride: DoseAssessment | null;
};

export type ProductRecord = {
  slug: string;
  barcode: string;
  brand: string;
  name: string;
  category: string;
  form: string;
  servingSize: string;
  servingsPerContainer: string;
  description: string;
  thirdPartyTested: boolean;
  certifications: string[];
  qualityNotes: string;
  priceDisplay: string;
  featured: boolean;
  proprietaryBlend: boolean;
  gummy: boolean;
  watchouts: string[];
  highlights: string[];
  lines: ProductLine[];
};

export type GoalMeta = {
  id: GoalId;
  name: string;
  kicker: string;
  blurb: string;
  question: string;
};
