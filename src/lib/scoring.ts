import type { DoseAssessment, DoseRange, EvidenceGrade } from "@/data/types";
import type { productIngredients, products } from "@/db/schema";
import { assessmentLabel, clamp } from "@/lib/format";
import type { IngredientRow } from "@/lib/match";
import { isExcipient, matchIngredient } from "@/lib/match";

export type ReviewLine = {
  name: string;
  slug?: string;
  amount: string;
  form?: string | null;
  assessment: DoseAssessment;
  assessmentLabel: string;
  note: string;
  grade?: EvidenceGrade;
  category?: string;
};

export type ReviewFlag = {
  tone: "good" | "warn" | "bad" | "info";
  title: string;
  detail: string;
};

export type ReviewModel = {
  kind: "curated" | "label";
  eyebrow: string;
  title: string;
  brand: string;
  form: string;
  serving: string;
  container: string;
  barcode?: string;
  offMarket?: boolean;
  description: string;
  certifications: string[];
  thirdParty: boolean;
  qualityNotes: string;
  scores: { clarity: number; dose: number; evidence: number; transparency: number };
  lines: ReviewLine[];
  flags: ReviewFlag[];
  statements: { type: string; notes: string }[];
  sourceNote: string;
  save: { kind: string; ref: string; title: string; subtitle: string; href: string };
};

const gradePoints: Record<EvidenceGrade, number> = {
  A: 96,
  B: 80,
  C: 58,
  D: 34,
  I: 22,
};

const dosePoints: Record<DoseAssessment, number> = {
  aligned: 100,
  context: 78,
  high: 68,
  low: 44,
  unknown: 36,
  excessive: 24,
};

function normalizeUnit(unit: string) {
  const value = unit.toLowerCase().replace("µ", "u").replace("μ", "u").replace(/\s/g, "");
  if (value === "iu" || value === "i.u.") return "iu";
  if (value === "mcg" || value === "ug") return "mcg";
  if (value === "billioncfu" || value === "cfu") return value;
  return value;
}

export function assessDose(
  range: DoseRange | null,
  amount: number | null,
  unit: string | null,
  override: DoseAssessment | null,
): DoseAssessment {
  if (override) return override;
  if (!range || amount == null || !unit) return "unknown";
  if (normalizeUnit(unit) !== normalizeUnit(range.unit)) return "unknown";
  if (amount < range.alignedMin) return "low";
  if (amount <= range.alignedMax) return "aligned";
  if (amount <= range.highMax) return "high";
  return "excessive";
}

