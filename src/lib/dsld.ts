import { barcodeVariants } from "@/lib/format";
import type { DsldLabel } from "@/lib/scoring";

const BASE = "https://api.ods.od.nih.gov/dsld/v9";

export type DsldHit = {
  id: string;
  name: string;
  brand: string;
  form: string;
  offMarket: boolean;
  productType: string;
};

async function fetchJson(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Evidra/1.0 (educational supplement guide)",
    },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`DSLD responded ${response.status}`);
  }
  return response.json() as Promise<unknown>;
}

function asHits(payload: unknown): DsldHit[] {
  const hits = (payload as { hits?: unknown[] } | null)?.hits;
  if (!Array.isArray(hits)) return [];
  return hits
    .map((hit) => {
      const row = hit as {
        _id?: string | number;
        _source?: {
          fullName?: string;
          brandName?: string;
          offMarket?: number;
          physicalState?: { langualCodeDescription?: string };
          productType?: { langualCodeDescription?: string };
        };
      };
      if (!row._id) return null;
      return {
        id: String(row._id),
        name: row._source?.fullName || "Untitled label",
        brand: row._source?.brandName || "Unknown brand",
        form: row._source?.physicalState?.langualCodeDescription || "Supplement",
        offMarket: row._source?.offMarket === 1,
        productType: row._source?.productType?.langualCodeDescription || "",
      };
    })
    .filter((hit): hit is DsldHit => Boolean(hit));
}

export async function searchDsld(query: string, size = 6) {
  const url = `${BASE}/search-filter?q=${encodeURIComponent(query)}&size=${size}&status=2&sort_by=_score&sort_order=desc`;
  return asHits(await fetchJson(url));
}

export async function searchDsldBarcode(code: string) {
  const variants = barcodeVariants(code).slice(0, 4);
  for (const variant of variants) {
    const quoted = `"${variant}"`;
    const url = `${BASE}/search-filter?q=${encodeURIComponent(quoted)}&size=5&status=2`;
    try {
      const hits = asHits(await fetchJson(url));
      if (hits.length) return hits;
    } catch {
      return [];
    }
  }
  return [];
}

export async function getDsldLabel(id: string) {
  if (!/^\d+$/.test(id)) {
    throw new Error("Invalid label id");
  }
  const payload = await fetchJson(`${BASE}/label/${id}`);
  return payload as DsldLabel;
}

export type FoodHit = {
  name: string;
  brand: string;
  categories: string;
  image?: string;
  ingredients?: string;
  url: string;
};

export async function lookupFood(code: string): Promise<FoodHit | null> {
  const digits = code.replace(/\D/g, "");
  if (!digits) return null;
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${digits}.json?fields=code,product_name,brands,categories,image_front_small_url,ingredients_text,url`,
    {
      headers: { "User-Agent": "Evidra/1.0 (educational supplement guide)" },
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    },
  );
  if (!response.ok) return null;
  const payload = (await response.json()) as {
    status?: number;
    product?: {
      product_name?: string;
      brands?: string;
      categories?: string;
      image_front_small_url?: string;
      ingredients_text?: string;
      url?: string;
    };
  };
  if (payload.status !== 1 || !payload.product?.product_name) return null;
  return {
    name: payload.product.product_name,
    brand: payload.product.brands || "Unknown brand",
    categories: payload.product.categories || "Food product",
    image: payload.product.image_front_small_url,
    ingredients: payload.product.ingredients_text,
    url: payload.product.url || `https://world.openfoodfacts.org/product/${digits}`,
  };
}
