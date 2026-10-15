import { db } from "@/db";
import { ingredients, productIngredients, products } from "@/db/schema";
import { barcodeVariants } from "@/lib/format";
import { ensureSeeded } from "@/lib/seed";
import { eq, inArray } from "drizzle-orm";

export type ProductWithLines = {
  product: typeof products.$inferSelect;
  lines: Array<typeof productIngredients.$inferSelect>;
};

export async function listIngredients(): Promise<Array<typeof ingredients.$inferSelect>> {
  await ensureSeeded();
  return db.select().from(ingredients) as Promise<Array<typeof ingredients.$inferSelect>>;
}

export async function getIngredient(slug: string): Promise<typeof ingredients.$inferSelect | null> {
  await ensureSeeded();
  const rows = (await db.select().from(ingredients).where(eq(ingredients.slug, slug)).limit(1)) as Array<typeof ingredients.$inferSelect>;
  return rows[0] ?? null;
}

export async function listProducts(): Promise<Array<typeof products.$inferSelect>> {
  await ensureSeeded();
  return db.select().from(products) as Promise<Array<typeof products.$inferSelect>>;
}

export async function getProduct(slug: string): Promise<ProductWithLines | null> {
  await ensureSeeded();
  const rows = (await db.select().from(products).where(eq(products.slug, slug)).limit(1)) as Array<typeof products.$inferSelect>;
  const product = rows[0];
  if (!product) return null;
  const lines = (await db
    .select()
    .from(productIngredients)
    .where(eq(productIngredients.productId, product.id))) as Array<typeof productIngredients.$inferSelect>;
  return { product, lines };
}

export async function findProductByBarcode(code: string): Promise<ProductWithLines | null> {
  await ensureSeeded();
  const variants = barcodeVariants(code);
  if (!variants.length) return null;
  const digits = variants.filter((item) => /^\d+$/.test(item));
  const rows = (await db.select().from(products).where(inArray(products.barcode, digits.length ? digits : variants))) as Array<typeof products.$inferSelect>;
  const product = rows[0];
  if (!product) return null;
  const lines = (await db.select().from(productIngredients).where(eq(productIngredients.productId, product.id))) as Array<typeof productIngredients.$inferSelect>;
  return { product, lines };
}

export async function listProductLines(): Promise<Array<typeof productIngredients.$inferSelect>> {
  await ensureSeeded();
  return db.select().from(productIngredients) as Promise<Array<typeof productIngredients.$inferSelect>>;
}

export async function productsForIngredient(slug: string): Promise<Array<typeof products.$inferSelect>> {
  await ensureSeeded();
  const lines = (await db
    .select()
    .from(productIngredients)
    .where(eq(productIngredients.ingredientSlug, slug))) as Array<typeof productIngredients.$inferSelect>;
  if (!lines.length) return [];
  const ids = [...new Set(lines.map((line) => line.productId))];
  return (db.select().from(products).where(inArray(products.id, ids))) as Promise<Array<typeof products.$inferSelect>>;
}