function average(values: number[]) {
  if (!values.length) return 40;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function scoreFromLines(
  lines: ReviewLine[],
  options: { thirdParty: boolean; proprietary: boolean; gummy: boolean },
) {
  const evidence = lines.map((line) => (line.grade ? gradePoints[line.grade] : 40));
  const dose = lines.map((line) => dosePoints[line.assessment]);
  const lineScores = lines.map((_, index) => evidence[index] * 0.55 + dose[index] * 0.45);
  let transparency = 64;
  if (options.thirdParty) transparency += 16;
  if (options.proprietary) transparency -= 30;
  else transparency += 10;
  if (options.gummy) transparency -= 6;
  if (lines.some((line) => line.assessment === "unknown")) transparency -= 10;
  transparency = clamp(transparency);
  let clarity = Math.round(average(lineScores) * 0.66 + transparency * 0.34);
  if (options.proprietary) clarity = Math.min(clarity, 54);
  if (lines.some((line) => line.assessment === "excessive")) clarity = Math.min(clarity, 62);
  return {
    clarity: clamp(clarity),
    dose: Math.round(average(dose)),
    evidence: Math.round(average(evidence)),
    transparency: Math.round(transparency),
  };
}

type ProductRow = typeof products.$inferSelect;
type LineRow = typeof productIngredients.$inferSelect;

export function buildCuratedReview(product: ProductRow, rows: LineRow[], library: IngredientRow[]): ReviewModel {
  const bySlug = new Map(library.map((item) => [item.slug, item]));
  const lines: ReviewLine[] = rows.map((row) => {
    const ingredient = bySlug.get(row.ingredientSlug);
    const assessment = assessDose(
      ingredient?.doseRange ?? null,
      row.numericAmount,
      row.unit,
      row.assessmentOverride,
    );
    return {
      name: row.labelName,
      slug: ingredient?.slug,
      amount: row.amountText,
      form: row.formName,
      assessment,
      assessmentLabel: assessmentLabel(assessment),
      note: row.note || ingredient?.primaryUse || "No additional note.",
      grade: ingredient?.evidenceGrade,
      category: ingredient?.category,
    };
  });

  const flags: ReviewFlag[] = [];
  if (product.thirdPartyTested) {
    flags.push({
      tone: "good",
      title: "Third-party testing",
      detail: "Potency or purity testing is part of this curated record. Still read the lot, not the logo.",
    });
  } else {
    flags.push({
      tone: "warn",
      title: "No third-party assay on file",
      detail: "Label claims are only as good as the batch. This record does not include an independent test.",
    });
  }
  if (product.proprietaryBlend) {
    flags.push({
      tone: "bad",
      title: "Proprietary blend",
      detail: "Individual doses are hidden. A studied ingredient at an unknown dose cannot be reviewed properly.",
    });
  }
  if (product.gummy) {
    flags.push({
      tone: "info",
      title: "Gummy format",
      detail: "Gummies add sugar and have a worse track record for matching the labeled dose, especially melatonin.",
    });
  }
  for (const watchout of product.watchouts) {
    flags.push({ tone: "warn", title: "Watchout", detail: watchout });
  }
  const risky = rows.some((row) => {
    const ingredient = bySlug.get(row.ingredientSlug);
    return ingredient?.interactions.some((item) => item.severity === "high") || (ingredient && ingredient.safety < 50);
  });
  if (risky) {
    flags.push({
      tone: "bad",
      title: "Safety is separate from the clarity score",
      detail: "A dose can match a trial and still be the wrong product for pregnancy, anticoagulants, or antidepressants.",
    });
  }

  return {
    kind: "curated",
    eyebrow: "Curated label review",
    title: product.name,
    brand: product.brand,
    form: product.form,
    serving: product.servingSize,
    container: product.servingsPerContainer,
    barcode: product.barcode,
    description: product.description,
    certifications: product.certifications,
    thirdParty: product.thirdPartyTested,
    qualityNotes: product.qualityNotes,
    scores: scoreFromLines(lines, {
      thirdParty: product.thirdPartyTested,
      proprietary: product.proprietaryBlend,
      gummy: product.gummy,
    }),
    lines,
    flags,
    statements: [],
    sourceNote: "Curated by Evidra from the label pattern and the ingredient evidence library. Not a laboratory assay of a specific lot.",
    save: {
      kind: "product",
      ref: product.slug,
      title: product.name,
      subtitle: product.brand,
      href: `/products/${product.slug}`,
    },
  };
}

type DsldQuantity = {
  quantity?: number;
  unit?: string;
  servingSizeQuantity?: number;
  servingSizeUnit?: string;
};

type DsldRow = {
  name?: string;
  category?: string;
  ingredientGroup?: string;
  notes?: string;
  forms?: { name?: string }[];
  quantity?: DsldQuantity[];
  nestedRows?: DsldRow[];
};

export type DsldLabel = {
  id?: number | string;
  fullName?: string;
  brandName?: string;
  upcSku?: string;
  servingsPerContainer?: string;
  offMarket?: number;
  physicalState?: { langualCodeDescription?: string };
  servingSizes?: { minQuantity?: number; maxQuantity?: number; unit?: string }[];
  targetGroups?: string[];
  statements?: { type?: string; notes?: string }[];
  ingredientRows?: DsldRow[];
  otheringredients?: { ingredients?: { name?: string }[] };
  productType?: { langualCodeDescription?: string };
};

function flattenRows(rows: DsldRow[] | undefined, into: DsldRow[] = []) {
  for (const row of rows ?? []) {
    into.push(row);
    if (row.nestedRows?.length) flattenRows(row.nestedRows, into);
  }
  return into;
}

function activeRows(rows: DsldRow[]) {
  return rows.filter((row) => {
    const name = row.name ?? "";
    if (!name || isExcipient(name)) return false;
    const category = (row.category ?? "").toLowerCase();
    if (["other", "excipient"].includes(category) && !row.quantity?.[0]?.quantity) return false;
    return true;
  });
}

export function buildLabelReview(label: DsldLabel, library: IngredientRow[], id: string): ReviewModel {
  const serving = label.servingSizes?.[0];
  const servingText = serving
    ? `${serving.minQuantity ?? ""}${serving.maxQuantity && serving.maxQuantity !== serving.minQuantity ? `–${serving.maxQuantity}` : ""} ${serving.unit ?? ""}`.trim()
    : "See label";
  const rows = activeRows(flattenRows(label.ingredientRows)).slice(0, 28);
  const lines: ReviewLine[] = rows.map((row) => {
    const form = row.forms?.[0]?.name;
    const quantity = row.quantity?.[0];
    const amountNumber = typeof quantity?.quantity === "number" ? quantity.quantity : null;
    const unit = quantity?.unit && quantity.unit !== "Not Present" ? quantity.unit : null;
    const ingredient = matchIngredient(`${row.name ?? ""} ${row.ingredientGroup ?? ""} ${form ?? ""}`, library);
    const assessment = assessDose(ingredient?.doseRange ?? null, amountNumber, unit, null);
    const amount = amountNumber != null && unit ? `${amountNumber} ${unit}` : "Amount not stated";
    return {
      name: row.name || row.ingredientGroup || "Ingredient",
      slug: ingredient?.slug,
      amount,
      form,
      assessment: ingredient ? assessment : amountNumber == null ? "unknown" : assessment === "unknown" ? "unknown" : assessment,
      assessmentLabel: ingredient ? assessmentLabel(assessment) : "Not in evidence library",
      note: ingredient
        ? ingredient.primaryUse
        : "Evidra does not have a graded monograph for this ingredient yet. Treat the marketing claim as unreviewed.",
      grade: ingredient?.evidenceGrade,
      category: ingredient?.category || row.category,
    };
  });

  const proprietary = /proprietary blend/i.test(JSON.stringify(label.ingredientRows ?? []));
  const gummy = /gumm|jell/i.test(label.physicalState?.langualCodeDescription ?? "");
  const flags: ReviewFlag[] = [
    {
      tone: "info",
      title: "NIH Dietary Supplement Label Database",
      detail: "This review uses the public label record and maps recognizable ingredients onto Evidra's evidence library.",
    },
  ];
  if (label.offMarket === 1) {
    flags.push({
      tone: "warn",
      title: "Marked off market in DSLD",
      detail: "The database lists this label as off market. A store shelf can lag the record, and reformulations happen.",
    });
  }
  if (proprietary) {
    flags.push({
      tone: "bad",
      title: "Proprietary blend detected",
      detail: "At least one blend hides individual amounts. Those lines cannot be dose-checked.",
    });
  }
  if (!lines.length) {
    flags.push({
      tone: "warn",
      title: "Sparse ingredient rows",
      detail: "DSLD did not return usable active-ingredient amounts for this label.",
    });
  }

  const statements = (label.statements ?? [])
    .filter((item) => item.notes && item.type && !/version code/i.test(item.type))
    .slice(0, 6)
    .map((item) => ({ type: item.type || "Statement", notes: item.notes || "" }));

  return {
    kind: "label",
    eyebrow: label.productType?.langualCodeDescription || "NIH label",
    title: label.fullName || "Supplement label",
    brand: label.brandName || "Unknown brand",
    form: label.physicalState?.langualCodeDescription || "Supplement",
    serving: servingText,
    container: label.servingsPerContainer || "Not listed",
    barcode: label.upcSku,
    offMarket: label.offMarket === 1,
    description: statements[0]?.notes || "Public label record from the NIH Dietary Supplement Label Database, annotated with Evidra ingredient grades where the names match.",
    certifications: label.targetGroups?.slice(0, 6) ?? [],
    thirdParty: false,
    qualityNotes: "Third-party testing is not consistently reported in DSLD. Absence here is not proof a brand is untested.",
    scores: scoreFromLines(lines.length ? lines : [{
      name: "Label",
      amount: "—",
      assessment: "unknown",
      assessmentLabel: assessmentLabel("unknown"),
      note: "",
    }], { thirdParty: false, proprietary, gummy }),
    lines,
    flags,
    statements,
    sourceNote: "Label text is reproduced from NIH DSLD for identification. Evidence grades are Evidra's, and they apply only to matched ingredients.",
    save: {
      kind: "label",
      ref: id,
      title: label.fullName || "NIH label",
      subtitle: label.brandName || "DSLD",
      href: `/labels/${id}`,
    },
  };
}
