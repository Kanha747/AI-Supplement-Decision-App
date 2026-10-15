import type { DoseAssessment, EvidenceGrade } from "@/data/types";

export function gradeLabel(grade: EvidenceGrade) {
  if (grade === "I") return "Insufficient";
  return `Grade ${grade}`;
}

export function gradeMeaning(grade: EvidenceGrade) {
  switch (grade) {
    case "A":
      return "Consistent benefit for a specific outcome in solid human trials.";
    case "B":
      return "A real signal, often modest or limited to a defined group.";
    case "C":
      return "Limited or mixed trials. Reasonable only with eyes open.";
    case "D":
      return "Evidence argues against the usual marketing claim.";
    default:
      return "Not enough reliable human evidence to recommend it.";
  }
}

export function assessmentLabel(assessment: DoseAssessment) {
  switch (assessment) {
    case "aligned":
      return "Studied range";
    case "low":
      return "Below studied range";
    case "high":
      return "Higher than needed";
    case "excessive":
      return "Above a cautious ceiling";
    case "context":
      return "Depends on the person";
    default:
      return "Dose hidden or unclear";
  }
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function barcodeVariants(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const variants = new Set<string>();
  if (!digits) return [];
  variants.add(digits);
  if (digits.length === 13 && digits.startsWith("0")) variants.add(digits.slice(1));
  if (digits.length === 12) variants.add(`0${digits}`);
  if (digits.length === 12) {
    variants.add(`${digits[0]} ${digits.slice(1, 6)} ${digits.slice(6, 11)} ${digits[11]}`);
  }
  if (digits.length === 13) {
    variants.add(`${digits.slice(0, 1)} ${digits.slice(1, 7)} ${digits.slice(7, 13)}`);
  }
  return [...variants];
}
