import { ingredientSeed } from "@/data/ingredients";
import { productSeed } from "@/data/products";

const tableStore = new Map<string, Array<Record<string, unknown>>>();

const getTableName = (table: unknown): string => {
  if (!table || typeof table !== "object") return "unknown";
  const symbol = Object.getOwnPropertySymbols(table).find((item) => item.toString().includes("drizzle:Name"));
  return symbol ? String((table as Record<PropertyKey, unknown>)[symbol]) : "unknown";
};

const getColumnName = (value: unknown): string | null => {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.name === "string") return candidate.name;
  const symbol = Object.getOwnPropertySymbols(candidate).find((item) => item.toString().includes("drizzle:Name"));
  const tableName = symbol ? (candidate as Record<PropertyKey, unknown>)[symbol] : null;
  return typeof tableName === "string" ? tableName : null;
};

const findLiteral = (value: unknown): unknown => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return value;
  const candidate = value as Record<string, unknown>;
  if (Array.isArray(candidate.queryChunks)) {
    for (const chunk of candidate.queryChunks) {
      const literal = findLiteral(chunk);
      if (literal !== undefined && literal !== "" && literal !== " = " && literal !== " in " && literal !== " and " && literal !== " desc") {
        return literal;
      }
    }
  }
  if (Array.isArray(candidate.value)) return candidate.value[0];
  if ("value" in candidate && candidate.value !== undefined && typeof candidate.value !== "object") return candidate.value;
  return undefined;
};

const matchesCondition = (condition: unknown, row: Record<string, unknown>): boolean => {
  if (!condition || typeof condition !== "object") return true;
  const candidate = condition as Record<string, unknown>;
  const chunks = Array.isArray(candidate.queryChunks) ? candidate.queryChunks : [];

  if (chunks.some((chunk) => typeof chunk === "string" && chunk.includes(" = "))) {
    const column = chunks.find((chunk) => getColumnName(chunk));
    const columnName = getColumnName(column);
    const literal = findLiteral(candidate);
    if (!columnName || literal === undefined) return true;
    return row[columnName] === literal;
  }

  if (chunks.some((chunk) => typeof chunk === "string" && chunk.includes(" in "))) {
    const column = chunks.find((chunk) => getColumnName(chunk));
    const columnName = getColumnName(column);
    const literal = findLiteral(candidate);
    if (!columnName || !Array.isArray(literal)) return true;
    return literal.includes(row[columnName] as never);
  }

  if (chunks.some((chunk) => typeof chunk === "string" && chunk.includes(" and "))) {
    const nested = chunks.filter((chunk) => chunk && typeof chunk === "object" && "queryChunks" in (chunk as object));
    return nested.every((chunk) => matchesCondition(chunk, row));
  }

  return true;
};

const orderColumn = (condition: unknown): string | null => {
  if (!condition || typeof condition !== "object") return null;
  const candidate = condition as Record<string, unknown>;
  const chunks = Array.isArray(candidate.queryChunks) ? candidate.queryChunks : [];
  for (const chunk of chunks) {
    const columnName = getColumnName(chunk);
    if (columnName) return columnName;
    if (chunk && typeof chunk === "object" && "queryChunks" in chunk) {
      const nested = orderColumn(chunk);
      if (nested) return nested;
    }
  }
  return null;
};

const sortByOrder = (rows: Array<Record<string, unknown>>, condition: unknown) => {
  const columnName = orderColumn(condition);
  if (!columnName) return rows;
  const chunks = Array.isArray((condition as { queryChunks?: unknown[] }).queryChunks)
    ? ((condition as { queryChunks?: unknown[] }).queryChunks as unknown[])
    : [];
  const direction = chunks.some((chunk) => typeof chunk === "string" && chunk.includes(" desc")) ? "desc" : "asc";

  return [...rows].sort((left, right) => {
    const leftValue = left[columnName] as string | number | Date | undefined | null;
    const rightValue = right[columnName] as string | number | Date | undefined | null;
    if (leftValue === rightValue) return 0;
    const comparison = String(leftValue ?? "").localeCompare(String(rightValue ?? ""));
    return direction === "desc" ? comparison * -1 : comparison;
  });
};

const projectRow = (row: Record<string, unknown>, selection: Record<string, unknown> | undefined) => {
  if (!selection) return row;
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(selection)) {
    const columnName = getColumnName(value);
    if (columnName) {
      output[key] = row[columnName];
    }
  }
  return output;
};

