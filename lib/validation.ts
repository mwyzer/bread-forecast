import { EstimasiOrderRow, ProductInfo } from "./types";
import { PRODUCT_MAP } from "./products";

/**
 * Required base columns for the Weekly Estimasi Order template.
 * Product columns (short names) are validated dynamically from the product catalog.
 */
const REQUIRED_BASE_COLUMNS = [
  "NO",
  "TANGGAL",
  "SALESMAN CODE",
  "SALESMAN NAME",
  "STORE",
  "STORE TYPE",
  "CLASSIFICATION",
  "SALES TYPE",
  "DISC %",
] as const;

/**
 * Validate that raw parsed rows have the expected base columns.
 * Product columns are matched from the product catalog.
 */
export function validateEstimasiColumns(
  headers: string[],
  products: ProductInfo[],
): { isValid: boolean; errors: string[]; productColumns: string[] } {
  const errors: string[] = [];

  // Check base columns
  const missingBase = REQUIRED_BASE_COLUMNS.filter(
    (col) => !headers.includes(col),
  );
  if (missingBase.length > 0) {
    errors.push(`Kolom wajib tidak ditemukan: ${missingBase.join(", ")}.`);
  }

  // Match product columns against the known catalog
  const productColumns = products
    .map((p) => p.shortName)
    .filter((name) => headers.includes(name));

  const missingProducts = products
    .map((p) => p.shortName)
    .filter((name) => !headers.includes(name));

  if (productColumns.length === 0) {
    errors.push("Tidak ditemukan kolom produk yang cocok dengan katalog SKU.");
  } else if (missingProducts.length > 0 && missingProducts.length < 67) {
    // Only warn if some are missing (not all)
    // Don't flood with all 67 missing names
  }

  return {
    isValid: errors.length === 0,
    errors,
    productColumns,
  };
}

/**
 * Parse and validate a single store row into an EstimasiOrderRow (without computed fields).
 */
export function parseEstimasiRow(
  row: Record<string, unknown>,
  productColumns: string[],
  products: ProductInfo[],
  rowIndex: number,
): {
  data: Omit<
    EstimasiOrderRow,
    "cbp" | "rbp" | "rbpNet" | "totalQty" | "itemCount"
  > | null;
  errors: string[];
} {
  const errors: string[] = [];

  const discRaw = Number(row["DISC %"] ?? 10);
  const discPercent = isNaN(discRaw) ? 10 : discRaw;

  // Parse product quantities
  const qtyPerProduct: Record<string, number> = {};
  for (const col of productColumns) {
    const rawVal = row[col];
    if (rawVal === "" || rawVal === null || rawVal === undefined) {
      qtyPerProduct[col] = 0;
    } else {
      const num = Number(rawVal);
      if (isNaN(num)) {
        errors.push(
          `Baris ${rowIndex + 1}: Kolom "${col}" harus berupa angka, ditemukan: "${rawVal}".`,
        );
        qtyPerProduct[col] = 0;
      } else {
        qtyPerProduct[col] = num;
      }
    }
  }

  // Also set zero for any products in catalog not in this file
  for (const p of products) {
    if (!(p.shortName in qtyPerProduct)) {
      qtyPerProduct[p.shortName] = 0;
    }
  }

  const store = String(row["STORE"] ?? "").trim();
  if (!store) {
    return { data: null, errors: [`Baris ${rowIndex + 1}: STORE kosong.`] };
  }

  return {
    data: {
      no: Number(row["NO"] ?? rowIndex + 1),
      tanggal: String(row["TANGGAL"] ?? "").trim(),
      salesmanCode: String(row["SALESMAN CODE"] ?? "").trim(),
      salesmanName: String(row["SALESMAN NAME"] ?? "").trim(),
      store,
      storeType: String(row["STORE TYPE"] ?? "").trim(),
      classification: String(row["CLASSIFICATION"] ?? "").trim(),
      salesType: String(row["SALES TYPE"] ?? "Consignment").trim(),
      remarks: String(row["REMARKS"] ?? "").trim(),
      discPercent,
      qtyPerProduct,
    },
    errors,
  };
}

/**
 * Validate raw Excel rows and parse them into EstimasiOrderRow data
 * (without computed fields — call computeOrderRow() from calc.ts afterwards).
 */
export function validateAndParseEstimasiRows(
  rows: Record<string, unknown>[],
  products: ProductInfo[],
): {
  isValid: boolean;
  data: Omit<
    EstimasiOrderRow,
    "cbp" | "rbp" | "rbpNet" | "totalQty" | "itemCount"
  >[];
  errors: string[];
} {
  const errors: string[] = [];

  if (rows.length === 0) {
    return {
      isValid: false,
      data: [],
      errors: ["Sheet tidak memiliki data."],
    };
  }

  const headers = Object.keys(rows[0]);
  const colValidation = validateEstimasiColumns(headers, products);

  errors.push(...colValidation.errors);
  if (!colValidation.isValid && colValidation.productColumns.length === 0) {
    return { isValid: false, data: [], errors };
  }

  const productColumns = colValidation.productColumns;
  const data: Omit<
    EstimasiOrderRow,
    "cbp" | "rbp" | "rbpNet" | "totalQty" | "itemCount"
  >[] = [];

  const MAX_ERRORS = 15;

  for (let i = 0; i < rows.length; i++) {
    const result = parseEstimasiRow(rows[i], productColumns, products, i);
    if (result.errors.length > 0 && errors.length < MAX_ERRORS) {
      errors.push(...result.errors);
    }
    if (result.data) {
      data.push(result.data);
    }
  }

  if (errors.length >= MAX_ERRORS) {
    errors.push(`... dan error lainnya (maks ${MAX_ERRORS} ditampilkan).`);
  }

  return {
    isValid: errors.length === 0,
    data,
    errors,
  };
}
