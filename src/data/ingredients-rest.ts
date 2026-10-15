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

export const restIngredients: IngredientRecord[] = [
  {
    slug: "elderberry",
    name: "Elderberry",
    aliases: ["elderberry", "sambucus", "sambucus nigra"],
    category: "Botanical",
    summary:
      "Prepared elderberry has a handful of small trials suggesting shorter cold and flu symptoms. The evidence is limited, heterogeneous, and not a treatment for serious viral illness. Raw or unripe elderberry is toxic. Skip it if you are pregnant or on immune-suppressing drugs.",
    mechanism:
      "Anthocyanin-rich berry extracts are hypothesized to limit viral replication in cell studies. Human symptom trials are small. The plant's seeds and unripe fruit contain cyanogenic glycosides.",
    evidenceGrade: "C",
    effectiveness: 40,
    safety: 60,
    primaryUse: "A limited, prepared-product option for ordinary cold symptoms",
    typicalDose: "Depends on the extract. Syrup trials often used about 15 ml four times daily of a specific product. Follow a prepared product's studied pattern, not raw berries.",
    upperLimit: "No official UL. Nausea and the toxicity of home-prepared unripe fruit are the real limits.",
    doseRange: null,
    forms: [
      { name: "Standardized syrup or lozenge", note: "Only use commercially prepared products. Home-cooked unripe berries are not a folk remedy worth the risk." },
      { name: "Raw or unripe berries, leaves, bark", note: "Can cause cyanide-related toxicity. Not a supplement form." },
    ],
    outcomes: [
      { goal: "immunity", grade: "C", effect: "Possible shorter symptoms", detail: "Small trials suggest a reduction in duration of cold and flu symptoms. They do not show prevention, and they do not justify use in severe illness." },
    ],
    cautions: [
      "Do not eat raw or unripe elderberry, bark, or leaves.",
      "Not a COVID treatment and not a reason to delay care for shortness of breath or dehydration.",
      "Theoretical immune stimulation is enough reason to avoid it with autoimmune disease or transplant drugs.",
    ],
    interactions: [
      { with: "Immunosuppressants", severity: "moderate", note: "Avoid immune-stimulating herbs after transplant or on biologic therapy unless the specialist agrees." },
      { with: "Diuretics", severity: "low", note: "Elderberry is a mild diuretic in traditional use. Rarely important, worth mentioning if you are volume-sensitive." },
    ],
    whoShouldAvoid: [
      "Pregnant people — safety data are inadequate.",
      "People on immunosuppressants or with autoimmune disease flares.",
      "Anyone planning to forage it.",
    ],
    keyStudies: [
      { title: "Elderberry for upper respiratory symptoms", year: 2019, design: "Meta-analysis of small randomized trials", finding: "A signal for shorter symptom duration, with small samples and product heterogeneity. Promising is not proven.", citation: "Hawkins et al., Complementary Therapies in Medicine, 2019" },
    ],
    sources: [
      { label: "NCCIH elderberry page", url: "https://www.nccih.nih.gov/health/elderberry" },
    ],
    goals: ["immunity"],
    safetyFlags: flags({ pregnancy: "avoid", immunosuppressants: "avoid", autoimmune: "caution" } as Partial<SafetyFlags>),
    timing: "At the start of ordinary cold symptoms, using a prepared product, and only if none of the avoid flags apply.",
    testFirst: false,
    herb: true,
  },
  {
    slug: "biotin",
    name: "Biotin",
    aliases: ["biotin", "vitamin b7", "vitamin h"],
    category: "Vitamin",
    summary:
      "Biotin grows hair only if you are deficient, which is uncommon. High-dose beauty capsules reliably interfere with lab tests, including troponin and thyroid panels, and have caused misdiagnosis. Stop biotin well before bloodwork. The RDA is 30 mcg, not 10,000.",
    mechanism:
      "A cofactor for carboxylase enzymes in macronutrient metabolism. Deficiency causes hair and skin changes; excess does not supercharge those pathways. High blood biotin distorts streptavidin-based lab assays.",
    evidenceGrade: "D",
    effectiveness: 22,
    safety: 50,
    primaryUse: "Treating rare biotin deficiency — not cosmetic hair growth",
    typicalDose: "30 mcg/day meets the adult adequate intake. Deficiency treatment is a medical dose. Cosmetic products of 5,000–10,000 mcg have no good efficacy data and real lab risk.",
    upperLimit: "No official UL, which is not the same as safe for lab interpretation. FDA has warned that high biotin interferes with troponin and hormone assays.",
    doseRange: {
      unit: "mcg",
      alignedMin: 30,
      alignedMax: 100,
      highMax: 300,
      note: "Physiologic range. Beauty doses of 5,000 mcg or more are scored as excessive because of assay interference, not because they work better.",
    },
    forms: [
      { name: "Microgram biotin in a multi", note: "Enough for almost everyone." },
      { name: "Milligram beauty dose", note: "The dose that breaks lab tests. Not supported for hair in people who eat a normal diet." },
    ],
    outcomes: [
      { goal: "skin", grade: "D", effect: "Unlikely unless deficient", detail: "Hair and nail claims in replete adults are not supported. Deficiency is the exception, usually with unusual diets or prolonged raw egg-white intake." },
    ],
    cautions: [
      "Stop high-dose biotin at least 48 hours before blood tests, and longer if your lab or clinician says so. Mention it even if you think you stopped in time.",
      "A falsely low troponin in an emergency is the nightmare scenario. Do not take megadose biotin.",
    ],
    interactions: [
      { with: "Laboratory assays", severity: "high", note: "Interferes with many immunoassays, including troponin, thyroid, and some hormone tests. This is a diagnostic interaction, and it counts." },
      { with: "Anticonvulsants", severity: "low", note: "Some seizure medicines lower biotin status. That is a clinician issue, not a reason to self-start 10 mg." },
    ],
    whoShouldAvoid: [
      "Anyone about to have blood drawn, especially in an emergency department, if they are on a high dose.",
      "People buying it for hair loss without a workup. Iron, thyroid, and androgen status are more often the point.",
    ],
    keyStudies: [
      { title: "FDA biotin safety communication", year: 2017, design: "Regulatory safety review", finding: "High-dose biotin can cause clinically significant incorrect lab results, including falsely low troponin.", citation: "U.S. Food and Drug Administration safety communication, 2017, updated 2019" },
    ],
    sources: [
      { label: "NIH ODS biotin fact sheet", url: "https://ods.od.nih.gov/factsheets/Biotin-HealthProfessional/" },
    ],
    goals: ["skin"],
    safetyFlags: flags({ pregnancy: "discuss" }),
    timing: "If a clinician has prescribed it, take it as directed and list it on every lab form. Otherwise, skip it.",
    testFirst: true,
    herb: false,
  },
  {
    slug: "iodine",
    name: "Iodine",
    aliases: ["iodine", "potassium iodide", "kelp", "iodide"],
    category: "Mineral",
    summary:
      "Iodine is essential for thyroid hormone and fetal brain development, and excess iodine causes thyroid trouble just as surely as deficiency. The adult target is 150 mcg, pregnancy 220 mcg. Kelp supplements are too variable to trust. Do not megadose iodine for 'detox.'",
    mechanism:
      "Required for synthesis of T4 and T3. The thyroid is sensitive in both directions: too little and too much both disrupt hormone output, especially if thyroid disease is already present.",
    evidenceGrade: "A",
    effectiveness: 80,
    safety: 58,
    primaryUse: "Meeting iodine needs, particularly in pregnancy and if dairy and iodized salt are absent",
    typicalDose: "150 mcg/day for most adults. Prenatal products should provide about 150 mcg. Do not add a second kelp capsule on top.",
    upperLimit: "1,100 mcg/day for adults. The gap between the target and the ceiling is smaller than supplement marketing implies.",
    doseRange: {
      unit: "mcg",
      alignedMin: 150,
      alignedMax: 220,
      highMax: 500,
      note: "Micrograms, not milligrams. A 12.5 mg capsule is a different and risky regimen.",
    },
    forms: [
      { name: "Potassium iodide", note: "A measured dose. The sensible supplemental form." },
      { name: "Kelp and seaweed supplements", note: "Iodine content swings wildly. Not a reliable prenatal source." },
    ],
    outcomes: [
      { goal: "pregnancy", grade: "A", effect: "Critical and easy to overshoot", detail: "Iodine deficiency in pregnancy harms fetal neurodevelopment. The fix is a measured 150 mcg, not seaweed snacks plus a kelp pill plus a multi." },
      { goal: "energy", grade: "C", effect: "Only if thyroid status is the cause", detail: "Iodine will not fix fatigue from sleep or iron deficiency, and excess can create a thyroid problem that feels like fatigue." },
    ],
    cautions: [
      "Thyroid disease, especially autoimmune thyroiditis, can flare with extra iodine.",
      "Milligram doses are used in specific nuclear or medical protocols. They are not a supplement trend to copy.",
      "Amiodarone already loads the body with iodine. Do not add more.",
    ],
    interactions: [
      { with: "Thyroid medicines", severity: "high", note: "Excess iodine destabilizes thyroid control. Lithium and amiodarone raise the stakes further." },
      { with: "Antithyroid drugs", severity: "high", note: "Iodine can undermine or complicate treatment. Specialist territory." },
    ],
    whoShouldAvoid: [
      "People with thyroid disease unless their clinician set the dose.",
      "Anyone considering a milligram-dose iodine supplement for detox, cysts, or energy.",
      "People taking amiodarone.",
    ],
    keyStudies: [
      { title: "Iodine and fetal development", year: 2014, design: "WHO and endocrine society evidence reviews", finding: "Adequate iodine before and during pregnancy is a public-health priority. Excess is also harmful, so the dose has to be measured.", citation: "WHO guidance; Alexander et al., Endocrine Society thyroid and pregnancy context" },
    ],
    sources: [
      { label: "NIH ODS iodine fact sheet", url: "https://ods.od.nih.gov/factsheets/Iodine-HealthProfessional/" },
    ],
    goals: ["pregnancy", "energy"],
    safetyFlags: flags({ pregnancy: "core", thyroid: "caution" }),
    timing: "In a prenatal or with a meal, once daily, and not duplicated across kelp, salt, and a second multi.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "selenium",
    name: "Selenium",
    aliases: ["selenium", "selenomethionine", "sodium selenite"],
    category: "Mineral",
    summary:
      "Selenium has a narrow window. The RDA is 55 mcg, the upper level is 400 mcg, and Brazil nuts can blow past both in a single handful. High-dose trials did not prevent cancer and raised concerns, including with vitamin E in SELECT. Do not megadose selenium for thyroid or immunity.",
    mechanism:
      "Incorporated into selenoproteins, including glutathione peroxidases and iodothyronine deiodinases that activate thyroid hormone. More substrate does not mean more benefit once stores are full.",
    evidenceGrade: "C",
    effectiveness: 40,
    safety: 52,
    primaryUse: "Correcting a rare dietary shortfall — not cancer prevention",
    typicalDose: "55 mcg/day from food is the adult RDA. A multi that contains 55–100 mcg is plenty. One Brazil nut can contain 70–90 mcg, sometimes much more.",
    upperLimit: "400 mcg/day for adults. Selenosis — hair loss, nail changes, garlic breath, neuropathy — sits uncomfortably close to enthusiast doses.",
    doseRange: {
      unit: "mcg",
      alignedMin: 55,
      alignedMax: 100,
      highMax: 200,
      note: "Total supplemental selenium. Add Brazil nuts before you add a second pill.",
    },
    forms: [
      { name: "Selenomethionine", note: "Well absorbed and more likely to raise body stores. Easy to overdo." },
      { name: "Selenite or selenate", note: "Inorganic forms used in some trials. Not a reason to take more." },
    ],
    outcomes: [
      { goal: "immunity", grade: "D", effect: "No routine role", detail: "Deficiency impairs immunity. Supplementation in replete people does not create a stronger one, and high doses can do the opposite." },
      { goal: "aging", grade: "D", effect: "Not a longevity pill", detail: "SELECT did not show a cancer benefit and suggested harm in some arms. That should have ended the megadose era." },
    ],
    cautions: [
      "Hair and nail changes, nausea, and a garlic odor are toxicity signs. Stop and get a level.",
      "Count Brazil nuts. They are food and a supplement at the same time.",
    ],
    interactions: [
      { with: "Cisplatin and other chemotherapy", severity: "moderate", note: "Antioxidant supplements around chemotherapy should be an oncology decision." },
      { with: "Statins", severity: "low", note: "High-dose antioxidant combinations have theoretical concerns. Ordinary dietary selenium is not the issue." },
    ],
    whoShouldAvoid: [
      "Anyone already eating Brazil nuts daily and considering a selenium pill.",
      "People attracted to 200 mcg 'thyroid support' stacks without a documented deficiency.",
    ],
    keyStudies: [
      { title: "SELECT", year: 2009, design: "Large randomized cancer prevention trial", finding: "Selenium and vitamin E, alone or together, did not prevent prostate cancer. Later follow-up raised a harm signal for vitamin E.", citation: "Lippman et al., JAMA, 2009" },
    ],
    sources: [
      { label: "NIH ODS selenium fact sheet", url: "https://ods.od.nih.gov/factsheets/Selenium-HealthProfessional/" },
    ],
    goals: ["immunity", "aging"],
    safetyFlags: flags({ pregnancy: "discuss", thyroid: "caution" }),
    timing: "With food if you actually need a supplement. Most people need a diet check instead.",
    testFirst: true,
    herb: false,
  },
  {
    slug: "choline",
    name: "Choline",
    aliases: ["choline", "choline bitartrate", "citicoline", "alpha-gpc", "phosphatidylcholine"],
    category: "Other",
    summary:
      "Choline is quietly underdosed in prenatal vitamins. The pregnancy adequate intake is 450 mg/day, and many prenatals contain little or none. Eggs are the food solution. Citicoline and alpha-GPC have a separate, modest cognition file and should not be confused with covering a prenatal gap.",
    mechanism:
      "A precursor for acetylcholine and for phospholipids, and a methyl donor. Pregnancy increases demand because the fetus concentrates choline.",
    evidenceGrade: "B",
    effectiveness: 62,
    safety: 80,
    primaryUse: "Closing the pregnancy choline gap",
    typicalDose: "Dietary target 425–550 mg/day depending on sex and life stage. Supplemental choline in pregnancy studies has often been a few hundred milligrams on top of diet, aiming at the 450 mg adequate intake.",
    upperLimit: "3,500 mg/day for adults. High doses cause a fishy odor, low blood pressure, and sweating. You will not enjoy finding the ceiling.",
    doseRange: {
      unit: "mg",
      alignedMin: 150,
      alignedMax: 450,
      highMax: 1000,
      note: "Choline ion, not the weight of an entire bitartrate salt if the label is being slippery. Prenatal doses under 100 mg are low.",
    },
    forms: [
      { name: "Choline bitartrate", note: "A straightforward way to close a dietary gap. Check the choline yield, not just the salt weight." },
      { name: "Citicoline and alpha-GPC", note: "Used in cognition studies. More expensive and not required to hit a prenatal intake target." },
      { name: "Eggs", note: "Two eggs provide a meaningful fraction of the daily target, with a food matrix attached." },
    ],
    outcomes: [
      { goal: "pregnancy", grade: "B", effect: "Plausible and under-covered", detail: "Observational and small trial data link higher maternal choline intake with fetal brain development markers. It is not as definitive as folic acid, and it is still worth covering." },
      { goal: "cognition", grade: "C", effect: "Modest, formulation-specific", detail: "Citicoline has small studies in memory and attention. A bitartrate prenatal dose is not a nootropic." },
    ],
    cautions: [
      "Fishy body odor is trimethylamine from excess choline. It is a dose signal, not a personality change.",
      "People with trimethylaminuria will notice this immediately and should not push the dose.",
    ],
    interactions: [
      { with: "Anticholinergic scoring is not a simple collision", severity: "low", note: "No famous dangerous interaction at prenatal doses. High-dose nootropic stacks plus stimulants are a different hobby." },
    ],
    whoShouldAvoid: [
      "People with trimethylaminuria, except under dietary advice.",
      "Anyone buying alpha-GPC as a stimulant stack while pregnant. Wrong form, wrong moment.",
    ],
    keyStudies: [
      { title: "Maternal choline and infant cognition", year: 2018, design: "Randomized feeding study", finding: "Higher maternal choline intake improved infant information-processing speed in a controlled feeding study. Promising, and a reason prenatals should stop ignoring it.", citation: "Caudill et al., FASEB Journal, 2018" },
    ],
    sources: [
      { label: "NIH ODS choline fact sheet", url: "https://ods.od.nih.gov/factsheets/Choline-HealthProfessional/" },
    ],
    goals: ["pregnancy", "cognition"],
    safetyFlags: flags({ pregnancy: "core" }),
    timing: "With a meal. Split higher doses if they upset your stomach or your social life.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "lions-mane",
    name: "Lion's mane",
    aliases: ["lion's mane", "lions mane", "hericium", "hericium erinaceus"],
    category: "Botanical",
    summary:
      "Lion's mane is a culinary mushroom with a preliminary cognition file and a much louder marketing department. Small studies exist. They are not enough to recommend it for memory, focus, or nerve repair. If a blend hides the dose, you cannot even compare it with those small studies.",
    mechanism:
      "Hericenones and erinacines stimulate nerve growth factor in preclinical models. That sentence has done more commercial work than the human trials.",
    evidenceGrade: "I",
    effectiveness: 28,
    safety: 74,
    primaryUse: "None established beyond being a mushroom",
    typicalDose: "Studies have used roughly 500–1,000 mg of fruiting-body extract, or more of whole powder, with inconsistent products. There is no evidence-based dose to aim at yet.",
    upperLimit: "No UL. Allergy and stomach upset are the practical limits. Unknown long-term safety at concentrated doses.",
    doseRange: null,
    forms: [
      { name: "Fruiting body extract", note: "Closer to the small human studies than myceliated grain, and still not a recommendation." },
      { name: "Mycelium on grain", note: "Often mostly starch. A poor match for the claim on the front of the jar." },
    ],
    outcomes: [
      { goal: "cognition", grade: "I", effect: "Insufficient", detail: "A few small trials in people with mild cognitive complaints are hypothesis-generating. They are not a reason to buy a focus blend." },
    ],
    cautions: [
      "Mushroom allergy is an obvious stop.",
      "Skin itching has been reported and usually settles after stopping.",
      "Do not use a preliminary mushroom as a reason to delay evaluation of real memory loss.",
    ],
    interactions: [
      { with: "Anticoagulants", severity: "low", note: "Theoretical bleeding risk from limited reports. Mention it if you are on warfarin, and do not expect a benefit that justifies the hassle." },
    ],
    whoShouldAvoid: [
      "People with a mushroom allergy.",
      "Anyone looking for a proven cognitive enhancer. This is not that.",
    ],
    keyStudies: [
      { title: "Lion's mane in mild cognitive impairment", year: 2009, design: "Small randomized trial", finding: "A single small study reported improved cognitive scores that receded after stopping. It has not been established by replication.", citation: "Mori et al., Phytotherapy Research, 2009" },
    ],
    sources: [
      { label: "NCCIH approach to dietary supplement claims", url: "https://www.nccih.nih.gov/health/using-dietary-supplements-wisely" },
    ],
    goals: ["cognition"],
    safetyFlags: flags({ pregnancy: "avoid", bleeding: "caution", warfarin: "caution" }),
    timing: "Not recommended, so timing is moot. If you already take it, tell your clinician before surgery or a memory workup.",
    testFirst: false,
    herb: true,
  },
  {
    slug: "ginkgo",
    name: "Ginkgo biloba",
    aliases: ["ginkgo", "ginkgo biloba", "egb 761"],
    category: "Botanical",
    summary:
      "Ginkgo did not prevent dementia in a large, well-known trial. Standardized leaf extract has a mixed, modest file for cognitive symptoms in dementia and a real bleeding signal with anticoagulants. Seeds are toxic. It does not belong in a casual focus stack.",
    mechanism:
      "EGb 761 is a standardized leaf extract with flavonol glycosides and terpene lactones. It has vascular and platelet effects, which is where both the theory and the bleeding risk come from.",
    evidenceGrade: "D",
    effectiveness: 32,
    safety: 48,
    primaryUse: "Not recommended for prevention; dementia symptom data are mixed",
    typicalDose: "120–240 mg/day of standardized EGb 761 in the studies that exist. Unstandardized leaf powder is not that product. Seeds are not a supplement.",
    upperLimit: "No official UL. Bleeding and headache show up at studied doses when combined with the wrong drugs. Ginkgo seeds can cause seizures.",
    doseRange: {
      unit: "mg",
      alignedMin: 120,
      alignedMax: 240,
      highMax: 360,
      note: "Standardized extract. Dose alignment does not rescue a weak prevention claim.",
    },
    forms: [
      { name: "EGb 761 leaf extract", note: "The researched extract. Still a poor prevention bet." },
      { name: "Seeds", note: "Contain ginkgotoxin. Not safe as a supplement." },
    ],
    outcomes: [
      { goal: "cognition", grade: "D", effect: "Does not prevent dementia", detail: "The GEM trial found no reduction in dementia incidence. Symptom trials in established dementia are mixed and smaller than the marketing." },
      { goal: "aging", grade: "D", effect: "Not a brain shield", detail: "Taking it in midlife to 'stay sharp' is not supported." },
    ],
    cautions: [
      "Stop before surgery. Bleeding risk is the reason.",
      "Do not combine with anticoagulants or antiplatelet drugs unless a clinician is deliberately managing that risk — and they usually will not want you to.",
      "Seeds can provoke seizures. Never use them as a home remedy.",
    ],
    interactions: [
      { with: "Warfarin, aspirin, and other antiplatelets", severity: "high", note: "Additive bleeding risk, including case reports of serious bleeding." },
      { with: "Anticonvulsants", severity: "moderate", note: "Seed preparations are particularly dangerous. Leaf extracts are still a poor idea in seizure disorders." },
    ],
    whoShouldAvoid: [
      "People on anticoagulants or awaiting surgery.",
      "Anyone with a seizure disorder.",
      "People buying it to prevent Alzheimer's disease. The large trial was negative.",
    ],
    keyStudies: [
      { title: "GEM study", year: 2008, design: "Large randomized prevention trial", finding: "Ginkgo did not reduce the incidence of dementia in older adults.", citation: "DeKosky et al., JAMA, 2008" },
    ],
    sources: [
      { label: "NIH ODS ginkgo fact sheet", url: "https://ods.od.nih.gov/factsheets/Ginkgo-HealthProfessional/" },
    ],
    goals: ["cognition", "aging"],
    safetyFlags: flags({
      pregnancy: "avoid",
      bleeding: "avoid",
      warfarin: "avoid",
    }),
    timing: "Not recommended for self-directed use. If a clinician has suggested a standardized extract, take it with food and list it before any procedure.",
    testFirst: false,
    herb: true,
  },
  {
    slug: "valerian",
    name: "Valerian",
    aliases: ["valerian", "valeriana", "valeriana officinalis"],
    category: "Botanical",
    summary:
      "Valerian smells like old socks and has mixed, mostly modest evidence for sleep. It is not a precise circadian tool the way low-dose melatonin is, and rare liver-injury reports mean it should not be stacked with other hepatotoxic hobbies. Avoid it in pregnancy and with sedatives.",
    mechanism:
      "Root extracts interact with GABA signaling in experimental models. Clinical trials disagree, partly because the products disagree with each other.",
    evidenceGrade: "C",
    effectiveness: 38,
    safety: 60,
    primaryUse: "A weak sleep option after better measures have been tried",
    typicalDose: "300–600 mg of extract, 30–60 minutes before bed, in the trials that used a defined extract. Teas are poorly standardized.",
    upperLimit: "No official UL. Morning grogginess, headache, and the rare liver signal are the limits. Do not combine with alcohol.",
    doseRange: {
      unit: "mg",
      alignedMin: 300,
      alignedMax: 600,
      highMax: 900,
      note: "Extract milligrams. A sleep blend that lists valerian without an amount is unscored.",
    },
    forms: [
      { name: "Root extract", note: "Inconsistent from brand to brand. Standardization is often absent, which matches the inconsistent trials." },
    ],
    outcomes: [
      { goal: "sleep", grade: "C", effect: "Mixed", detail: "Some trials show a small subjective benefit. Objective sleep measures are less convincing. Not first-line for insomnia." },
      { goal: "stress", grade: "C", effect: "Sedation, not a skill", detail: "Any calm is mostly drowsiness. Daytime use and driving do not mix." },
    ],
    cautions: [
      "Do not drive until you know whether it hangs over into the morning.",
      "Rare liver-injury reports. Stop if you develop dark urine, jaundice, or unusual fatigue.",
      "Alcohol plus valerian is not a wind-down. It is stacked sedation.",
    ],
    interactions: [
      { with: "Benzodiazepines, Z-drugs, opioids, and alcohol", severity: "high", note: "Additive sedation and next-day impairment." },
      { with: "Other hepatotoxic supplements", severity: "moderate", note: "Do not combine with kava or a pile of poorly identified botanicals." },
    ],
    whoShouldAvoid: [
      "Pregnant people.",
      "Anyone on sedative prescriptions.",
      "People with liver disease.",
    ],
    keyStudies: [
      { title: "Valerian for insomnia", year: 2015, design: "Systematic review", finding: "Subjective sleep sometimes improved. Objective benefit was inconsistent and product quality was a recurring problem.", citation: "Bent et al. and later reviews in sleep journals" },
    ],
    sources: [
      { label: "NIH ODS valerian fact sheet", url: "https://ods.od.nih.gov/factsheets/Valerian-HealthProfessional/" },
    ],
    goals: ["sleep", "stress"],
    safetyFlags: flags({
      pregnancy: "avoid",
      liver: "caution",
      sedatives: "avoid",
    }),
    timing: "30–60 minutes before bed, not with alcohol, and not before you need to drive.",
    testFirst: false,
    herb: true,
  },
  {
    slug: "rhodiola",
    name: "Rhodiola",
    aliases: ["rhodiola", "rhodiola rosea", "golden root", "shr-5"],
    category: "Botanical",
    summary:
      "Rhodiola rosea, particularly the SHR-5 extract, has modest evidence for fatigue and stress-related burnout. It can feel stimulating, so it is a poor bedtime idea. Quality varies, and bipolar disorder is a reason to leave stimulating adaptogens alone.",
    mechanism:
      "Rosavins and salidroside are the marker compounds. Human studies suggest reduced fatigue under stress. The word adaptogen is not a mechanism.",
    evidenceGrade: "C",
    effectiveness: 48,
    safety: 66,
    primaryUse: "Stress-related fatigue, with a standardized extract",
    typicalDose: "200–400 mg/day of a standardized SHR-5-type extract, taken earlier in the day, in the better trials.",
    upperLimit: "No official UL. Agitation and insomnia mean the dose is wrong for you. Do not escalate into a stimulant stack.",
    doseRange: {
      unit: "mg",
      alignedMin: 200,
      alignedMax: 400,
      highMax: 600,
      note: "Standardized extract. Unstandardized root powder is not interchangeable.",
    },
    forms: [
      { name: "SHR-5 extract", note: "The extract behind the more citable trials." },
      { name: "Unstandardized powder", note: "You cannot know the rosavin dose. Skip it if the claim depends on a trial." },
    ],
    outcomes: [
      { goal: "stress", grade: "C", effect: "Modest fatigue relief", detail: "Small trials in burnout and stress-related fatigue show a signal. They are not large, and they are not a treatment for depression." },
      { goal: "energy", grade: "C", effect: "Stimulating for some", detail: "People who feel flat under stress sometimes notice a lift. People with anxiety sometimes notice jitters." },
      { goal: "performance", grade: "I", effect: "Not established", detail: "Endurance claims outrun the trials. Caffeine and creatine have cleaner jobs." },
    ],
    cautions: [
      "Can feel like a stimulant. Avoid late in the day and avoid stacking with high-dose caffeine if you are anxiety-prone.",
      "Bipolar disorder: stimulating supplements can destabilize mood. Do not add this quietly.",
    ],
    interactions: [
      { with: "Stimulants", severity: "moderate", note: "Additive jitter and blood-pressure rise are possible." },
      { with: "Antidepressants", severity: "moderate", note: "Serotonergic and stimulating effects are not fully mapped. A prescriber should know." },
    ],
    whoShouldAvoid: [
      "People with bipolar disorder.",
      "Pregnant people — data are inadequate.",
      "Anyone already overstimulated by caffeine.",
    ],
    keyStudies: [
      { title: "SHR-5 and stress-related fatigue", year: 2009, design: "Randomized trial", finding: "A standardized extract improved burnout symptoms more than placebo over a few weeks in a selected stressed population.", citation: "Olsson et al., Planta Medica, 2009" },
    ],
    sources: [
      { label: "NCCIH rhodiola page", url: "https://www.nccih.nih.gov/health/rhodiola" },
    ],
    goals: ["stress", "energy"],
    safetyFlags: flags({
      pregnancy: "avoid",
      moodMeds: "caution",
      sedatives: "ok",
    }),
    timing: "Morning, with food. Not within several hours of bed.",
    testFirst: false,
    herb: true,
  },
  {
    slug: "same",
    name: "SAMe",
    aliases: ["same", "sam-e", "s-adenosylmethionine", "s adenosyl methionine"],
    category: "Other",
    summary:
      "SAMe has moderate evidence as an adjunct for depression and some evidence for osteoarthritis pain. It is expensive, unstable if poorly packaged, and can trigger mania. Combined with an antidepressant it adds serotonin risk. It is not a morning mood vitamin.",
    mechanism:
      "A methyl donor involved in neurotransmitter and cartilage metabolism. Oral products must be enteric-coated and protected from moisture or you are paying for a degraded salt.",
    evidenceGrade: "C",
    effectiveness: 56,
    safety: 44,
    primaryUse: "Adjunct for depression or osteoarthritis — only with a clinician",
    typicalDose: "400–800 mg/day for joint symptoms in some trials; depression studies often used 800–1,600 mg/day of a stable salt. Start low. This is not a self-escalation project.",
    upperLimit: "No official UL. Mania, anxiety, and nausea are the clinical limits. Cost usually intervenes first.",
    doseRange: {
      unit: "mg",
      alignedMin: 400,
      alignedMax: 800,
      highMax: 1600,
      note: "Stable, enteric-coated SAMe. Higher depression doses belong with a prescriber.",
    },
    forms: [
      { name: "Enteric-coated butanedisulfonate salt", note: "The form that survives long enough to be the thing you bought." },
      { name: "Loose or non-coated powders", note: "Often degraded. A bad way to spend this much money." },
    ],
    outcomes: [
      { goal: "mood", grade: "C", effect: "Adjunct, with a mania risk", detail: "Trials show an antidepressant signal, including as an add-on. Bipolar disorder is a contraindication for unsupervised use." },
      { goal: "joint", grade: "C", effect: "Similar to a mild analgesic in some trials", detail: "Osteoarthritis pain improved in several older trials, at a high monthly cost relative to better-proven care." },
    ],
    cautions: [
      "Can induce mania or hypomania. Any history of bipolar disorder is a stop sign unless a psychiatrist is directing it.",
      "Serotonin syndrome risk rises if you add it to an antidepressant.",
      "Nausea and anxiety are common enough to respect.",
    ],
    interactions: [
      { with: "SSRIs, SNRIs, and other antidepressants", severity: "high", note: "Serotonin syndrome risk. Do not combine without the prescriber's plan." },
      { with: "Levodopa", severity: "moderate", note: "SAMe has theoretical and reported interactions with Parkinson's treatment. Neurology should decide." },
    ],
    whoShouldAvoid: [
      "People with bipolar disorder unless a psychiatrist is managing it.",
      "Anyone on an antidepressant who has not told the prescriber.",
      "Pregnant people.",
    ],
    keyStudies: [
      { title: "SAMe as an antidepressant adjunct", year: 2010, design: "Randomized trial", finding: "Adding SAMe to an SSRI helped some non-responders in a small trial. The interaction risk is why this stays in clinic, not in a checkout aisle.", citation: "Papakostas et al., American Journal of Psychiatry, 2010" },
    ],
    sources: [
      { label: "NCCIH SAMe page", url: "https://www.nccih.nih.gov/health/sadenosylmethionine-same" },
    ],
    goals: ["mood", "joint"],
    safetyFlags: flags({
      pregnancy: "avoid",
      moodMeds: "avoid",
      bipolar: "avoid",
    } as Partial<SafetyFlags>),
    timing: "Morning, on an empty stomach in many protocols, only after a clinician review. Not a bedtime experiment.",
    testFirst: false,
    herb: false,
  },
  {
    slug: "vitamin-b6",
    name: "Vitamin B6",
    aliases: ["vitamin b6", "b6", "pyridoxine", "p5p", "pyridoxal phosphate"],
    category: "Vitamin",
    summary:
      "Vitamin B6 treats B6 deficiency and, combined with doxylamine, is a standard option for pregnancy nausea under clinical guidance. Chronic high doses cause sensory neuropathy. The adult upper level is 100 mg/day, and many 'energy' and PMS products sit on or over it for no good reason.",
    mechanism:
      "A cofactor for amino-acid metabolism and neurotransmitter synthesis. Neuropathy from excess is a peripheral-nerve toxicity, often reversible only if caught early.",
    evidenceGrade: "B",
    effectiveness: 60,
    safety: 64,
    primaryUse: "Deficiency, and clinician-guided pregnancy nausea",
    typicalDose: "1.3–1.7 mg/day meets adult needs. Pregnancy nausea protocols often use 10–25 mg three times daily of pyridoxine, sometimes with doxylamine, as a medicine — not a pre-workout.",
    upperLimit: "100 mg/day for adults. Neuropathy has been reported with prolonged intakes above that, and occasionally at lower chronic doses.",
    doseRange: {
      unit: "mg",
      alignedMin: 1.3,
      alignedMax: 25,
      highMax: 100,
      note: "Daily supplemental B6. Pregnancy nausea dosing can be higher and should be prescribed.",
    },
    forms: [
      { name: "Pyridoxine", note: "The form in most trials and in pregnancy-nausea protocols." },
      { name: "P5P", note: "The active phosphate. Not clearly safer or more effective for the claims on the label." },
    ],
    outcomes: [
      { goal: "pregnancy", grade: "B", effect: "Nausea, with a clinician", detail: "Pyridoxine, often with doxylamine, reduces pregnancy nausea. The dose and combination should be the one your prenatal clinician recommends." },
      { goal: "energy", grade: "D", effect: "No", detail: "B6 does not provide energy in replete people. High-dose B6 products are a neuropathy risk wearing an energy costume." },
      { goal: "mood", grade: "C", effect: "PMS data are mixed", detail: "Some premenstrual symptom trials used doses near the upper level. The benefit is modest and the neuropathy risk is why you do not stay there for months." },
    ],
    cautions: [
      "Tingling, numbness, or imbalance on a B6 product is a stop-now symptom.",
      "Do not stack a multi, a B-complex, an energy drink mix, and a PMS formula that each contain 50 mg.",
    ],
    interactions: [
      { with: "Levodopa", severity: "high", note: "B6 can reduce the effect of levodopa if carbidopa is not also in the regimen. Parkinson's medication is not a place to improvise." },
      { with: "Phenytoin and other anticonvulsants", severity: "moderate", note: "Bidirectional effects on levels. Coordinate with neurology." },
    ],
    whoShouldAvoid: [
      "Anyone already taking multiple products that contain B6.",
      "People with neuropathy that has not been evaluated.",
      "People on levodopa without a pharmacist's review.",
    ],
    keyStudies: [
      { title: "Pyridoxine for pregnancy nausea", year: 2010, design: "Guideline evidence review", finding: "Vitamin B6, alone or with doxylamine, is effective for nausea and vomiting of pregnancy at clinician-directed doses.", citation: "ACOG practice guidance on nausea and vomiting of pregnancy" },
    ],
    sources: [
      { label: "NIH ODS vitamin B6 fact sheet", url: "https://ods.od.nih.gov/factsheets/VitaminB6-HealthProfessional/" },
    ],
    goals: ["pregnancy", "energy", "mood"],
    safetyFlags: flags({ pregnancy: "discuss" }),
    timing: "With food. Pregnancy dosing should follow the schedule you were given, usually divided through the day.",
    testFirst: false,
    herb: false,
  },
];
