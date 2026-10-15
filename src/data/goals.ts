import type { GoalMeta } from "@/data/types";

export const goals: GoalMeta[] = [
  {
    id: "sleep",
    name: "Sleep",
    kicker: "Onset & continuity",
    blurb: "Falling asleep faster without a morning hangover from an oversized dose.",
    question: "What has actual trial data for sleep onset?",
  },
  {
    id: "stress",
    name: "Stress",
    kicker: "Calm, not sedation",
    blurb: "Perceived stress and wind-down, separated from products that just make you drowsy.",
    question: "Which options have human stress data, and which clash with sedatives?",
  },
  {
    id: "energy",
    name: "Energy",
    kicker: "Fix the deficit first",
    blurb: "Daytime energy is usually sleep, iron, B12, or protein — not a mystery blend.",
    question: "When is a supplement rational for fatigue, and when is a lab smarter?",
  },
  {
    id: "immunity",
    name: "Immunity",
    kicker: "Deficiency & duration",
    blurb: "What shortens a cold slightly, and what does not prevent one.",
    question: "Which immune claims survive contact with trials?",
  },
  {
    id: "heart",
    name: "Heart",
    kicker: "Lipids & pressure",
    blurb: "Triglycerides, LDL, and blood pressure — with the trials named, not implied.",
    question: "What moves lipids, and what only sounds cardioprotective?",
  },
  {
    id: "bone",
    name: "Bone",
    kicker: "Density needs context",
    blurb: "Vitamin D, calcium, and K2, including who should not add more.",
    question: "Is another calcium tablet helping or just adding a bolus?",
  },
  {
    id: "joint",
    name: "Joints",
    kicker: "Pain, not miracles",
    blurb: "Modest symptom data for osteoarthritis, clearly separated from cartilage myths.",
    question: "What has modest pain data, and what is mostly marketing?",
  },
  {
    id: "muscle",
    name: "Muscle",
    kicker: "Training is the driver",
    blurb: "Creatine and protein as adjuncts to lifting, not replacements for it.",
    question: "Which compounds actually add to resistance training?",
  },
  {
    id: "cognition",
    name: "Focus",
    kicker: "Narrow claims only",
    blurb: "Alertness, sleep-loss, and deficiency — not a promise of a better memory.",
    question: "What is supported for focus, and what is still preliminary?",
  },
  {
    id: "mood",
    name: "Mood",
    kicker: "Interactions first",
    blurb: "A few agents have depression data. Several of them collide with prescriptions.",
    question: "What is unsafe to combine with an antidepressant?",
  },
  {
    id: "gut",
    name: "Gut",
    kicker: "Strain and fiber",
    blurb: "Regularity and antibiotic-associated diarrhea, not a universal microbiome reset.",
    question: "Which strains and fibers have a job, and which are vague?",
  },
  {
    id: "skin",
    name: "Skin & hair",
    kicker: "Photos vs. labs",
    blurb: "Collagen has modest skin data. Biotin mostly interferes with blood tests.",
    question: "What is worth trying for skin, and what should you stop before labs?",
  },
  {
    id: "glucose",
    name: "Glucose",
    kicker: "Adjunct, not a drug",
    blurb: "Berberine and fiber can nudge numbers. They are not a metformin substitute.",
    question: "What has glucose data without pretending to replace medication?",
  },
  {
    id: "performance",
    name: "Training",
    kicker: "Specific efforts",
    blurb: "Creatine, caffeine, beta-alanine, and nitrate — each for a different kind of session.",
    question: "Which performance aids match the workout you actually do?",
  },
  {
    id: "pregnancy",
    name: "Prenatal",
    kicker: "Outcome data only",
    blurb: "Folate, iodine, choline, iron, and DHA — and a long list of things to leave alone.",
    question: "What belongs in a prenatal pattern, and what should wait?",
  },
  {
    id: "aging",
    name: "Aging",
    kicker: "Function over hype",
    blurb: "Muscle, bone, B12 absorption, and vitamin D status — not anti-aging blends.",
    question: "What actually matters more after 50?",
  },
];

export const goalById = Object.fromEntries(goals.map((goal) => [goal.id, goal])) as Record<
  GoalMeta["id"],
  GoalMeta
>;