const ensureSeeded = () => {
  if (tableStore.size > 0) return;

  const productRows = productSeed.map((product, productIndex) => ({
    id: productIndex + 1,
    slug: product.slug,
    barcode: product.barcode,
    brand: product.brand,
    name: product.name,
    category: product.category,
    form: product.form,
    servingSize: product.servingSize,
    servingsPerContainer: product.servingsPerContainer,
    description: product.description,
    thirdPartyTested: product.thirdPartyTested,
    certifications: product.certifications,
    qualityNotes: product.qualityNotes,
    priceDisplay: product.priceDisplay,
    featured: product.featured,
    proprietaryBlend: product.proprietaryBlend,
    gummy: product.gummy,
    watchouts: product.watchouts,
    highlights: product.highlights,
  }));

  const productIdBySlug = new Map(productRows.map((item) => [item.slug, item.id]));
  const ingredientRows = ingredientSeed.map((ingredient, ingredientIndex) => ({
    id: ingredientIndex + 1,
    ...ingredient,
  }));

  const productIngredientRows = productSeed.flatMap((product) => {
    const productId = productIdBySlug.get(product.slug);
    if (productId === undefined) return [];
    return product.lines.map((line, lineIndex) => ({
      id: lineIndex + 1 + productSeed.reduce((total, current) => total + current.lines.length, 0),
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

  tableStore.set("ingredients", ingredientRows);
  tableStore.set("products", productRows);
  tableStore.set("product_ingredients", productIngredientRows);
  tableStore.set("consultations", []);
  tableStore.set("shelf_items", []);
};

class SelectQuery {
  constructor(
    private readonly table: unknown,
    private readonly selectedColumns?: Record<string, unknown>,
    private filter?: unknown,
    private sorter?: unknown,
    private limitValue?: number,
  ) {}

  where(condition: unknown) {
    this.filter = condition;
    return this;
  }

  orderBy(condition: unknown) {
    this.sorter = condition;
    return this;
  }

  limit(value: number) {
    this.limitValue = value;
    return this.execute();
  }

  execute() {
    ensureSeeded();
    const tableName = getTableName(this.table);
    const rows = tableStore.get(tableName) ?? [];
    const filtered = this.filter ? rows.filter((row) => matchesCondition(this.filter, row as Record<string, unknown>)) : rows;
    const sorted = this.sorter ? sortByOrder(filtered as Array<Record<string, unknown>>, this.sorter) : filtered;
    const limited = this.limitValue !== undefined ? sorted.slice(0, this.limitValue) : sorted;

    if (this.selectedColumns && Object.values(this.selectedColumns).some((value) => value && typeof value === "object" && "queryChunks" in value)) {
      const countMatch = limited.length > 0 ? [{ count: limited.length }] : [{ count: 0 }];
      return countMatch;
    }

    if (this.selectedColumns) {
      return limited.map((row) => projectRow(row as Record<string, unknown>, this.selectedColumns));
    }

    return limited;
  }

  then<TResult1 = Array<Record<string, unknown>>, TResult2 = never>(
    onfulfilled?: ((value: Array<Record<string, unknown>>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return Promise.resolve(this.execute()).then(onfulfilled, onrejected);
  }
}

const createFallbackDb = () => ({
  select: (selection?: Record<string, unknown>) => ({
    from: (table: unknown) => new SelectQuery(table, selection),
  }),
  insert: (table: unknown) => ({
    values: async (rows: Record<string, unknown> | Array<Record<string, unknown>>) => {
      ensureSeeded();
      const payload = Array.isArray(rows) ? rows : [rows];
      const tableName = getTableName(table);
      const existing = tableStore.get(tableName) ?? [];
      const nextId = existing.length + 1;
      const inserted = payload.map((row, index) => ({
        ...row,
        id: row.id ?? nextId + index,
      }));
      tableStore.set(tableName, [...existing, ...inserted]);
      return {
        onConflictDoNothing: async () => inserted,
        returning: (columns: Record<string, unknown>) => inserted.map((row) => projectRow(row, columns)),
      };
    },
  }),
  delete: (table: unknown) => ({
    where: async (condition: unknown) => {
      ensureSeeded();
      const tableName = getTableName(table);
      const rows = tableStore.get(tableName) ?? [];
      const remaining = rows.filter((row) => !matchesCondition(condition, row as Record<string, unknown>));
      tableStore.set(tableName, remaining);
      return remaining;
    },
  }),
  execute: async () => ({ ok: true }),
  transaction: async (callback: (tx: any) => Promise<unknown>) => callback(createFallbackDb()),
});

export const pool = null;
export const db = createFallbackDb() as any;
