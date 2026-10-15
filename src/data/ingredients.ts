import type { IngredientRecord, SafetyFlags } from "@/data/types";
import { moreIngredients } from "@/data/ingredients-more";
import { restIngredients } from "@/data/ingredients-rest";

const baseFlags: SafetyFlags = {
  pregnancy: "ok",
  kidney: "ok",
  liver: "ok",
  bleeding: "ok",
  thyroid: "ok",
  moodMeds: "ok",
  warfarin: "ok",
  birthControl: "ok",
  diabetesMeds: "ok",
  sedatives: "ok",
  immunosuppressants: "ok",
};

function flags(overrides: Partial<SafetyFlags>): SafetyFlags {
  return { ...baseFlags, ...overrides };
}

const coreIngredients: IngredientRecord[] = [
  {
    slug: "vitamin-d",
    name: "Vitamin D3",
    aliases: ["vitamin d", "cholecalciferol", "d3", "vitamin d3", "colecalciferol"],
    category: "Vitamin",
    summary:
      "The case for vitamin D is strongest when a blood test shows you are low. It supports bone health with adequate calcium, and a large meta-analysis found a small reduction in acute respiratory infections mainly in people who were deficient. It is not a general mood, weight, or longevity treatment.",
    mechanism:
      "Cholecalciferol is hydroxylated to 25-hydroxyvitamin D, then to calcitriol, which regulates intestinal calcium absorption and a wide set of nuclear receptors. Most supplements use D3, which raises serum 25-OH more reliably than D2 in many comparisons.",
    evidenceGrade: "A",
    effectiveness: 86,
    safety: 78,
    primaryUse: "Correcting low vitamin D and supporting bone health",
    typicalDose: "800–2,000 IU (20–50 mcg) daily for maintenance if intake or status is low. Repletion of frank deficiency is often higher and should be clinician-directed.",
    upperLimit: "4,000 IU/day is the adult tolerable upper intake level unless a clinician is supervising a short repletion course.",
    doseRange: {
      unit: "IU",
      alignedMin: 800,
      alignedMax: 2000,
      highMax: 4000,
      note: "Daily maintenance range used when status is low. Weekly prescription boluses are a different regimen.",
    },
    forms: [
      { name: "Cholecalciferol (D3)", note: "Preferred form in most trials and more effective at raising 25-OH than D2 for many people." },
      { name: "Ergocalciferol (D2)", note: "Used in some prescriptions. Acceptable, but D3 is the better default." },
      { name: "Lichen-derived D3", note: "A vegan D3 option. Dose still matters more than the marketing around the source." },
    ],
    outcomes: [
      { goal: "bone", grade: "A", effect: "Meaningful if low", detail: "Combined with calcium in people with low intake or low status, vitamin D reduces fracture risk in older deficient adults. It does little for fractures in already replete people." },
      { goal: "immunity", grade: "B", effect: "Small, mostly if deficient", detail: "Martineau 2017 found a modest reduction in acute respiratory infections, concentrated in those with low baseline 25-OH. It is not a shield against every infection." },
      { goal: "aging", grade: "B", effect: "Status matters", detail: "Older adults make and absorb less vitamin D. Testing and correcting deficiency is more rational than a blanket high dose." },
      { goal: "mood", grade: "C", effect: "Inconsistent", detail: "Trials in people who are not deficient are mixed. Do not treat depression with vitamin D alone." },
      { goal: "pregnancy", grade: "B", effect: "Screen and replete", detail: "Adequate status matters in pregnancy. Routine megadoses do not. Follow prenatal guidance rather than a standalone high-dose product." },
    ],
    cautions: [
      "Toxicity causes high calcium: nausea, weakness, kidney stones, and confusion. It is hard to reach from food and easy to reach from stacked supplements.",
      "More is not more protective. Large trials of high doses in replete adults have not delivered the broad benefits advertising implies.",
      "Granulomatous disease, some lymphomas, and primary hyperparathyroidism can make people sensitive to vitamin D.",
    ],
    interactions: [
      { with: "Thiazide diuretics", severity: "moderate", note: "Both can raise calcium. Stacking high-dose D with a thiazide deserves a clinician, not a guess." },
      { with: "Digoxin", severity: "moderate", note: "Hypercalcemia from excess vitamin D can increase digoxin toxicity." },
      { with: "Orlistat, cholestyramine, and some seizure medicines", severity: "low", note: "These can reduce absorption of fat-soluble vitamins." },
      { with: "High-dose calcium", severity: "moderate", note: "The combination, not vitamin D alone, is what most often drives stones and high serum calcium." },
    ],
    whoShouldAvoid: [
      "Anyone already taking a prescription vitamin D course unless the new product is part of that plan.",
      "People with hypercalcemia or a history of calcium-related kidney stones, unless a clinician is managing the dose.",
    ],
    keyStudies: [
      { title: "Vitamin D and acute respiratory infections", year: 2017, design: "Individual-participant meta-analysis of randomized trials", finding: "A small protective effect overall, clearest in people with low baseline 25-hydroxyvitamin D and with daily or weekly dosing rather than rare boluses.", citation: "Martineau et al., BMJ, 2017" },
      { title: "VITAL vitamin D ancillary fracture findings", year: 2022, design: "Large randomized trial in generally replete adults", finding: "Supplemental vitamin D did not reduce fractures in a population that was not selected for deficiency. Context beats the capsule.", citation: "LeBoff et al., NEJM, 2022" },
    ],
    sources: [
      { label: "NIH ODS vitamin D fact sheet", url: "https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/" },
    ],
    goals: ["bone", "immunity", "aging", "pregnancy", "mood"],
    safetyFlags: flags({ pregnancy: "discuss", kidney: "caution" }),
    timing: "With a meal that contains some fat. Consistency matters more than morning versus night.",
    testFirst: true,
    herb: false,
  },
  {
    slug: "omega-3",
    name: "Omega-3 EPA & DHA",
    aliases: ["omega-3", "fish oil", "epa", "dha", "algal oil", "algae oil", "icosapent", "omega 3"],
    category: "Fatty acid",
    summary:
      "Read the EPA and DHA line, not the fish-oil line. A gram of fish oil can hide 300 mg of the fats that were actually studied. EPA and DHA reliably lower triglycerides at higher doses. Heart-attack prevention is real in specific high-risk groups and absent in others — the trials disagree for a reason.",
    mechanism:
      "EPA and DHA incorporate into cell membranes, shift eicosanoid production, and at pharmacologic doses reduce hepatic triglyceride output. Algal oil supplies DHA and sometimes EPA without fish.",
    evidenceGrade: "B",
    effectiveness: 76,
    safety: 80,
    primaryUse: "Triglyceride lowering and a narrow cardiovascular role",
    typicalDose: "About 250–500 mg/day EPA+DHA covers a food gap. Triglyceride lowering usually needs 2–4 g/day of EPA+DHA under clinical supervision.",
    upperLimit: "Food-level intakes are safe for most adults. Multi-gram doses raise bleeding questions and atrial fibrillation risk in some trials, and belong with a clinician if you are on anticoagulants or have heart disease.",
    doseRange: {
      unit: "mg",
      alignedMin: 500,
      alignedMax: 1500,
      highMax: 4000,
      note: "Assess EPA+DHA combined, not total fish oil. Above 2 g/day is a therapeutic dose, not a casual one.",
    },
    forms: [
      { name: "Triglyceride or re-esterified triglyceride", note: "Generally well absorbed. Third-party oxidation testing matters more than the trademark." },
      { name: "Ethyl ester", note: "Absorb it with a fat-containing meal. Common in concentrates and prescriptions." },
      { name: "Algal oil", note: "The vegan source of DHA. Check that EPA is present if that is the target." },
    ],
    outcomes: [
      { goal: "heart", grade: "B", effect: "Strong for triglycerides, mixed for events", detail: "REDUCE-IT found fewer events with high-dose purified EPA in statin-treated high-risk patients. STRENGTH, using EPA+DHA, did not. Do not flatten those into 'fish oil prevents heart attacks.'" },
      { goal: "pregnancy", grade: "B", effect: "DHA is the relevant fat", detail: "200–300 mg DHA is a common prenatal target to cover a dietary gap. It is not a license for a stimulant or herbal stack." },
      { goal: "mood", grade: "C", effect: "Small adjunct", detail: "EPA-dominant formulas have a modest signal as an add-on for depression. They are not a replacement for treatment, and they do not mix casually with every psychiatric plan." },
      { goal: "joint", grade: "C", effect: "Mild anti-inflammatory signal", detail: "Some rheumatoid and osteoarthritis studies show small symptom changes. Effect sizes are modest next to proven care." },
      { goal: "aging", grade: "C", effect: "Dietary pattern first", detail: "Oily fish twice a week remains the cleaner intervention. A capsule covers a gap; it does not reproduce a diet." },
    ],
    cautions: [
      "Atrial fibrillation increased in some high-dose trials. Multi-gram doses are a medical decision if you have arrhythmia history.",
      "Quality varies. Oxidized fish oil smells like a bait shop and is not what the trials used. Look for a third-party oxidation or purity test.",
      "Labels that boast 1,000 mg fish oil and hide 300 mg EPA+DHA are underdosed for every claim that made fish oil famous.",
    ],
    interactions: [
      { with: "Warfarin and other anticoagulants", severity: "moderate", note: "Low doses are often continued, but multi-gram doses can add to bleeding risk. This is a clinician conversation, especially around surgery." },
      { with: "Antiplatelet drugs", severity: "low", note: "Additive bleeding risk is mainly a high-dose issue." },
    ],
    whoShouldAvoid: [
      "People with a fish or shellfish allergy should use algal oil, not fish oil, unless an allergist has said otherwise.",
      "Anyone scheduled for surgery should tell the surgical team about high-dose omega-3s.",
    ],
    keyStudies: [
      { title: "REDUCE-IT", year: 2019, design: "Randomized trial of icosapent ethyl 4 g/day", finding: "Fewer cardiovascular events in statin-treated patients with elevated triglycerides and residual risk. This was purified EPA, not a supermarket fish-oil softgel.", citation: "Bhatt et al., NEJM, 2019" },
      { title: "STRENGTH", year: 2020, design: "Randomized trial of a carboxylic acid EPA+DHA formula", finding: "No cardiovascular event benefit. The contrast with REDUCE-IT is why dose, formulation, and population have to be named.", citation: "Nicholls et al., JAMA, 2020" },
    ],
    sources: [
      { label: "NIH ODS omega-3 fact sheet", url: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/" },
    ],
    goals: ["heart", "pregnancy", "mood", "joint", "aging"],
    safetyFlags: flags({ pregnancy: "discuss", bleeding: "caution", warfarin: "caution" }),
    timing: "With a meal, especially ethyl-ester products. Split large doses if burping is a problem.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "magnesium",
    name: "Magnesium",
    aliases: ["magnesium", "magnesium glycinate", "magnesium citrate", "magnesium oxide", "magnesium threonate", "magnesium bisglycinate"],
    category: "Mineral",
    summary:
      "Magnesium is the rare supplement that is both commonly under-consumed and wildly oversold. Correcting a low intake can help sleep quality, migraine prevention, blood pressure, and constipation — but the form decides the job. Oxide is a laxative with poor absorption. Glycinate is what most sleep products should have used.",
    mechanism:
      "Magnesium is a cofactor for hundreds of enzymes, including those that regulate NMDA signaling, muscle contraction, and blood pressure. Supplemental salts differ in elemental content and in how much reaches circulation.",
    evidenceGrade: "B",
    effectiveness: 74,
    safety: 76,
    primaryUse: "Closing a dietary gap; migraine prevention; constipation; modest sleep support",
    typicalDose: "200–350 mg elemental magnesium daily from a supplement, on top of food. Citrate or oxide if constipation is the goal. Glycinate if tolerance is the goal.",
    upperLimit: "The adult upper level for supplemental magnesium is 350 mg/day, set because of diarrhea — not because food magnesium is dangerous. Kidney disease changes this completely.",
    doseRange: {
      unit: "mg",
      alignedMin: 150,
      alignedMax: 350,
      highMax: 500,
      note: "Elemental magnesium, not the weight of the whole salt. A 1,000 mg glycinate pill is not 1,000 mg of magnesium.",
    },
    forms: [
      { name: "Glycinate / bisglycinate", note: "Better tolerated. The sensible default for sleep or if oxide upset your stomach." },
      { name: "Citrate", note: "Well absorbed and useful when constipation is part of the picture." },
      { name: "Oxide", note: "Cheap, poorly absorbed, and more likely to loosen stools. Fine as a laxative, weak as a repletion strategy." },
      { name: "Threonate", note: "Marketed for cognition. Human evidence is thin relative to the price. Not the first magnesium to buy." },
    ],
    outcomes: [
      { goal: "sleep", grade: "B", effect: "Modest", detail: "Trials in older adults and poor sleepers show small improvements in sleep quality, not a knockout sedative effect. Useful when intake is low." },
      { goal: "stress", grade: "C", effect: "Supportive", detail: "Any calm people feel is usually the sleep and muscle effect, not a dedicated anxiolytic. Still a reasonable first mineral before a sedating herb." },
      { goal: "heart", grade: "B", effect: "Small blood-pressure drop", detail: "Meta-analyses find a small reduction in blood pressure, more noticeable when baseline intake or status is low." },
      { goal: "cognition", grade: "C", effect: "Migraine yes, memory no", detail: "Magnesium has a guideline-level role in migraine prevention. Memory claims, especially for threonate, are ahead of the evidence." },
      { goal: "gut", grade: "A", effect: "Osmotic laxative", detail: "Citrate and oxide pull water into the bowel. That is a feature if you are constipated and a bug if you are not." },
      { goal: "aging", grade: "B", effect: "Intake falls short", detail: "Many older adults miss the dietary target. A modest, well-tolerated salt is more rational than a twelve-ingredient sleep gummy." },
    ],
    cautions: [
      "Kidney disease can turn an ordinary dose into accumulation. Do not supplement magnesium if your kidneys are impaired unless a clinician has set the dose.",
      "Diarrhea is the usual overdose signal. Back off before you decide the brand is 'detoxing' you.",
      "Separate it from levothyroxine and some antibiotics by at least two to four hours.",
    ],
    interactions: [
      { with: "Levothyroxine", severity: "moderate", note: "Minerals bind the drug. Separate by at least four hours." },
      { with: "Tetracycline and quinolone antibiotics", severity: "moderate", note: "Magnesium reduces antibiotic absorption. Separate doses." },
      { with: "Bisphosphonates", severity: "moderate", note: "Separate by at least two hours." },
    ],
    whoShouldAvoid: [
      "People with significant chronic kidney disease unless a nephrologist agrees.",
      "Anyone using magnesium as a reason to ignore sleep apnea, alcohol, or a chaotic schedule.",
    ],
    keyStudies: [
      { title: "Magnesium and sleep in older adults", year: 2012, design: "Randomized double-blind trial", finding: "A modest improvement in subjective sleep measures in older adults with low-ish intake. Not a license for 10 mg of melatonin on top.", citation: "Abbasi et al., Journal of Research in Medical Sciences, 2012" },
      { title: "AAN/AHS migraine prevention guideline", year: 2012, design: "Evidence review", finding: "Magnesium is considered probably effective for migraine prevention. The dose used in studies is a real supplemental dose, not a dusting inside a blend.", citation: "Holland et al., Neurology, 2012" },
    ],
    sources: [
      { label: "NIH ODS magnesium fact sheet", url: "https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/" },
    ],
    goals: ["sleep", "stress", "heart", "cognition", "gut", "aging"],
    safetyFlags: flags({ pregnancy: "discuss", kidney: "avoid" }),
    timing: "Evening is fine for glycinate if sleep is the goal. Citrate can be taken earlier if it speeds the bowel. Always separate from thyroid hormone.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "creatine",
    name: "Creatine monohydrate",
    aliases: ["creatine", "creatine monohydrate", "creatine hcl"],
    category: "Performance",
    summary:
      "Creatine monohydrate is the best-studied performance supplement on the market. Taken daily alongside resistance training, it increases high-intensity work capacity and lean mass. Fancy salts and 'pH-buffered' versions have not beaten it. It is not a pre-workout stimulant, and it does not replace protein or sleep.",
    mechanism:
      "Creatine becomes phosphocreatine in muscle, regenerating ATP during short, hard efforts. Brain tissue also uses the phosphocreatine system, which is why sleep-deprivation studies got interesting — and why marketing got ahead of them.",
    evidenceGrade: "A",
    effectiveness: 92,
    safety: 88,
    primaryUse: "Strength, power, and lean mass with training",
    typicalDose: "3–5 g creatine monohydrate daily. A loading week is optional, not required. Take it any time of day, consistently.",
    upperLimit: "Healthy adults tolerate 3–5 g/day for years in trials. Doses above 10 g/day add GI upset more than benefit. Kidney disease is the hard stop.",
    doseRange: {
      unit: "g",
      alignedMin: 3,
      alignedMax: 5,
      highMax: 10,
      note: "Monohydrate grams, not a proprietary blend that 'includes creatine'.",
    },
    forms: [
      { name: "Monohydrate", note: "The studied form. Creapure is a purity brand, not a different molecule. Micronized just dissolves faster." },
      { name: "HCl, ethyl ester, buffered", note: "More expensive. No convincing advantage over monohydrate in outcomes that matter." },
    ],
    outcomes: [
      { goal: "muscle", grade: "A", effect: "Meaningful with lifting", detail: "ISSN's position stand is unambiguous: creatine plus resistance training improves strength and lean mass more than training alone." },
      { goal: "performance", grade: "A", effect: "Repeated high-intensity efforts", detail: "Best for efforts lasting seconds, repeated with short rest. It will not turn a fasted jog into a new physiology." },
      { goal: "cognition", grade: "C", effect: "Situational", detail: "Small studies suggest a benefit under sleep deprivation or in some older adults. It is not a focus drug for a rested 25-year-old." },
      { goal: "aging", grade: "B", effect: "Preserves training response", detail: "Older adults who lift respond to creatine. Older adults who do not lift should not expect a capsule to keep muscle." },
    ],
    cautions: [
      "Expect 1–2 kg of water weight inside the muscle. That is not fat, and it is not bloating in the way a high-sodium meal is.",
      "If you have kidney disease, do not start creatine because a podcast said it was universally safe.",
      "Serum creatinine may rise slightly and confuse a lazy lab read. Tell the clinician you take it before kidney labs are interpreted.",
    ],
    interactions: [
      { with: "Nephrotoxic drugs", severity: "moderate", note: "Combining creatine with drugs that stress the kidney should be a clinician's call, not a stack." },
      { with: "Caffeine", severity: "low", note: "Early concerns about caffeine cancelling creatine have not held up as a practical problem." },
    ],
    whoShouldAvoid: [
      "People with known kidney disease unless a nephrologist agrees.",
      "Pregnancy: there is not enough outcome data to recommend it as a prenatal supplement.",
      "Adolescents should not use it without a pediatric clinician and an actual training program.",
    ],
    keyStudies: [
      { title: "ISSN creatine position stand", year: 2017, design: "Evidence review of randomized trials", finding: "Monohydrate, 3–5 g/day, is effective and well tolerated in healthy people. Alternative forms are not superior.", citation: "Kreider et al., Journal of the International Society of Sports Nutrition, 2017" },
    ],
    sources: [
      { label: "NIH ODS exercise and athletic performance", url: "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/" },
    ],
    goals: ["muscle", "performance", "cognition", "aging"],
    safetyFlags: flags({ pregnancy: "avoid", kidney: "avoid" }),
    timing: "Daily, any time. Post-workout with a meal is convenient, not magical.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "melatonin",
    name: "Melatonin",
    aliases: ["melatonin"],
    category: "Hormone",
    summary:
      "Melatonin is a timing signal, not a sleeping pill. Low doses shift the clock and shave a few minutes off sleep latency. The 5 and 10 mg gummies on the shelf are often higher than trials needed, and independent tests have found products that do not match their labels. CBT-I still beats a bottle for chronic insomnia.",
    mechanism:
      "A pineal hormone that signals darkness to the circadian system. Supplemental melatonin advances or delays the clock depending on timing, and has a mild hypnotic effect.",
    evidenceGrade: "B",
    effectiveness: 70,
    safety: 68,
    primaryUse: "Jet lag, delayed sleep phase, and a small reduction in time to fall asleep",
    typicalDose: "0.5–3 mg, 30–60 minutes before the target bedtime. For jet lag, take it at the destination bedtime for a few nights.",
    upperLimit: "No official UL. Doses above 5 mg add morning grogginess and vivid dreams more reliably than they add sleep. Children should not be given melatonin without a clinician.",
    doseRange: {
      unit: "mg",
      alignedMin: 0.5,
      alignedMax: 3,
      highMax: 5,
      note: "Higher doses are common and usually unnecessary. Label accuracy in this category has been poor.",
    },
    forms: [
      { name: "Immediate release", note: "The default for sleep onset." },
      { name: "Prolonged release", note: "Studied more for sleep maintenance in older adults. Still not a substitute for insomnia therapy." },
    ],
    outcomes: [
      { goal: "sleep", grade: "B", effect: "Small but real for onset", detail: "Meta-analyses find roughly a 5–10 minute reduction in sleep latency. Helpful for jet lag and delayed sleep phase. Underwhelming as a cure for insomnia." },
      { goal: "stress", grade: "D", effect: "Not the tool", detail: "If the problem is hyperarousal rather than circadian timing, magnesium, a wind-down, and treating the stressor beat a hormone." },
    ],
    cautions: [
      "Do not give melatonin to children as a default. Behavioral sleep plans and a pediatric evaluation come first.",
      "Avoid in pregnancy and while trying to conceive unless a clinician specifically recommends it. Human outcome data are thin.",
      "Morning grogginess, headache, and vivid dreams are the usual 'too much' signals.",
      "Some over-the-counter products have tested well above or below the labeled dose. Buy from a brand that publishes an assay.",
    ],
    interactions: [
      { with: "Fluvoxamine", severity: "high", note: "Fluvoxamine markedly raises melatonin levels." },
      { with: "Sedatives and alcohol", severity: "moderate", note: "Additive drowsiness. Do not stack with benzodiazepines, Z-drugs, or a nightcap." },
      { with: "Immunosuppressants", severity: "moderate", note: "Melatonin has immune effects in experimental work. Transplant patients should not add it casually." },
      { with: "Warfarin", severity: "low", note: "Case-level concern. Mention it if your INR moves." },
    ],
    whoShouldAvoid: [
      "Pregnant people, unless a clinician has a specific reason.",
      "Children, unless a pediatric clinician is directing use.",
      "Anyone using it to push through untreated sleep apnea.",
    ],
    keyStudies: [
      { title: "Melatonin for sleep latency", year: 2013, design: "Meta-analysis of randomized trials", finding: "Melatonin shortened sleep latency by a small amount. The clinical effect is real and limited.", citation: "Ferracioli-Oda et al., PLOS ONE, 2013" },
      { title: "AASM insomnia guideline context", year: 2017, design: "Clinical practice guideline", finding: "Behavioral therapy is first-line for chronic insomnia. Melatonin is not the foundation of care.", citation: "Sateia et al., Journal of Clinical Sleep Medicine, 2017" },
    ],
    sources: [
      { label: "NIH ODS melatonin fact sheet", url: "https://ods.od.nih.gov/factsheets/Melatonin-HealthProfessional/" },
    ],
    goals: ["sleep"],
    safetyFlags: flags({
      pregnancy: "avoid",
      sedatives: "caution",
      immunosuppressants: "caution",
      moodMeds: "caution",
      warfarin: "caution",
    }),
    timing: "30–60 minutes before the bedtime you are trying to lock in. Timing is the intervention.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "vitamin-b12",
    name: "Vitamin B12",
    aliases: ["b12", "vitamin b12", "cobalamin", "methylcobalamin", "cyanocobalamin", "methyl b12"],
    category: "Vitamin",
    summary:
      "B12 corrects a deficiency that causes real fatigue, neuropathy, and anemia. It does not give energy to people whose level is fine. Vegans, adults over 50, long-term metformin, and long-term acid suppression are the groups that should actually think about it.",
    mechanism:
      "A cofactor for methionine synthase and methylmalonyl-CoA mutase. Deficiency impairs DNA synthesis and myelin. Absorption requires intrinsic factor, which is why high-dose oral B12 can still work when stomach acid is low: a small fraction absorbs passively.",
    evidenceGrade: "A",
    effectiveness: 90,
    safety: 94,
    primaryUse: "Preventing and treating vitamin B12 deficiency",
    typicalDose: "2.4 mcg/day meets the RDA if absorption is normal. When absorption is the problem, oral doses of 250–1,000 mcg/day are commonly used. Injections are for confirmed malabsorption or severe deficiency.",
    upperLimit: "No established upper limit. Excess is excreted. The risk is not toxicity — it is treating the wrong cause of fatigue, or masking a diagnosis that needed a lab.",
    doseRange: {
      unit: "mcg",
      alignedMin: 250,
      alignedMax: 1000,
      highMax: 5000,
      note: "Range for people with an absorption reason. A multivitamin at 6 mcg is enough only if you absorb B12 normally.",
    },
    forms: [
      { name: "Cyanocobalamin", note: "Stable, cheap, and well studied. A fine default for most people." },
      { name: "Methylcobalamin", note: "Active form. Reasonable, not clearly superior for deficiency treatment in head-to-head outcomes." },
      { name: "Hydroxocobalamin", note: "Often used for injections. Retention may be longer than cyano." },
    ],
    outcomes: [
      { goal: "energy", grade: "A", effect: "Only if deficient", detail: "Replacing B12 in deficiency restores energy because it treats the cause. If the level is normal, another lozenge will not wake you up." },
      { goal: "cognition", grade: "B", effect: "Prevents deficiency harm", detail: "Deficiency can cause cognitive change and neuropathy. Supplementing replete adults does not enhance memory." },
      { goal: "aging", grade: "A", effect: "Absorption declines", detail: "Atrophic gastritis and acid-suppressing drugs make food B12 harder to free. Adults over 50 are a core audience." },
      { goal: "pregnancy", grade: "B", effect: "Cover the gap", detail: "Important in vegan and vegetarian pregnancies. A prenatal should include it; a megadose is not the point." },
    ],
    cautions: [
      "Do not self-treat numbness, gait change, or a smooth red tongue with a gummy and skip the lab. Those symptoms need a diagnosis.",
      "High-dose folate can mask the anemia of B12 deficiency while nerve damage continues. Another reason not to megadose folic acid blindly.",
    ],
    interactions: [
      { with: "Metformin", severity: "moderate", note: "Long-term metformin lowers B12 status. Periodic testing is wiser than assuming a multivitamin covered it." },
      { with: "Proton pump inhibitors and H2 blockers", severity: "moderate", note: "Years of acid suppression reduce food-bound B12 absorption." },
    ],
    whoShouldAvoid: [
      "Nobody needs to fear a standard dose. The people who should pause are those using B12 to avoid a workup for fatigue or neuropathy.",
    ],
    keyStudies: [
      { title: "Oral versus intramuscular B12", year: 2018, design: "Cochrane review", finding: "High-dose oral B12 can correct deficiency for many patients. Severe neurologic deficiency still needs urgent medical care, not a shopping decision.", citation: "Wang et al., Cochrane Database of Systematic Reviews, 2018" },
    ],
    sources: [
      { label: "NIH ODS vitamin B12 fact sheet", url: "https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/" },
    ],
    goals: ["energy", "cognition", "aging", "pregnancy"],
    safetyFlags: flags({ pregnancy: "discuss" }),
    timing: "Any time of day, with or without food. Sublingual is fine; it is not clearly better than swallowing the tablet.",
    testFirst: true,
    herb: false,
  },
  {
    slug: "folate",
    name: "Folate",
    aliases: ["folate", "folic acid", "methylfolate", "5-mthf", "vitamin b9", "l-methylfolate"],
    category: "Vitamin",
    summary:
      "Folic acid before conception and in early pregnancy prevents neural tube defects. That is one of the clearest wins in all of nutrition. Methylfolate is heavily marketed for MTHFR variants; most people do not need it, and the outcome trials that changed prenatal care used folic acid.",
    mechanism:
      "Folate carries one-carbon units for DNA synthesis and methylation. Folic acid is the stable synthetic form used in fortification and in the trials that reduced neural tube defects.",
    evidenceGrade: "A",
    effectiveness: 95,
    safety: 72,
    primaryUse: "Neural tube defect prevention and treatment of folate deficiency",
    typicalDose: "400 mcg folic acid daily for people who could become pregnant, started at least a month before conception. 600 mcg DFE is the pregnancy RDA. Some higher-risk pregnancies are prescribed 4 mg — that is a prescription, not a pantry decision.",
    upperLimit: "1,000 mcg/day from fortified food and supplements for adults, mainly to avoid masking B12 deficiency. Food folate is not the concern.",
    doseRange: {
      unit: "mcg",
      alignedMin: 400,
      alignedMax: 800,
      highMax: 1000,
      note: "Folic acid micrograms for prenatal prevention. Do not compare a 15 mg prescription methylfolate product to this range.",
    },
    forms: [
      { name: "Folic acid", note: "The form with neural-tube outcome data and the form used in fortification. Default for pregnancy prevention." },
      { name: "5-MTHF / methylfolate", note: "A reasonable folate source. Not required for most MTHFR variants, despite the ads." },
      { name: "Folinic acid", note: "Used in specific medical settings. Not a better prenatal by default." },
    ],
    outcomes: [
      { goal: "pregnancy", grade: "A", effect: "Prevents neural tube defects", detail: "Starting 400 mcg folic acid before conception is the intervention. Waiting until the positive test is later than the biology." },
      { goal: "energy", grade: "B", effect: "Only if deficient", detail: "Folate deficiency causes anemia. Supplementing a replete person does not create energy." },
      { goal: "mood", grade: "C", effect: "Adjunct in specific cases", detail: "L-methylfolate has been studied as an adjunct in depression, particularly with low folate status. It is not a first-line antidepressant and it is not risk-free with other serotonergic plans at high doses." },
    ],
    cautions: [
      "High folic acid can mask the blood findings of B12 deficiency. Check B12 if there is anemia, neuropathy, or a vegan diet plus heavy folate supplementation.",
      "A common MTHFR variant is not, by itself, a reason to buy an expensive methylated stack.",
    ],
    interactions: [
      { with: "Methotrexate", severity: "high", note: "Folate interaction is intentional in some protocols and harmful in others. Never add folate to methotrexate without the prescribing clinician." },
      { with: "Anticonvulsants", severity: "moderate", note: "Some seizure medicines lower folate and folate can affect drug levels. Coordinate with neurology." },
    ],
    whoShouldAvoid: [
      "People with unexplained anemia until B12 status is known.",
      "Anyone on methotrexate unless folate is part of the prescribed plan.",
    ],
    keyStudies: [
      { title: "MRC Vitamin Study", year: 1991, design: "Randomized prevention trial", finding: "Folic acid around conception sharply reduced neural tube defect recurrence. This is why the recommendation exists.", citation: "MRC Vitamin Study Research Group, Lancet, 1991" },
    ],
    sources: [
      { label: "NIH ODS folate fact sheet", url: "https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/" },
    ],
    goals: ["pregnancy", "energy", "mood"],
    safetyFlags: flags({ pregnancy: "core", moodMeds: "caution" }),
    timing: "Daily, any time. For pregnancy prevention, the month before conception matters more than the hour of the day.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "iron",
    name: "Iron",
    aliases: ["iron", "ferrous sulfate", "ferrous bisglycinate", "iron bisglycinate", "ferritin"],
    category: "Mineral",
    summary:
      "Iron treats iron deficiency. It does not treat ordinary tiredness, and extra iron is genuinely harmful if you do not need it. Men and postmenopausal adults should not take an 18 mg multi 'for energy' without a ferritin result. Bisglycinate is often gentler than sulfate; the lab still comes first.",
    mechanism:
      "Iron is required for hemoglobin and for dozens of enzymes. Absorption is tightly regulated because the body has no active iron-excretion pathway. That is why overload accumulates.",
    evidenceGrade: "A",
    effectiveness: 93,
    safety: 48,
    primaryUse: "Treating iron deficiency and supporting pregnancy needs",
    typicalDose: "For confirmed deficiency, elemental doses in the 40–65 mg range are common, sometimes every other day to improve absorption and tolerance. Prenatal products often contain about 27 mg. Do not start either without a reason.",
    upperLimit: "45 mg/day is the adult upper level for iron from supplements and fortified foods, set because of gastrointestinal harm. Therapeutic courses can exceed it under supervision.",
    doseRange: {
      unit: "mg",
      alignedMin: 18,
      alignedMax: 65,
      highMax: 100,
      note: "Elemental iron. Therapeutic and potentially harmful. Population fit matters more than the milligram.",
    },
    forms: [
      { name: "Bisglycinate", note: "Often fewer stomach side effects at a given elemental dose. A good form once a clinician agrees you need iron." },
      { name: "Ferrous sulfate", note: "The cheapest studied form. Effective, and more likely to cause nausea or constipation." },
      { name: "Ferrous fumarate", note: "Another standard salt. Compare elemental iron, not tablet weight." },
    ],
    outcomes: [
      { goal: "energy", grade: "A", effect: "Restores what deficiency took", detail: "If ferritin is low, iron is the treatment. If ferritin is normal, iron is a risk." },
      { goal: "pregnancy", grade: "A", effect: "Standard, clinician-guided", detail: "Pregnancy increases iron need. A prenatal dose is usual, and the exact dose should follow hemoglobin and ferritin, not a blog." },
      { goal: "cognition", grade: "B", effect: "In deficiency", detail: "Iron deficiency, even before anemia, can impair concentration. The fix is repletion, confirmed by labs." },
      { goal: "performance", grade: "B", effect: "In deficient athletes", detail: "Endurance athletes, especially menstruating athletes, lose iron. Screening beats a pre-workout that happens to contain iron." },
    ],
    cautions: [
      "Hemochromatosis and other iron-loading states make supplements dangerous. Family history of iron overload is a reason to test, not a reason to push through.",
      "Constipation, nausea, and dark stools are common. Every-other-day dosing often works as well and is easier to live with.",
      "Keep bottles away from children. Iron overdose is a classic pediatric emergency.",
    ],
    interactions: [
      { with: "Levothyroxine", severity: "high", note: "Iron binds thyroid hormone. Separate by at least four hours." },
      { with: "Tetracyclines and quinolones", severity: "high", note: "Iron can make the antibiotic fail. Separate doses." },
      { with: "Calcium, tea, coffee, and high-dose zinc", severity: "moderate", note: "These reduce iron absorption. Vitamin C with the dose improves it." },
    ],
    whoShouldAvoid: [
      "Adults without a documented reason, especially men and postmenopausal people.",
      "Anyone with hemochromatosis, unexplained high ferritin, or a history of iron overload.",
      "Children, except under pediatric direction.",
    ],
    keyStudies: [
      { title: "Alternate-day oral iron", year: 2017, design: "Randomized crossover studies of absorption", finding: "Every-other-day dosing raised fractional absorption and may reduce side effects compared with daily dosing in iron-depleted women.", citation: "Stoffel et al., Lancet Haematology, 2017" },
    ],
    sources: [
      { label: "NIH ODS iron fact sheet", url: "https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/" },
    ],
    goals: ["energy", "pregnancy", "cognition", "performance"],
    safetyFlags: flags({ pregnancy: "discuss", kidney: "caution" }),
    timing: "On an empty stomach if you tolerate it, with vitamin C, away from coffee, tea, calcium, and thyroid medication. Evening can reduce nausea for some people.",
    testFirst: true,
    herb: false,
  },
  {
    slug: "zinc",
    name: "Zinc",
    aliases: ["zinc", "zinc gluconate", "zinc acetate", "zinc picolinate", "zinc citrate"],
    category: "Mineral",
    summary:
      "Zinc matters if you are deficient, and a lozenge started early may shorten a cold by a small amount. Chronic high doses are a good way to deplete copper and distort your sense of smell if someone sells you a nasal form. The adult ceiling is 40 mg/day from supplements.",
    mechanism:
      "Zinc is catalytic and structural in hundreds of enzymes and in immune cell signaling. Lozenges are thought to act locally in the throat; swallowing a tablet is not the same experiment.",
    evidenceGrade: "B",
    effectiveness: 68,
    safety: 70,
    primaryUse: "Correcting deficiency; possible modest reduction in cold duration",
    typicalDose: "8–11 mg/day meets most adult needs from food plus a modest supplement. Cold lozenges in trials often provided 75 mg/day or more of specific salts, briefly, not all winter.",
    upperLimit: "40 mg/day for adults from supplements and fortified foods. Above that, copper deficiency and immune oddities show up. Never use intranasal zinc.",
    doseRange: {
      unit: "mg",
      alignedMin: 8,
      alignedMax: 25,
      highMax: 40,
      note: "Daily maintenance range. Short-course lozenges are a separate, time-limited use.",
    },
    forms: [
      { name: "Gluconate or acetate lozenge", note: "The forms used in cold studies. They have to be sucked, not swallowed, and started in the first day." },
      { name: "Citrate, picolinate, bisglycinate", note: "Fine for ordinary supplementation. Picolinate is not a proven upgrade." },
      { name: "Oxide", note: "Lower absorption. Common because it is cheap." },
    ],
    outcomes: [
      { goal: "immunity", grade: "B", effect: "Shortens a cold slightly if timed", detail: "Lozenges started within 24 hours have reduced cold duration in several trials. Prevention data are weaker. A winter-long 50 mg tablet is not the protocol." },
      { goal: "skin", grade: "C", effect: "Deficiency only", detail: "Zinc deficiency affects skin and wound healing. Acne studies are mixed and doses are often high enough to threaten copper." },
      { goal: "aging", grade: "C", effect: "Appetite and immunity if low", detail: "Older adults with poor intake can be low. A standard multi usually covers it; a standalone 50 mg product usually does not need to." },
    ],
    cautions: [
      "Intranasal zinc has caused lasting loss of smell. Do not use it.",
      "Months of high-dose zinc cause copper deficiency, anemia, and neurologic symptoms.",
      "Nausea is common if you take it fasted.",
    ],
    interactions: [
      { with: "Quinolone and tetracycline antibiotics", severity: "high", note: "Separate by several hours or the antibiotic may not work." },
      { with: "Penicillamine", severity: "high", note: "Zinc reduces penicillamine absorption." },
      { with: "Copper", severity: "moderate", note: "High zinc blocks copper absorption. This is used therapeutically in Wilson disease and accidentally everywhere else." },
    ],
    whoShouldAvoid: [
      "Anyone considering a nasal zinc product.",
      "People already in a high-dose zinc protocol for a medical reason — do not stack another.",
    ],
    keyStudies: [
      { title: "Zinc lozenges for the common cold", year: 2017, design: "Meta-analysis of randomized trials", finding: "Properly formulated lozenges shortened colds in several trials. Formulation and timing decided whether the result showed up.", citation: "Hemilä, JRSM Open, 2017" },
    ],
    sources: [
      { label: "NIH ODS zinc fact sheet", url: "https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/" },
    ],
    goals: ["immunity", "skin", "aging"],
    safetyFlags: flags({ pregnancy: "discuss" }),
    timing: "With food if it nauseates you. Lozenges are taken repeatedly across the waking day at the start of a cold, not as a single bedtime pill.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "vitamin-c",
    name: "Vitamin C",
    aliases: ["vitamin c", "ascorbic acid", "ascorbate"],
    category: "Vitamin",
    summary:
      "Vitamin C prevents scurvy at modest intakes and slightly shortens colds for some people. It does not stop you catching routine colds, and 1,000 mg gummies are mostly expensive urine plus a little stomach acid. People under extreme physical stress are the exception where prevention data exist.",
    mechanism:
      "An electron donor required for collagen synthesis, carnitine, and several neurotransmitters, and it improves non-heme iron absorption when eaten with the iron source.",
    evidenceGrade: "B",
    effectiveness: 60,
    safety: 84,
    primaryUse: "Covering a dietary gap and a small effect on cold duration",
    typicalDose: "75–200 mg/day covers physiologic need for most adults. Cold trials often used 200–1,000 mg/day. Splitting doses improves absorption.",
    upperLimit: "2,000 mg/day for adults. Above that, diarrhea and, in susceptible people, kidney stones.",
    doseRange: {
      unit: "mg",
      alignedMin: 75,
      alignedMax: 500,
      highMax: 2000,
      note: "More than 500 mg at once is poorly retained. Megadoses are not a stronger immune system.",
    },
    forms: [
      { name: "Ascorbic acid", note: "The studied form. Cheap and appropriate." },
      { name: "Mineral ascorbates", note: "Buffered and gentler on the stomach. Not more effective." },
      { name: "Liposomal", note: "A price increase. Not needed to prevent scurvy or to shorten a cold." },
    ],
    outcomes: [
      { goal: "immunity", grade: "B", effect: "Duration, not prevention", detail: "Routine supplementation does not prevent colds in the general population. It may shorten them by a little. Prevention evidence is in people under severe physical stress." },
      { goal: "skin", grade: "C", effect: "Dietary adequacy", detail: "Scurvy destroys collagen. Once you are replete, oral vitamin C will not outrun sunscreen and a retinoid." },
      { goal: "energy", grade: "D", effect: "No", detail: "If you are not deficient, vitamin C is not an energy supplement." },
    ],
    cautions: [
      "High doses increase oxalate and can contribute to kidney stones in people who already form them.",
      "Stop high-dose vitamin C before some lab tests if your clinician asks. It can interfere with certain assays.",
    ],
    interactions: [
      { with: "Iron", severity: "low", note: "Increases non-heme iron absorption. Helpful if you are deficient, unhelpful if you are not." },
      { with: "Aluminum antacids", severity: "low", note: "Vitamin C can increase aluminum absorption. Separate them if you use both." },
    ],
    whoShouldAvoid: [
      "People with recurrent oxalate kidney stones should avoid gram doses.",
      "Anyone with iron overload should not use vitamin C as an absorption booster.",
    ],
    keyStudies: [
      { title: "Vitamin C for the common cold", year: 2013, design: "Cochrane review", finding: "No reduction in cold incidence in the general community. A small reduction in duration. Incidence fell in trials of extreme physical stress.", citation: "Hemilä and Chalker, Cochrane Database of Systematic Reviews, 2013" },
    ],
    sources: [
      { label: "NIH ODS vitamin C fact sheet", url: "https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/" },
    ],
    goals: ["immunity", "skin"],
    safetyFlags: flags({ pregnancy: "ok", kidney: "caution" }),
    timing: "Split across the day if the dose is large. With an iron-containing meal if iron absorption is the point.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "probiotics",
    name: "Probiotics",
    aliases: ["probiotic", "probiotics", "lactobacillus", "bifidobacterium", "saccharomyces boulardii", "lacticaseibacillus"],
    category: "Probiotic",
    summary:
      "A probiotic is a strain, not a vibe. Lactobacillus rhamnosus GG and Saccharomyces boulardii have decent evidence for preventing antibiotic-associated diarrhea. A 40-strain refrigerated blend with no strain IDs has a label, not a trial. Immunocompromised people should not experiment.",
    mechanism:
      "Live microorganisms given for a specific host effect: competing with pathogens, altering bile acids, and interacting with gut immune tissue. Effects do not transfer from one strain to another.",
    evidenceGrade: "B",
    effectiveness: 64,
    safety: 74,
    primaryUse: "Preventing antibiotic-associated diarrhea with named strains",
    typicalDose: "Strain-specific. For antibiotic-associated diarrhea, studied products are often in the 10 billion CFU/day range for L. rhamnosus GG, or 250–500 mg of S. boulardii, started with the antibiotic and continued a week after.",
    upperLimit: "No universal UL. The risk is not a number — it is using live organisms when your immune system or gut barrier cannot handle them.",
    doseRange: {
      unit: "CFU",
      alignedMin: 1000000000,
      alignedMax: 20000000000,
      highMax: 100000000000,
      note: "A rough CFU window. The strain name decides whether the number means anything.",
    },
    forms: [
      { name: "Lacticaseibacillus rhamnosus GG", note: "One of the few strains with repeated antibiotic-diarrhea data." },
      { name: "Saccharomyces boulardii", note: "A yeast, so an antibacterial antibiotic does not kill it. Separate from antifungals. Studied for antibiotic-associated diarrhea." },
      { name: "Unspecified multi-strain blends", note: "Cannot be graded as a class. If the label hides strain IDs, the evidence cannot follow you home." },
    ],
    outcomes: [
      { goal: "gut", grade: "B", effect: "Specific, not general", detail: "Best evidence is prevention of antibiotic-associated diarrhea with named strains. IBS results are strain-specific and mixed. 'Gut reset' is not a clinical endpoint." },
      { goal: "immunity", grade: "C", effect: "Indirect", detail: "Some respiratory-infection trials exist and are heterogeneous. Do not buy a probiotic as your immune plan." },
    ],
    cautions: [
      "Severely immunocompromised people, people with central lines, and critically ill patients have developed infections from probiotic organisms. Rare, and not theoretical.",
      "CFU at manufacture is not CFU at expiry. Look for a guarantee through the end of shelf life.",
      "Start and stop around antibiotics with a plan: bacteria-based probiotics a few hours away from the antibiotic dose; S. boulardii is the exception that survives antibacterials.",
    ],
    interactions: [
      { with: "Antibiotics", severity: "moderate", note: "Antibiotics kill bacterial probiotics if taken together. Separate by a few hours. They do not kill S. boulardii." },
      { with: "Antifungals", severity: "moderate", note: "Antifungals can inactivate S. boulardii." },
      { with: "Immunosuppressants", severity: "high", note: "Live supplements are a specialist decision in transplant and profound immunosuppression." },
    ],
    whoShouldAvoid: [
      "People who are severely immunocompromised, have a central venous catheter, or are critically ill, unless the medical team recommends a specific product.",
      "Anyone with a yeast allergy considering S. boulardii.",
    ],
    keyStudies: [
      { title: "Probiotics for antibiotic-associated diarrhea", year: 2021, design: "Cochrane review", finding: "Evidence supports a reduction in antibiotic-associated diarrhea, with important differences by strain and a still-imperfect evidence base.", citation: "Guo et al., Cochrane Database of Systematic Reviews, 2021" },
    ],
    sources: [
      { label: "NIH ODS probiotics fact sheet", url: "https://ods.od.nih.gov/factsheets/Probiotics-HealthProfessional/" },
    ],
    goals: ["gut", "immunity"],
    safetyFlags: flags({ pregnancy: "discuss", immunosuppressants: "avoid", liver: "caution" }),
    timing: "A few hours away from an antibiotic dose if the product is bacterial. Continue for about a week after the antibiotic course if diarrhea prevention is the goal.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "psyllium",
    name: "Psyllium husk",
    aliases: ["psyllium", "psyllium husk", "ispaghula", "metamucil"],
    category: "Fiber",
    summary:
      "Psyllium is unglamorous and unusually well supported. A few grams a day improves constipation and can lower LDL cholesterol enough that regulators allow a health claim. It will not flatten glucose by itself, and it will bind your medications if you swallow them together.",
    mechanism:
      "A viscous soluble fiber. It holds water in the stool and traps bile acids, which pulls LDL down a notch when the dose is real and the water glass is not optional.",
    evidenceGrade: "A",
    effectiveness: 84,
    safety: 82,
    primaryUse: "Regularity and a modest LDL reduction",
    typicalDose: "5–10 g/day, split, each dose with a full glass of water. Start at 3–5 g if you are not used to fiber.",
    upperLimit: "No formal UL. Obstruction risk rises if you take dry scoops without water, or if you have a swallowing or narrowing problem.",
    doseRange: {
      unit: "g",
      alignedMin: 5,
      alignedMax: 10,
      highMax: 15,
      note: "Grams of psyllium husk, with water. A capsule that holds 0.5 g is a gesture.",
    },
    forms: [
      { name: "Husk powder", note: "The practical way to reach a studied dose." },
      { name: "Capsules", note: "Fine if you are willing to swallow enough of them. Most people are not." },
    ],
    outcomes: [
      { goal: "gut", grade: "A", effect: "Reliable regularity", detail: "Viscous fiber softens hard stool and adds form to loose stool. It is one of the few supplements that can do both, given enough water." },
      { goal: "heart", grade: "A", effect: "Modest LDL drop", detail: "About 7 g/day of soluble fiber from psyllium has an FDA-recognized claim for reducing coronary risk as part of a diet low in saturated fat." },
      { goal: "glucose", grade: "B", effect: "Blunts the spike a little", detail: "Taken with a meal, viscous fiber slows absorption. Useful adjunct, irrelevant if the rest of the plate does not change." },
    ],
    cautions: [
      "Always take with water. A dry dose can swell in the esophagus.",
      "Bloating is common in week one. Increase slowly.",
      "Separate from oral medicines by at least 2 hours so the fiber does not carry the drug out.",
    ],
    interactions: [
      { with: "Most oral medications", severity: "moderate", note: "Separate by 2 hours. This includes thyroid hormone, diabetes tablets, and antidepressants." },
      { with: "Carbamazepine and lithium", severity: "moderate", note: "Absorption can fall. Do not improvise if you take either." },
    ],
    whoShouldAvoid: [
      "People with esophageal narrowing, difficulty swallowing, or bowel obstruction.",
      "Anyone unwilling to drink a full glass of water with the dose.",
    ],
    keyStudies: [
      { title: "Psyllium and LDL cholesterol", year: 2018, design: "Meta-analysis of randomized trials", finding: "Psyllium produced a modest, consistent LDL reduction on top of diet.", citation: "Jovanovski et al., American Journal of Clinical Nutrition, 2018" },
    ],
    sources: [
      { label: "FDA soluble fiber and heart disease claim context", url: "https://ods.od.nih.gov/factsheets/Fiber-HealthProfessional/" },
    ],
    goals: ["gut", "heart", "glucose"],
    safetyFlags: flags({ pregnancy: "discuss" }),
    timing: "With water, away from medicines. Before a meal if glucose is the target; any consistent time if cholesterol is.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "ashwagandha",
    name: "Ashwagandha",
    aliases: ["ashwagandha", "withania", "withania somnifera", "ksm-66", "sensoril"],
    category: "Botanical",
    summary:
      "Ashwagandha root extract has a moderate evidence base for perceived stress and anxiety, usually at 300–600 mg/day of a standardized extract. It is not a sedative to stack freely, it can nudge thyroid hormones, and rare liver-injury reports mean 'natural' is not a safety argument.",
    mechanism:
      "Withanolides are the marker compounds. Human studies suggest lower perceived stress and, in some trials, lower morning cortisol. The pathway is not a license to combine it with every downer in the cabinet.",
    evidenceGrade: "B",
    effectiveness: 66,
    safety: 58,
    primaryUse: "Perceived stress and mild anxiety",
    typicalDose: "300–600 mg/day of a root extract standardized for withanolides, often KSM-66 or Sensoril, for 6–8 weeks in trials.",
    upperLimit: "No official UL. Case reports of liver injury cluster with supplements, sometimes multi-ingredient. Stop and get labs if you become jaundiced, unusually itchy, or profoundly fatigued.",
    doseRange: {
      unit: "mg",
      alignedMin: 300,
      alignedMax: 600,
      highMax: 1000,
      note: "Root extract, not raw root powder weight. A 50 mg sprinkle in a gummy is not the studied dose.",
    },
    forms: [
      { name: "KSM-66 root extract", note: "A common trial form. Standardized, still not risk-free." },
      { name: "Sensoril root and leaf", note: "Also studied. Leaf-inclusive extracts are not interchangeable with root-only by milligram." },
      { name: "Raw powder", note: "Traditional, poorly matched to the doses and extracts in modern trials." },
    ],
    outcomes: [
      { goal: "stress", grade: "B", effect: "Modest", detail: "Several randomized trials show lower perceived stress scores over 6–8 weeks. Effect sizes are modest. Sleep often improves because people are less wired, not because it is melatonin." },
      { goal: "sleep", grade: "C", effect: "Secondary", detail: "Some trials show better sleep quality in stressed adults. It is a weak choice if circadian timing is the actual problem." },
      { goal: "performance", grade: "C", effect: "Small VO2 and strength signals", detail: "A few trials suggest small training benefits. Creatine has a much cleaner file for strength." },
      { goal: "cognition", grade: "I", effect: "Not established", detail: "Marketing is ahead of durable cognitive outcomes in healthy adults." },
    ],
    cautions: [
      "Rare cases of herb-induced liver injury have been linked to ashwagandha products. Stop immediately if skin or eyes yellow.",
      "It may increase thyroid hormone. People with thyroid disease or on levothyroxine should not add it quietly.",
      "Traditional use includes pregnancy avoidance. Do not use it while pregnant or trying to conceive.",
      "Can add to sedation from alcohol, benzodiazepines, and sleep medicines.",
    ],
    interactions: [
      { with: "Thyroid hormone", severity: "moderate", note: "May raise thyroid hormone levels and destabilize a careful dose." },
      { with: "Sedatives", severity: "moderate", note: "Additive drowsiness." },
      { with: "Immunosuppressants", severity: "moderate", note: "Immune-modulating herbs are a poor idea on transplant drugs." },
    ],
    whoShouldAvoid: [
      "Pregnant people and those trying to conceive.",
      "People with thyroid disease unless their clinician is monitoring.",
      "Anyone with liver disease or prior supplement-related liver injury.",
      "People on sedatives who already feel oversedated.",
    ],
    keyStudies: [
      { title: "KSM-66 and stress", year: 2012, design: "Randomized double-blind trial", finding: "A standardized root extract reduced perceived stress scores more than placebo over 60 days in stressed adults.", citation: "Chandrasekhar et al., Indian Journal of Psychological Medicine, 2012" },
    ],
    sources: [
      { label: "NIH ODS ashwagandha fact sheet", url: "https://ods.od.nih.gov/factsheets/Ashwagandha-HealthProfessional/" },
    ],
    goals: ["stress", "sleep", "performance"],
    safetyFlags: flags({
      pregnancy: "avoid",
      liver: "caution",
      thyroid: "caution",
      sedatives: "caution",
      immunosuppressants: "avoid",
    }),
    timing: "With food, earlier in the day if it feels heavy, or evening if sleep is the target and you are not on other sedatives.",
    testFirst: false,
    herb: true,
  },
  {
    slug: "curcumin",
    name: "Curcumin",
    aliases: ["curcumin", "turmeric", "curcuma", "curcuma longa", "meriva", "theracurmin"],
    category: "Botanical",
    summary:
      "Kitchen turmeric is not the dose used in osteoarthritis trials. Plain curcumin is poorly absorbed. Enhanced formulations have modest pain data. Piperine raises absorption and also raises the level of drugs you did not intend to boost. Gallbladder disease is a reason to stay away.",
    mechanism:
      "Curcuminoids modulate inflammatory signaling in experimental systems. Blood levels from plain powder are low, which is why trials use phytosomes, nanoparticles, or piperine — each with its own tradeoff.",
    evidenceGrade: "C",
    effectiveness: 55,
    safety: 64,
    primaryUse: "Modest osteoarthritis symptom support with an absorbable form",
    typicalDose: "About 500–1,000 mg/day of an enhanced curcumin formulation in joint trials, for at least 4–8 weeks. A teaspoon of culinary turmeric is food, not that dose.",
    upperLimit: "No official UL. Gastrointestinal upset increases with dose. Stop for signs of liver injury. Do not use piperine-boosted products if you take medicines with a narrow safety margin.",
    doseRange: {
      unit: "mg",
      alignedMin: 500,
      alignedMax: 1000,
      highMax: 2000,
      note: "Enhanced curcuminoid dose, not raw turmeric powder and not a 50 mg gummy.",
    },
    forms: [
      { name: "Phytosome (e.g. Meriva)", note: "Better characterized absorption. Still a symptom adjunct, not a disease modifier." },
      { name: "Curcumin plus piperine", note: "Piperine inhibits drug metabolism. That is the point, and the problem." },
      { name: "Culinary turmeric", note: "A fine spice. Not a therapeutic curcumin dose." },
    ],
    outcomes: [
      { goal: "joint", grade: "C", effect: "Modest pain relief", detail: "Several small trials of enhanced curcumin show small-to-moderate reductions in osteoarthritis pain. Quality is uneven. It does not rebuild cartilage." },
      { goal: "aging", grade: "C", effect: "Marker changes exceed outcomes", detail: "Inflammatory markers sometimes move. That is not the same as a proven aging or heart benefit." },
    ],
    cautions: [
      "Gallstones and bile duct obstruction are reasons not to experiment. Curcumin can increase gallbladder contraction.",
      "Liver-injury reports exist, often with enhanced or multi-ingredient products. Yellow eyes are an emergency, not a detox sign.",
      "Pregnancy: skip therapeutic curcumin doses.",
    ],
    interactions: [
      { with: "Anticoagulants and antiplatelets", severity: "moderate", note: "May add to bleeding risk. Stop before surgery and do not combine with warfarin casually." },
      { with: "Piperine-sensitive drugs", severity: "high", note: "If the formula contains piperine or black pepper extract, it can raise levels of many CYP3A4 and P-gp drugs." },
    ],
    whoShouldAvoid: [
      "People with gallbladder disease.",
      "Pregnant people at therapeutic doses.",
      "Anyone on warfarin unless the prescriber knows and agrees.",
    ],
    keyStudies: [
      { title: "Curcumin for osteoarthritis", year: 2021, design: "Systematic review of randomized trials", finding: "Small trials suggest symptom improvement with enhanced formulations. Evidence is promising and not definitive.", citation: "Paultre et al., BMJ Open Sport & Exercise Medicine, 2021" },
    ],
    sources: [
      { label: "NIH ODS turmeric fact sheet", url: "https://ods.od.nih.gov/factsheets/Turmeric-HealthProfessional/" },
    ],
    goals: ["joint", "aging"],
    safetyFlags: flags({
      pregnancy: "avoid",
      liver: "caution",
      bleeding: "caution",
      warfarin: "caution",
    }),
    timing: "With food. Stop a week before elective surgery unless your surgeon says otherwise.",
    testFirst: false,
    herb: true,
  },
];

export const ingredientSeed: IngredientRecord[] = [
  ...coreIngredients,
  ...moreIngredients,
  ...restIngredients,
];
