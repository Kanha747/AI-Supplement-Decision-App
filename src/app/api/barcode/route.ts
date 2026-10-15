import { findProductByBarcode, listIngredients } from "@/lib/queries";
import { lookupFood, searchDsldBarcode } from "@/lib/dsld";
import { buildCuratedReview } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code") ?? "";
  const digits = code.replace(/\D/g, "");
  if (digits.length < 6) {
    return Response.json({ error: "Enter at least 6 digits.", code: digits, local: null, dsld: [], food: null }, { status: 400 });
  }

  const found = await findProductByBarcode(digits);
  let local = null;
  if (found) {
    const library = await listIngredients();
    const review = buildCuratedReview(found.product, found.lines, library);
    local = {
      slug: found.product.slug,
      name: found.product.name,
      brand: found.product.brand,
      form: found.product.form,
      clarity: review.scores.clarity,
    };
  }

  const [dsldResult, foodResult] = await Promise.allSettled([
    searchDsldBarcode(digits),
    lookupFood(digits),
  ]);

  return Response.json({
    code: digits,
    local,
    dsld: dsldResult.status === "fulfilled" ? dsldResult.value : [],
    food: foodResult.status === "fulfilled" ? foodResult.value : null,
  });
}
