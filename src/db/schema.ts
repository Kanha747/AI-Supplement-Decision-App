import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type {
  DoseAssessment,
  DoseRange,
  EvidenceGrade,
  FormNote,
  GoalId,
  Interaction,
  Outcome,
  SafetyFlags,
  SourceLink,
  Study,
} from "@/data/types";

export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  aliases: jsonb("aliases").$type<string[]>().notNull(),
  category: text("category").notNull(),
  summary: text("summary").notNull(),
  mechanism: text("mechanism").notNull(),
  evidenceGrade: text("evidence_grade").$type<EvidenceGrade>().notNull(),
  effectiveness: integer("effectiveness").notNull(),
  safety: integer("safety").notNull(),
  primaryUse: text("primary_use").notNull(),
  typicalDose: text("typical_dose").notNull(),
  upperLimit: text("upper_limit").notNull(),
  doseRange: jsonb("dose_range").$type<DoseRange | null>(),
  forms: jsonb("forms").$type<FormNote[]>().notNull(),
  outcomes: jsonb("outcomes").$type<Outcome[]>().notNull(),
  cautions: jsonb("cautions").$type<string[]>().notNull(),
  interactions: jsonb("interactions").$type<Interaction[]>().notNull(),
  whoShouldAvoid: jsonb("who_should_avoid").$type<string[]>().notNull(),
  keyStudies: jsonb("key_studies").$type<Study[]>().notNull(),
  sources: jsonb("sources").$type<SourceLink[]>().notNull(),
  goals: jsonb("goals").$type<GoalId[]>().notNull(),
  safetyFlags: jsonb("safety_flags").$type<SafetyFlags>().notNull(),
  timing: text("timing").notNull(),
  testFirst: boolean("test_first").notNull().default(false),
  herb: boolean("herb").notNull().default(false),
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    barcode: text("barcode").notNull(),
    brand: text("brand").notNull(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    form: text("form").notNull(),
    servingSize: text("serving_size").notNull(),
    servingsPerContainer: text("servings_per_container").notNull(),
    description: text("description").notNull(),
    thirdPartyTested: boolean("third_party_tested").notNull().default(false),
    certifications: jsonb("certifications").$type<string[]>().notNull(),
    qualityNotes: text("quality_notes").notNull(),
    priceDisplay: text("price_display").notNull(),
    featured: boolean("featured").notNull().default(false),
    proprietaryBlend: boolean("proprietary_blend").notNull().default(false),
    gummy: boolean("gummy").notNull().default(false),
    watchouts: jsonb("watchouts").$type<string[]>().notNull(),
    highlights: jsonb("highlights").$type<string[]>().notNull(),
  },
  (table) => [uniqueIndex("products_barcode_unique").on(table.barcode)],
);

export const productIngredients = pgTable("product_ingredients", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  ingredientSlug: text("ingredient_slug").notNull(),
  labelName: text("label_name").notNull(),
  amountText: text("amount_text").notNull(),
  numericAmount: doublePrecision("numeric_amount"),
  unit: text("unit"),
  formName: text("form_name"),
  note: text("note"),
  assessmentOverride: text("assessment_override").$type<DoseAssessment | null>(),
});

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  profile: jsonb("profile").$type<Record<string, unknown>>().notNull(),
  goals: jsonb("goals").$type<string[]>().notNull(),
  summary: text("summary").notNull(),
  recommendations: jsonb("recommendations").$type<Record<string, unknown>>().notNull(),
  polished: boolean("polished").notNull().default(false),
});

export const shelfItems = pgTable(
  "shelf_items",
  {
    id: serial("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    kind: text("kind").notNull(),
    ref: text("ref").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle").notNull().default(""),
    href: text("href").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("shelf_session_ref_unique").on(table.sessionId, table.kind, table.ref),
  ],
);
