import type { IngredientRecord, SafetyFlags } from "@/data/types";

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

export const moreIngredients: IngredientRecord[] = [
  {
    slug: "collagen",
    name: "Collagen peptides",
    aliases: ["collagen", "collagen peptides", "hydrolyzed collagen", "marine collagen"],
    category: "Protein",
    summary:
      "Hydrolyzed collagen at 2.5–10 g/day has modest trial data for skin elasticity and a smaller file for joint comfort. Your body does not mail the peptides to your face. It is a specific protein, not a structural transplant, and it is not vegan.",
    mechanism:
      "Collagen peptides are absorbed as amino acids and small peptides, including hydroxyproline-containing fragments that may signal fibroblasts. The clinical signal is modest and slow.",
    evidenceGrade: "C",
    effectiveness: 52,
    safety: 86,
    primaryUse: "Modest skin elasticity support",
    typicalDose: "2.5–10 g/day of hydrolyzed collagen peptides for 8–12 weeks in skin trials. Joint trials often use around 10 g.",
    upperLimit: "No established UL. It counts toward daily protein. People with kidney disease should not add protein powders casually.",
    doseRange: {
      unit: "g",
      alignedMin: 2.5,
      alignedMax: 15,
      highMax: 20,
      note: "Peptide grams. A capsule with 500 mg is below the doses used in skin trials.",
    },
    forms: [
      { name: "Bovine peptides", note: "The most common trial material for skin and joint outcomes." },
      { name: "Marine peptides", note: "Also studied. A fish allergy is a hard no." },
    ],
    outcomes: [
      { goal: "skin", grade: "C", effect: "Modest elasticity change", detail: "Several randomized trials show small improvements in elasticity and wrinkles at 8–12 weeks. Expect subtle, not a filter." },
      { goal: "joint", grade: "C", effect: "Small comfort signal", detail: "Some activity-related joint pain trials are positive. It is not a disease-modifying osteoarthritis drug." },
    ],
    cautions: [
      "Not appropriate for fish or bovine-product allergies, depending on the source.",
      "Flavorless powders are easy to stack onto an already high protein intake. That matters in kidney disease.",
    ],
    interactions: [
      { with: "No major drug interactions", severity: "low", note: "The practical issue is allergy and total protein load, not cytochrome enzymes." },
    ],
    whoShouldAvoid: [
      "People with the relevant animal-source allergy.",
      "Anyone expecting hair regrowth. That claim is not what the skin trials showed.",
    ],
    keyStudies: [
      { title: "Collagen peptides and skin aging", year: 2019, design: "Systematic review of randomized trials", finding: "Short-term supplementation improved skin elasticity and hydration by a small amount in several trials.", citation: "Choi et al., Journal of Drugs in Dermatology, 2019" },
    ],
    sources: [
      { label: "NIH ODS protein and skin context via consumer supplements page", url: "https://ods.od.nih.gov/factsheets/list-all/" },
    ],
    goals: ["skin", "joint"],
    safetyFlags: flags({ pregnancy: "discuss", kidney: "caution" }),
    timing: "Any time, often mixed into coffee or yogurt. Daily for at least two months before judging it.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "coq10",
    name: "Coenzyme Q10",
    aliases: ["coq10", "coenzyme q10", "ubiquinol", "ubiquinone", "coenzyme q"],
    category: "Other",
    summary:
      "CoQ10 is a mitochondrial cofactor with a narrow, honest résumé: a possible adjunct for statin-associated muscle symptoms, and a possible adjunct in heart failure under medical care. Ubiquinol is not automatically worth the premium. It can lower the effect of warfarin.",
    mechanism:
      "Part of the electron transport chain and a lipid-soluble antioxidant. Statins reduce endogenous CoQ10 synthesis, which is the rationale — not the proof — for using it when muscles ache.",
    evidenceGrade: "C",
    effectiveness: 54,
    safety: 80,
    primaryUse: "Adjunct for statin muscle symptoms and clinician-directed heart failure care",
    typicalDose: "100–200 mg/day with a fat-containing meal. Heart-failure trials have used higher doses under supervision.",
    upperLimit: "No official UL. Doses up to 1,200 mg/day have been used in studies. Gastrointestinal upset is the usual limit.",
    doseRange: {
      unit: "mg",
      alignedMin: 100,
      alignedMax: 300,
      highMax: 600,
      note: "Supplemental CoQ10 with food. A 30 mg sprinkle is below the studied range.",
    },
    forms: [
      { name: "Ubiquinone", note: "The oxidized form used in many trials. A reasonable default." },
      { name: "Ubiquinol", note: "The reduced form. Better absorbed in some pharmacokinetic studies, not clearly better in outcomes for everyone." },
    ],
    outcomes: [
      { goal: "heart", grade: "C", effect: "Adjunct, not primary prevention", detail: "Q-SYMBIO suggested fewer major events when CoQ10 was added to standard heart-failure therapy. That is not a reason for a healthy person to take it for 'heart health.'" },
      { goal: "muscle", grade: "C", effect: "Mixed for statin symptoms", detail: "Trials of CoQ10 for statin-associated muscle symptoms disagree. A time-limited trial is reasonable; an indefinite expensive habit is not required." },
      { goal: "energy", grade: "D", effect: "Not a stimulant", detail: "Mitochondrial branding aside, CoQ10 does not treat ordinary fatigue in replete, healthy adults." },
    ],
    cautions: [
      "Can reduce warfarin effect. INR monitoring is mandatory if you combine them.",
      "Heart failure treatment is a medical plan. Do not add CoQ10 and skip a diuretic or a visit.",
    ],
    interactions: [
      { with: "Warfarin", severity: "high", note: "CoQ10 may reduce the anticoagulant effect. Do not start or stop it quietly." },
      { with: "Blood pressure medicines", severity: "low", note: "A small additive blood-pressure drop is possible." },
    ],
    whoShouldAvoid: [
      "People on warfarin unless the prescriber is adjusting and checking INR.",
      "Anyone using it as a substitute for prescribed heart-failure therapy.",
    ],
    keyStudies: [
      { title: "Q-SYMBIO", year: 2014, design: "Randomized trial in chronic heart failure", finding: "CoQ10 added to standard therapy reduced major cardiovascular events in a selected heart-failure population.", citation: "Mortensen et al., JACC: Heart Failure, 2014" },
    ],
    sources: [
      { label: "NIH ODS CoQ10 fact sheet", url: "https://ods.od.nih.gov/factsheets/CoenzymeQ10-HealthProfessional/" },
    ],
    goals: ["heart", "muscle", "energy"],
    safetyFlags: flags({ pregnancy: "discuss", warfarin: "avoid", bleeding: "caution" }),
    timing: "With a meal that contains fat. Split higher doses.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "caffeine",
    name: "Caffeine",
    aliases: ["caffeine", "coffee extract", "guarana", "green tea extract caffeine"],
    category: "Performance",
    summary:
      "Caffeine is a real performance and alertness drug that happens to be sold next to crystals. Three to six milligrams per kilogram helps endurance and vigilance. It also wrecks sleep, worsens anxiety, and has a pregnancy ceiling. Guarana is caffeine wearing a botanical costume.",
    mechanism:
      "Adenosine receptor antagonism. That is why you feel awake, and why the sleep debt still exists when the feeling wears off.",
    evidenceGrade: "A",
    effectiveness: 88,
    safety: 62,
    primaryUse: "Alertness and endurance performance",
    typicalDose: "50–200 mg for alertness. About 3–6 mg/kg, 30–60 minutes before exercise, for performance. Many adults should stay under 400 mg/day from all sources.",
    upperLimit: "About 400 mg/day for healthy non-pregnant adults. Pregnancy guidance is generally to stay at or below 200 mg/day. Anxiety, arrhythmia, and insomnia lower your personal ceiling.",
    doseRange: {
      unit: "mg",
      alignedMin: 40,
      alignedMax: 200,
      highMax: 400,
      note: "Per serving, assuming you are not also drinking a pot of coffee.",
    },
    forms: [
      { name: "Coffee or tea", note: "The form with a dietary pattern attached. Easier to feel the dose." },
      { name: "Anhydrous caffeine pills", note: "Easy to overdose. A teaspoon of powder can be dangerous. Prefer measured tablets if you use pills at all." },
      { name: "Guarana", note: "Counts fully toward the caffeine total even when the label whispers." },
    ],
    outcomes: [
      { goal: "performance", grade: "A", effect: "Meaningful for endurance and vigilance", detail: "ISSN and IOC both treat caffeine as an effective ergogenic aid for specific efforts. The dose is body-weight based, not 'one scoop.'" },
      { goal: "cognition", grade: "A", effect: "Alertness, not memory", detail: "Caffeine improves vigilance and reaction time, especially if you are sleepy. It does not build long-term memory." },
      { goal: "energy", grade: "B", effect: "Borrowed, not created", detail: "It masks sleepiness. If the reason you are tired is iron deficiency or four hours of sleep, caffeine is a delay, not a fix." },
    ],
    cautions: [
      "Do not use pure caffeine powder. The margin between a dose and an emergency is a bad scoop.",
      "Anxiety, panic, reflux, and palpitations are reasons to lower the dose, not push through.",
      "Afternoon doses steal the sleep you were going to supplement later with melatonin. That loop is not wellness.",
    ],
    interactions: [
      { with: "Stimulant medications", severity: "high", note: "Additive cardiovascular and anxiety effects with amphetamines and some ADHD medicines." },
      { with: "Theophylline and certain antibiotics", severity: "moderate", note: "Some drugs slow caffeine clearance, including ciprofloxacin and fluvoxamine." },
    ],
    whoShouldAvoid: [
      "Pregnant people above the roughly 200 mg/day ceiling, and anyone who has been told to avoid caffeine.",
      "People with uncontrolled arrhythmia or severe anxiety triggered by caffeine.",
      "Adolescents using anhydrous stimulant products.",
    ],
    keyStudies: [
      { title: "IOC consensus on caffeine", year: 2021, design: "Evidence review", finding: "Caffeine at 3–6 mg/kg improves endurance and repeated high-intensity performance for many athletes, with real side effects at the top of the range.", citation: "Guest et al., British Journal of Sports Medicine, 2021" },
    ],
    sources: [
      { label: "NIH ODS exercise fact sheet", url: "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/" },
    ],
    goals: ["performance", "cognition", "energy"],
    safetyFlags: flags({ pregnancy: "caution" }),
    timing: "Morning or 30–60 minutes before training. Cut it off at least 8 hours before bed if sleep is fragile.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "l-theanine",
    name: "L-theanine",
    aliases: ["theanine", "l-theanine", "l theanine"],
    category: "Amino acid",
    summary:
      "L-theanine, the amino acid in tea, has modest evidence for a calmer kind of attention, especially paired with caffeine. It is not a treatment for anxiety disorders. Doses in studies are usually 100–200 mg, which is several cups of tea and more than most 'focus blends' disclose.",
    mechanism:
      "Crosses into the brain and influences alpha-wave activity and glutamate/GABA tone in experimental work. The human effect is subtle: less jitter with caffeine, slightly easier calm.",
    evidenceGrade: "C",
    effectiveness: 50,
    safety: 90,
    primaryUse: "Smooth attention, particularly alongside caffeine",
    typicalDose: "100–200 mg, sometimes paired with 40–100 mg caffeine. Tea alone rarely reaches that theanine dose.",
    upperLimit: "No established UL. Trials have used up to about 400 mg/day without a clear toxicity signal. Still not a reason to megadose.",
    doseRange: {
      unit: "mg",
      alignedMin: 100,
      alignedMax: 200,
      highMax: 400,
      note: "Isolated L-theanine. A blend that hides the milligrams cannot be scored.",
    },
    forms: [
      { name: "Isolated L-theanine", note: "The form used in trials. Suntheanine is a branded source, not a different effect." },
      { name: "Tea", note: "A pleasant, lower dose with caffeine and flavonoids attached." },
    ],
    outcomes: [
      { goal: "stress", grade: "C", effect: "Subtle calm", detail: "Acute studies show a small relaxation effect without sedation. Useful if caffeine makes you sharp and unpleasant. Not a substitute for treating anxiety." },
      { goal: "cognition", grade: "C", effect: "Attention with caffeine", detail: "The combination is more interesting than theanine alone. Expect smoother focus, not a new working memory." },
      { goal: "sleep", grade: "C", effect: "Wind-down, not a hypnotic", detail: "Some people sleep more easily because they are less wired. It will not move a delayed circadian clock the way melatonin can." },
    ],
    cautions: [
      "Blood-pressure drops are theoretically additive with antihypertensive drugs. In practice this is rarely dramatic at 200 mg.",
    ],
    interactions: [
      { with: "Blood pressure medicines", severity: "low", note: "Possible additive lowering. Mention it if you are already lightheaded on treatment." },
    ],
    whoShouldAvoid: [
      "Nobody has a strong avoidance at ordinary doses. Skip it if you want a sedative and would rather not notice that it is not one.",
    ],
    keyStudies: [
      { title: "Theanine and caffeine on attention", year: 2008, design: "Randomized crossover", finding: "The combination improved attention task performance and reduced susceptibility to distraction more than either alone in small studies.", citation: "Owen et al. and related crossover trials, Nutritional Neuroscience, 2008" },
    ],
    sources: [
      { label: "NIH ODS dietary supplements background", url: "https://ods.od.nih.gov/factsheets/DietarySupplements-Consumer/" },
    ],
    goals: ["stress", "cognition", "sleep"],
    safetyFlags: flags({ pregnancy: "discuss" }),
    timing: "Morning with caffeine for focus, or evening without caffeine if the goal is winding down.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "protein",
    name: "Protein powder",
    aliases: ["whey", "whey protein", "casein", "protein powder", "plant protein", "pea protein"],
    category: "Protein",
    summary:
      "A protein powder is a convenience food. It builds muscle only by helping you hit a daily protein target alongside resistance training. If you already eat enough protein, another scoop does nothing mystical. Whey is well studied; plant blends work if the dose and leucine are adequate.",
    mechanism:
      "Provides amino acids, especially leucine, that trigger muscle protein synthesis. The trigger has a threshold. A 10 g sprinkle often misses it; 20–40 g usually does not.",
    evidenceGrade: "A",
    effectiveness: 84,
    safety: 86,
    primaryUse: "Meeting a protein target for training or aging muscle",
    typicalDose: "20–40 g per serving, enough to reach about 1.6 g/kg/day if you are training. Older adults often need the higher end of a per-meal dose.",
    upperLimit: "Healthy kidneys handle high protein intakes. Chronic kidney disease does not. More than about 2.2 g/kg/day has diminishing returns for muscle.",
    doseRange: {
      unit: "g",
      alignedMin: 20,
      alignedMax: 40,
      highMax: 60,
      note: "Protein grams per serving, not powder weight inflated by flavoring.",
    },
    forms: [
      { name: "Whey isolate or concentrate", note: "Fast, leucine-rich, and the most studied. Isolate if lactose bothers you." },
      { name: "Casein", note: "Slower. Useful as a food, not a different physiology." },
      { name: "Pea and rice blends", note: "A solid vegan option when the serving actually contains 20 g and a decent leucine amount." },
    ],
    outcomes: [
      { goal: "muscle", grade: "A", effect: "Works as food plus lifting", detail: "Protein supplementation increases lean mass when total intake was previously inadequate and training is real. It does not replace the training." },
      { goal: "aging", grade: "A", effect: "Counters anabolic resistance", detail: "Older muscle needs a solid per-meal protein dose. A powder is legitimate if appetite or chewing gets in the way." },
      { goal: "performance", grade: "B", effect: "Recovery support", detail: "It supports repair. It is not an acute performance drug like caffeine or creatine." },
    ],
    cautions: [
      "Heavy metals have shown up in some third-party tests of protein powders. Prefer a brand that publishes a recent assay.",
      "Sugar-heavy 'mass gainers' are calorie products with a protein halo.",
    ],
    interactions: [
      { with: "Levothyroxine and some antibiotics", severity: "low", note: "A large calcium-fortified shake can interfere. Separate thyroid medicine from the shake by a few hours." },
    ],
    whoShouldAvoid: [
      "People with chronic kidney disease unless a dietitian has set the protein target.",
      "Anyone with a milk allergy considering whey. Lactose intolerance is different and often tolerated with isolate.",
    ],
    keyStudies: [
      { title: "Protein supplementation and resistance training", year: 2018, design: "Meta-analysis of randomized trials", finding: "Protein supplements augmented gains in muscle mass and strength when combined with lifting, with benefits plateauing around 1.6 g/kg/day.", citation: "Morton et al., British Journal of Sports Medicine, 2018" },
    ],
    sources: [
      { label: "NIH ODS exercise fact sheet", url: "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/" },
    ],
    goals: ["muscle", "aging", "performance"],
    safetyFlags: flags({ pregnancy: "ok", kidney: "avoid" }),
    timing: "Any meal that would otherwise be low in protein. Post-workout is convenient, not a magic window that closes at 30 minutes.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "calcium",
    name: "Calcium",
    aliases: ["calcium", "calcium citrate", "calcium carbonate"],
    category: "Mineral",
    summary:
      "Calcium is essential and often better eaten than swallowed. Supplements help when dietary intake is truly low, especially for bone health alongside vitamin D. Large boluses are the problem: they are linked to kidney stones and a debated cardiovascular signal. Split doses, and do not stack three products that all contain it.",
    mechanism:
      "Structural mineral in bone and a signaling ion everywhere else. Absorption saturates, which is why 500–600 mg at a time beats one 1,200 mg horse tablet.",
    evidenceGrade: "B",
    effectiveness: 70,
    safety: 60,
    primaryUse: "Closing a dietary calcium gap for bone health",
    typicalDose: "Enough to reach 1,000–1,200 mg/day from food plus supplement combined. Supplemental boluses of 500–600 mg or less absorb better.",
    upperLimit: "2,000–2,500 mg/day for adults depending on age, from all sources. The practical danger zone starts earlier if you add a multi, a bone formula, and an antacid.",
    doseRange: {
      unit: "mg",
      alignedMin: 200,
      alignedMax: 600,
      highMax: 1000,
      note: "Per serving of supplemental calcium. The daily total including food is the number that matters.",
    },
    forms: [
      { name: "Carbonate", note: "Cheapest, more elemental calcium, best taken with food. Harsher on an empty stomach." },
      { name: "Citrate", note: "Absorbed with or without food. A better choice if you use an acid-suppressing medicine." },
    ],
    outcomes: [
      { goal: "bone", grade: "B", effect: "Useful if intake is low", detail: "Calcium plus vitamin D can reduce fracture risk in older adults with low intake. Adding calcium when the diet is already adequate does not keep paying off." },
      { goal: "aging", grade: "B", effect: "Intake often slips", detail: "Appetite, dairy avoidance, and vitamin D status all collide after 50. Count food first." },
    ],
    cautions: [
      "Calcium supplements, unlike food calcium, have been associated with kidney stones in trials.",
      "A cardiovascular concern with supplemental calcium has been raised and disputed. The practical response is food first, modest doses, and no stacking.",
      "Hypercalcemia symptoms — thirst, confusion, constipation, stones — are a stop sign.",
    ],
    interactions: [
      { with: "Levothyroxine", severity: "high", note: "Separate by at least four hours." },
      { with: "Tetracyclines and quinolones", severity: "high", note: "Calcium can make the antibiotic fail. Separate doses." },
      { with: "Iron", severity: "moderate", note: "Calcium reduces iron absorption. Do not take them together." },
      { with: "Thiazide diuretics", severity: "moderate", note: "Both raise calcium. A clinician should know about the combination." },
    ],
    whoShouldAvoid: [
      "People with hypercalcemia, sarcoidosis, or a history of calcium kidney stones unless a clinician is managing it.",
      "Anyone already meeting the daily target from food.",
    ],
    keyStudies: [
      { title: "Women's Health Initiative calcium plus D", year: 2006, design: "Large randomized trial", finding: "Hip fracture benefit was not clear in the whole group and kidney stones increased. Diet context decides whether a tablet helps.", citation: "Jackson et al., NEJM, 2006" },
    ],
    sources: [
      { label: "NIH ODS calcium fact sheet", url: "https://ods.od.nih.gov/factsheets/Calcium-HealthProfessional/" },
    ],
    goals: ["bone", "aging"],
    safetyFlags: flags({ pregnancy: "discuss", kidney: "caution" }),
    timing: "500 mg or less at a time, carbonate with meals, separated from thyroid medicine and iron.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "vitamin-k2",
    name: "Vitamin K2",
    aliases: ["vitamin k2", "k2", "mk-7", "mk-4", "menaquinone"],
    category: "Vitamin",
    summary:
      "Vitamin K2 is interesting and unfinished. It activates proteins involved in bone and vascular calcium handling, and MK-7 supplements are popular. Hard outcomes — fewer fractures, less arterial calcification that matters — are inconsistent. The warfarin interaction is not theoretical.",
    mechanism:
      "Cofactor for gamma-carboxylation of osteocalcin and matrix Gla protein. MK-7 has a long half-life. That pharmacology is exactly why it can destabilize warfarin.",
    evidenceGrade: "C",
    effectiveness: 42,
    safety: 55,
    primaryUse: "A theoretical bone and vascular adjunct with limited outcome data",
    typicalDose: "90–180 mcg/day of MK-7 is the common supplemental range. It is not a substitute for prescribed vitamin K1 in a medical setting.",
    upperLimit: "No established UL for K2. The ceiling that matters is drug interaction, especially warfarin, not a toxicity number.",
    doseRange: {
      unit: "mcg",
      alignedMin: 90,
      alignedMax: 200,
      highMax: 360,
      note: "MK-7 micrograms. Dose alignment does not upgrade the evidence grade.",
    },
    forms: [
      { name: "MK-7", note: "Long half-life, once daily, and the form most likely to interact with warfarin for days." },
      { name: "MK-4", note: "Short half-life. High-dose MK-4 used in some countries is a different regimen from a 100 mcg capsule." },
    ],
    outcomes: [
      { goal: "bone", grade: "C", effect: "Inconsistent", detail: "Some trials suggest bone-density changes. Fracture evidence is not strong enough to put K2 next to vitamin D and dietary calcium." },
      { goal: "heart", grade: "I", effect: "Hypothesis", detail: "Arterial calcification studies are intriguing and not practice-changing. Do not buy K2 as heart protection." },
    ],
    cautions: [
      "Warfarin patients should not start K2. It opposes the drug. This is a high-severity interaction.",
      "Stop before surgery only if your surgical team wants a full supplement list — and they do.",
    ],
    interactions: [
      { with: "Warfarin", severity: "high", note: "Vitamin K antagonizes warfarin. MK-7's long half-life makes this especially messy. Do not combine." },
    ],
    whoShouldAvoid: [
      "Anyone taking warfarin or another vitamin-K-sensitive anticoagulant.",
    ],
    keyStudies: [
      { title: "MK-7 and bone in postmenopausal women", year: 2013, design: "Randomized trial", finding: "Some bone-strength measures improved over three years. Fracture was not the demonstrated outcome.", citation: "Knapen et al., Osteoporosis International, 2013" },
    ],
    sources: [
      { label: "NIH ODS vitamin K fact sheet", url: "https://ods.od.nih.gov/factsheets/VitaminK-HealthProfessional/" },
    ],
    goals: ["bone", "heart"],
    safetyFlags: flags({ pregnancy: "discuss", warfarin: "avoid", bleeding: "caution" }),
    timing: "With a meal containing fat. Same time daily if you are not on warfarin — and not at all if you are.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "glucosamine",
    name: "Glucosamine sulfate",
    aliases: ["glucosamine", "glucosamine sulfate", "glucosamine hcl", "chondroitin"],
    category: "Other",
    summary:
      "Glucosamine sulfate has a mixed but real file for knee osteoarthritis pain, better than glucosamine hydrochloride, which largely failed. It does not regrow cartilage on a useful timeline. Shellfish-derived products matter if you are allergic, and warfarin case reports mean you mention it.",
    mechanism:
      "A sugar amine used to build glycosaminoglycans. Oral glucosamine reaching joint cartilage in meaningful amounts is debated. Symptom scores, not structure, are the fair endpoint.",
    evidenceGrade: "C",
    effectiveness: 48,
    safety: 74,
    primaryUse: "Modest knee osteoarthritis symptom relief with the sulfate form",
    typicalDose: "1,500 mg/day glucosamine sulfate, often with 1,200 mg chondroitin in older trials. Give it 8–12 weeks before deciding it failed.",
    upperLimit: "No official UL. Gastrointestinal upset is the usual limiter. Glucose effects are small and mostly a non-issue, but diabetes medicines deserve a mention.",
    doseRange: {
      unit: "mg",
      alignedMin: 1500,
      alignedMax: 1500,
      highMax: 2000,
      note: "Glucosamine sulfate. Hydrochloride products should not borrow the sulfate evidence.",
    },
    forms: [
      { name: "Glucosamine sulfate", note: "The form with the more positive European trials." },
      { name: "Glucosamine hydrochloride", note: "Used in GAIT and largely unimpressive. Do not pay sulfate prices for this." },
      { name: "With chondroitin", note: "The combination has its own mixed literature. Still a symptom adjunct." },
    ],
    outcomes: [
      { goal: "joint", grade: "C", effect: "Small pain change in some trials", detail: "Sulfate trials sometimes match a modest NSAID-like symptom effect. GAIT was largely negative for hydrochloride. Expect comfort, not regeneration." },
    ],
    cautions: [
      "Shellfish allergy: some glucosamine is made from shells, though the allergen content is usually low. Prefer a fermented source if you are allergic, or skip it.",
      "Warfarin case reports describe INR changes. Tell the anticoagulation clinic.",
    ],
    interactions: [
      { with: "Warfarin", severity: "moderate", note: "Case reports of increased INR. Monitor if a clinician agrees you can try it." },
      { with: "Diabetes medicines", severity: "low", note: "Clinically important glucose changes are uncommon, but check if your readings drift." },
    ],
    whoShouldAvoid: [
      "People with a serious shellfish allergy unless the product is certified non-shellfish.",
      "Anyone hoping to avoid physical therapy, strength work, or weight management for an osteoarthritic knee.",
    ],
    keyStudies: [
      { title: "GAIT", year: 2006, design: "Multicenter randomized trial", finding: "Glucosamine hydrochloride and chondroitin were not significantly better than placebo overall for knee pain. A severe-pain subgroup looked different, and the form was not sulfate.", citation: "Clegg et al., NEJM, 2006" },
      { title: "Glucosamine sulfate structural trial", year: 2001, design: "Randomized trial", finding: "A sulfate formulation slowed joint-space narrowing and improved symptoms in one influential European trial. Later evidence has been less consistent.", citation: "Reginster et al., Lancet, 2001" },
    ],
    sources: [
      { label: "NIH ODS glucosamine fact sheet", url: "https://ods.od.nih.gov/factsheets/Glucosamine-HealthProfessional/" },
    ],
    goals: ["joint"],
    safetyFlags: flags({ pregnancy: "avoid", warfarin: "caution", diabetesMeds: "caution" }),
    timing: "With food, daily, for a defined 8–12 week trial. Stop if nothing changes.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "st-johns-wort",
    name: "St. John's wort",
    aliases: ["st john's wort", "st johns wort", "hypericum", "hypericum perforatum", "sjw"],
    category: "Botanical",
    summary:
      "St. John's wort has moderate evidence for mild to moderate depression and a frightening interaction list. It induces liver enzymes and drug transporters, which can silently cancel oral contraceptives, transplant drugs, HIV medicines, and anticoagulants. Combined with an SSRI it can cause serotonin syndrome. This is not a gentle tea.",
    mechanism:
      "Hyperforin and hypericin contribute to serotonin, norepinephrine, and dopamine reuptake effects, and hyperforin activates the pregnane X receptor, inducing CYP3A4 and P-glycoprotein.",
    evidenceGrade: "B",
    effectiveness: 68,
    safety: 30,
    primaryUse: "Mild to moderate depression — only with a full medication review",
    typicalDose: "300 mg of a 0.3% hypericin extract, three times daily, in older trials. Products that do not standardize the extract are not those trials.",
    upperLimit: "No safe DIY ceiling. Photosensitivity rises with dose. The interaction risk appears at ordinary studied doses, not just overdoses.",
    doseRange: {
      unit: "mg",
      alignedMin: 300,
      alignedMax: 900,
      highMax: 1200,
      note: "Standardized extract per day. Alignment with the trial dose does not make it safe with your prescriptions.",
    },
    forms: [
      { name: "Standardized extract, 0.3% hypericin", note: "The studied pattern is 300 mg three times daily. A bedtime tea is a different product." },
    ],
    outcomes: [
      { goal: "mood", grade: "B", effect: "Comparable to some antidepressants in mild illness", detail: "Cochrane found it better than placebo for major depression, with smaller trials and older studies doing much of the work. It still requires a clinician, because the interactions are the story." },
    ],
    cautions: [
      "Do not combine with SSRIs, SNRIs, MAOIs, or tramadol. Serotonin syndrome is an emergency: agitation, fever, tremor, diarrhea.",
      "It reduces the effectiveness of many drugs, including hormonal contraception. An unplanned pregnancy is a documented kind of failure.",
      "Photosensitivity is real. Burn more easily while taking it.",
      "Stopping suddenly after regular use can unsettle mood. Do that with a clinician.",
    ],
    interactions: [
      { with: "SSRIs, SNRIs, and other serotonergic drugs", severity: "high", note: "Serotonin syndrome risk. Do not combine." },
      { with: "Hormonal contraception", severity: "high", note: "Enzyme induction can cause breakthrough bleeding and contraceptive failure." },
      { with: "Warfarin, transplant drugs, HIV medicines, and many others", severity: "high", note: "CYP3A4 and P-gp induction lowers drug levels. The list is long enough that a pharmacist review is mandatory." },
    ],
    whoShouldAvoid: [
      "Anyone on an antidepressant, oral contraceptive, anticoagulant, HIV regimen, or transplant medicine.",
      "Pregnant people.",
      "Anyone with bipolar disorder — switching into mania is a risk.",
      "People who want a natural option specifically to avoid talking to a clinician. This plant requires the opposite.",
    ],
    keyStudies: [
      { title: "Cochrane review of St. John's wort", year: 2008, design: "Systematic review of randomized trials", finding: "More effective than placebo for major depression, with similar response to standard antidepressants in some comparisons, and a high bias risk in older smaller trials.", citation: "Linde et al., Cochrane Database of Systematic Reviews, 2008" },
    ],
    sources: [
      { label: "NIH ODS St. John's wort fact sheet", url: "https://ods.od.nih.gov/factsheets/StJohnsWort-HealthProfessional/" },
    ],
    goals: ["mood"],
    safetyFlags: flags({
      pregnancy: "avoid",
      liver: "caution",
      moodMeds: "avoid",
      warfarin: "avoid",
      birthControl: "avoid",
      immunosuppressants: "avoid",
      bleeding: "caution",
    }),
    timing: "Divided doses with food, only after a medication review. Not a bedtime add-on to an SSRI.",
    testFirst: false,
    herb: true,
  },
  {
    slug: "berberine",
    name: "Berberine",
    aliases: ["berberine", "berberine hcl"],
    category: "Botanical",
    summary:
      "Berberine can lower glucose and LDL by a modest amount in small trials. It is not a metformin replacement, it commonly upsets the gut, and it inhibits drug-metabolizing enzymes. People on diabetes medication can go low. Pregnancy is a no.",
    mechanism:
      "Activates AMPK in experimental systems, similar in slogan to metformin and different in evidence, safety data, and regulatory status. It also inhibits CYP enzymes and can raise levels of other drugs.",
    evidenceGrade: "C",
    effectiveness: 58,
    safety: 46,
    primaryUse: "Modest adjunct for glucose and LDL in selected adults",
    typicalDose: "500 mg two or three times daily with meals in studies, often 1,000–1,500 mg/day total.",
    upperLimit: "No official UL. Diarrhea and cramping often arrive before any metabolic benefit. Do not push past the studied range to speed a lab result.",
    doseRange: {
      unit: "mg",
      alignedMin: 1000,
      alignedMax: 1500,
      highMax: 2000,
      note: "Total daily dose of berberine HCl, split with meals.",
    },
    forms: [
      { name: "Berberine HCl", note: "The usual supplemental salt. Absorption is poor, which is why doses are high and stomachs complain." },
    ],
    outcomes: [
      { goal: "glucose", grade: "C", effect: "Modest reduction", detail: "Small trials show lower fasting glucose and HbA1c. They are not a substitute for diabetes care, and several have quality problems." },
      { goal: "heart", grade: "C", effect: "Modest LDL drop", detail: "LDL and triglycerides fall somewhat in the same small literature. Psyllium has a cleaner safety story for LDL." },
    ],
    cautions: [
      "Can cause hypoglycemia when added to insulin, sulfonylureas, or other glucose-lowering drugs.",
      "Inhibits CYP3A4, CYP2D6, and others. Assume it can change drug levels until a pharmacist says otherwise.",
      "Not for pregnancy. Neonatal jaundice is part of the traditional concern with berberine alkaloids.",
      "Cramping and diarrhea are common. That is an adverse effect, not a cleanse.",
    ],
    interactions: [
      { with: "Diabetes medicines", severity: "high", note: "Additive glucose lowering. Hypoglycemia risk." },
      { with: "Cyclosporine and other CYP3A4 substrates", severity: "high", note: "Berberine can raise cyclosporine levels. Transplant medicine and berberine do not mix as a self-experiment." },
      { with: "Statins and many prescriptions", severity: "moderate", note: "Enzyme inhibition is broad. Get a specific review." },
    ],
    whoShouldAvoid: [
      "Pregnant people and infants.",
      "People on transplant immunosuppression.",
      "Anyone who wants to stop a prescribed diabetes drug because a capsule sounds cleaner.",
    ],
    keyStudies: [
      { title: "Berberine and type 2 diabetes", year: 2008, design: "Small randomized pilot comparisons", finding: "Glucose markers improved in small studies, some versus metformin. The evidence has not matured into a replacement for standard care.", citation: "Yin et al., Metabolism, 2008" },
    ],
    sources: [
      { label: "NCCIH berberine-related botanical context", url: "https://www.nccih.nih.gov/health/berberine-and-weight-loss-what-you-need-to-know" },
    ],
    goals: ["glucose", "heart"],
    safetyFlags: flags({
      pregnancy: "avoid",
      liver: "caution",
      diabetesMeds: "avoid",
      immunosuppressants: "avoid",
    }),
    timing: "Split with meals to reduce stomach upset and to meet the glucose rise.",
    testFirst: false,
    herb: true,
  },
  {
    slug: "nac",
    name: "N-acetylcysteine",
    aliases: ["nac", "n-acetylcysteine", "n acetyl cysteine", "acetylcysteine"],
    category: "Amino acid",
    summary:
      "NAC is a mucolytic and the oral cousin of the hospital antidote for acetaminophen overdose. As a supplement, 600 mg twice daily has modest data for chronic bronchitis secretions. Psychiatric and longevity claims are ahead of the evidence. It smells like sulfur because it is sulfur.",
    mechanism:
      "A cysteine donor that replenishes glutathione and breaks disulfide bonds in mucus. Oral bioavailability is modest, which is why hospital dosing is intravenous.",
    evidenceGrade: "C",
    effectiveness: 50,
    safety: 72,
    primaryUse: "Loosening mucus in chronic bronchitis; glutathione support is mostly theoretical at oral doses",
    typicalDose: "600 mg twice daily in respiratory studies. Take it with food if it nauseates you.",
    upperLimit: "No official UL for supplemental use. Nausea and heartburn are common. High doses belong in a clinical protocol, not a smoothie.",
    doseRange: {
      unit: "mg",
      alignedMin: 600,
      alignedMax: 1200,
      highMax: 1800,
      note: "Daily oral NAC. The acetaminophen antidote is a different, medical dose and route.",
    },
    forms: [
      { name: "N-acetylcysteine capsules", note: "Unstable in liquids and famously odorous. A normal capsule is fine." },
    ],
    outcomes: [
      { goal: "immunity", grade: "C", effect: "Mucus, not prevention", detail: "It helps some people clear thick secretions. It does not prevent viral infections." },
      { goal: "mood", grade: "I", effect: "Early", detail: "Adjunct data in some psychiatric conditions are preliminary. Not a recommendation from this app." },
    ],
    cautions: [
      "Can worsen bronchospasm in some people with asthma. Stop if breathing tightens.",
      "May potentiate nitroglycerin and cause headache or low blood pressure.",
    ],
    interactions: [
      { with: "Nitroglycerin", severity: "moderate", note: "Additive vasodilation, headache, and hypotension." },
      { with: "Activated charcoal", severity: "low", note: "Relevant in overdose settings, not daily life." },
    ],
    whoShouldAvoid: [
      "People with asthma who have previously bronchospasmed on a mucolytic.",
      "Anyone treating an acetaminophen overdose at home. That is an emergency department, immediately.",
    ],
    keyStudies: [
      { title: "NAC in chronic bronchitis", year: 2015, design: "Review of randomized trials", finding: "Oral NAC reduced exacerbations in some chronic bronchitis studies, with a modest effect and a sulfur-side-effect profile.", citation: "Cazzola et al., reviews in respiratory journals, 2015" },
    ],
    sources: [
      { label: "NCCIH botanical and supplement literacy page", url: "https://www.nccih.nih.gov/health/providers/digest/dietary-supplements-what-you-need-to-know" },
    ],
    goals: ["immunity"],
    safetyFlags: flags({ pregnancy: "discuss", bleeding: "caution" }),
    timing: "With food, split doses. Do not confuse a supplement bottle with emergency acetaminophen treatment.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "beta-alanine",
    name: "Beta-alanine",
    aliases: ["beta-alanine", "beta alanine", "carnosine"],
    category: "Performance",
    summary:
      "Beta-alanine raises muscle carnosine and buffers acid during efforts lasting about one to four minutes. The evidence is good for that narrow job and irrelevant for a long easy run. Tingling is harmless and dose-related. A single 1.6 g scoop is below the daily dose used in trials.",
    mechanism:
      "Rate-limiting precursor for carnosine synthesis in muscle. Carnosine buffers hydrogen ions during high-intensity glycolysis. Loading takes weeks.",
    evidenceGrade: "B",
    effectiveness: 72,
    safety: 84,
    primaryUse: "High-intensity efforts lasting 1–4 minutes",
    typicalDose: "3.2–6.4 g/day, split into smaller doses to limit tingling, for at least 4 weeks.",
    upperLimit: "No official UL. Paresthesia is the practical ceiling. Splitting the dose manages it. More than 6.4 g/day is not clearly better.",
    doseRange: {
      unit: "g",
      alignedMin: 3.2,
      alignedMax: 6.4,
      highMax: 8,
      note: "Total daily grams. A pre-workout serving of 1.6 g only counts if you actually take enough servings.",
    },
    forms: [
      { name: "Instant-release powder", note: "Causes more tingling. Split it." },
      { name: "Sustained release", note: "Less paresthesia at the same daily dose. Not a stronger athlete, just a calmer face." },
    ],
    outcomes: [
      { goal: "performance", grade: "B", effect: "Specific efforts", detail: "ISSN considers beta-alanine effective for high-intensity exercise in the 1–4 minute range. It does little for a 5K jog or a one-rep max." },
      { goal: "muscle", grade: "C", effect: "Indirect", detail: "You may get more quality reps. It is not a muscle-builder the way creatine plus protein plus lifting is." },
    ],
    cautions: [
      "The tingling (paresthesia) is well known and not nerve damage. It still startles people who were not warned.",
      "A pre-workout that lists beta-alanine inside a proprietary blend is hiding whether you are getting a studied dose.",
    ],
    interactions: [
      { with: "No major drug interactions", severity: "low", note: "The issue is dose and expectation, not a famous drug collision." },
    ],
    whoShouldAvoid: [
      "People who do not do high-intensity intervals and were told it is a general fitness powder.",
    ],
    keyStudies: [
      { title: "ISSN beta-alanine position stand", year: 2015, design: "Evidence review", finding: "3.2–6.4 g/day for 4 weeks improves performance in efforts limited by acidosis. Paresthesia is the main side effect.", citation: "Trexler et al., Journal of the International Society of Sports Nutrition, 2015" },
    ],
    sources: [
      { label: "NIH ODS exercise fact sheet", url: "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/" },
    ],
    goals: ["performance", "muscle"],
    safetyFlags: flags({ pregnancy: "avoid" }),
    timing: "Split across the day, not necessarily pre-workout. The benefit is saturation over weeks.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "beetroot",
    name: "Beetroot nitrate",
    aliases: ["beetroot", "beet", "beet juice", "dietary nitrate", "nitrate"],
    category: "Performance",
    summary:
      "Nitrate from beet juice can slightly lower blood pressure and improve endurance economy. The dose that works is about 6–12 mmol of nitrate, typically a concentrated shot, not 500 mg of beet powder buried in a pre-workout. Antibacterial mouthwash can cancel the effect.",
    mechanism:
      "Dietary nitrate is reduced by oral bacteria to nitrite, then to nitric oxide. That pathway is why mouthwash and some antibiotics blunt the benefit.",
    evidenceGrade: "B",
    effectiveness: 64,
    safety: 78,
    primaryUse: "A small blood-pressure drop and a small endurance benefit",
    typicalDose: "A nitrate dose of roughly 6–12 mmol, often 70–140 ml of concentrated beet juice, 2–3 hours before exercise or daily for blood pressure.",
    upperLimit: "Juice is high in oxalate. People who form oxalate kidney stones should not make it a daily liter. Pink urine and stool are harmless.",
    doseRange: {
      unit: "mg",
      alignedMin: 400,
      alignedMax: 800,
      highMax: 1200,
      note: "Approximate nitrate milligrams, not beet-powder milligrams. Most powders cannot be scored as aligned.",
    },
    forms: [
      { name: "Concentrated beet juice", note: "The form used in the better trials. Look for a stated nitrate content." },
      { name: "Beet powder in a blend", note: "Usually underdosed. Treat it as color unless nitrate is quantified." },
    ],
    outcomes: [
      { goal: "performance", grade: "B", effect: "Small economy boost", detail: "Recreational athletes show a small improvement in endurance economy. Elite athletes show less. It is an adjunct to training, not a substitute." },
      { goal: "heart", grade: "B", effect: "Small pressure drop", detail: "Meta-analyses find a modest reduction in blood pressure. Useful as a food pattern, not as a reason to stop medication." },
    ],
    cautions: [
      "Can add to blood-pressure medicines and to PDE5 inhibitors such as sildenafil. Lightheadedness is the signal to stop and call.",
      "Oxalate content matters if you make kidney stones.",
      "Beeturia — pink urine — is normal and not blood.",
    ],
    interactions: [
      { with: "Blood pressure medicines and PDE5 inhibitors", severity: "moderate", note: "Additive vasodilation and hypotension risk." },
      { with: "Antibacterial mouthwash", severity: "low", note: "Kills the oral bacteria required to activate nitrate. Skip the mouthwash if you want the effect." },
    ],
    whoShouldAvoid: [
      "People with low blood pressure or on erectile-dysfunction medicines unless a clinician has reviewed it.",
      "People with recurrent oxalate stones if the plan is daily juice.",
    ],
    keyStudies: [
      { title: "Nitrate and blood pressure", year: 2013, design: "Meta-analysis of randomized trials", finding: "Inorganic nitrate, often as beet juice, produced a modest reduction in systolic blood pressure.", citation: "Siervo et al., Journal of Nutrition, 2013" },
    ],
    sources: [
      { label: "NIH ODS exercise fact sheet", url: "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/" },
    ],
    goals: ["performance", "heart"],
    safetyFlags: flags({ pregnancy: "discuss", kidney: "caution" }),
    timing: "A concentrated shot 2–3 hours before a long effort, or daily with food if blood pressure is the reason and your clinician agrees.",
    testFirst: false,
    herb: false,
  },
];
