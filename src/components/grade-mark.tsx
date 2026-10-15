import type { EvidenceGrade } from "@/data/types";
import { gradeLabel } from "@/lib/format";

export function GradeMark({ grade, size = "md" }: { grade: EvidenceGrade; size?: "sm" | "md" }) {
  return (
    <span className={`grade-${grade} inline-flex items-center rounded-full font-semibold ${size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"}`}>
      {gradeLabel(grade)}
    </span>
  );
}
