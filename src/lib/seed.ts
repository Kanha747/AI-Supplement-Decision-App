import { ingredientSeed } from "@/data/ingredients";
import { productSeed } from "@/data/products";
import { db } from "@/db";
import { ingredients, productIngredients, products } from "@/db/schema";
import { sql } from "drizzle-orm";

let pending: Promise<void> | null = null;

export function ensureSeeded() {
  if (!pending) {
    pending = seed().catch((error) => {
      pending = null;
      throw error;
    });
  }
  return pending;
}

async function seed() {
  const existing = await db.select({ count: sql<number>`count(*)::int` }).from(ingredients);
  if ((existing[0]?.count ?? 0) > 0) return;

  await db.transaction(async (tx: any) => {
    await tx.insert(ingredients).values(
      ingredientSeed.map((item) => ({
        ...item,
        doseRange: item.doseRange,
      })),
    );

    const inserted: Array<{ id: number; slug: string }> = await tx
      .insert(products)
      .values(
        productSeed.map(({ lines: _lines, ...product }) => ({
          ...product,
        })),
      )
      .returning({ id: products.id, slug: products.slug });

    const idBySlug = new Map(inserted.map((item) => [item.slug, item.id]));
    const lines = productSeed.flatMap((product) => {
      const productId = idBySlug.get(product.slug);
      if (!productId) return [];
      return product.lines.map((line) => ({
        productId,
        ingredientSlug: line.ingredientSlug,
        labelName: line.labelName,
        amountText: line.amountText,
        numericAmount: line.numericAmount,
        unit: line.unit,
        formName: line.formName,
        note: line.note,
        assessmentOverride: line.assessmentOverride,
      }));
    });

    if (lines.length) {
      await tx.insert(productIngredients).values(lines);
    }
  });
}
