import { D9012Transaction } from "./types";

const REQUIRED_COLUMNS = [
  "DROPPING DATE",
  "OUTLET CODE",
  "OUTLET NAME",
  "PRODUCT CODE",
  "PRODUCT NAME",
  "DROPPING QTY",
  "RETUR BS QTY",
  "RETUR BAIK QTY",
  "NET QTY",
] as const;

const NUMERIC_COLUMNS = [
  "DROPPING QTY",
  "RETUR BS QTY",
  "RETUR BAIK QTY",
  "NET QTY",
] as const;

/**
 * Validate and transform raw Excel rows into D9012Transaction objects.
 * Returns validation result with valid data and list of errors.
 */
export function validateD9012Rows(rows: Record<string, unknown>[]): {
  isValid: boolean;
  data: D9012Transaction[];
  errors: string[];
} {
  const errors: string[] = [];

  if (rows.length === 0) {
    return {
      isValid: false,
      data: [],
      errors: ["Sheet pertama tidak memiliki data."],
    };
  }

  // Check for required columns using the first row's keys (normalized)
  const headers = Object.keys(rows[0]);
  const missingColumns = REQUIRED_COLUMNS.filter(
    (col) => !headers.includes(col),
  );

  if (missingColumns.length > 0) {
    errors.push(`Kolom wajib tidak ditemukan: ${missingColumns.join(", ")}.`);
    return { isValid: false, data: [], errors };
  }

  // Map rows to D9012Transaction
  const data: D9012Transaction[] = [];
  const MAX_ERRORS = 10;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = i + 2; // Excel row number (1-indexed, +1 for header)

    // Parse numeric values
    const numericValues: Record<string, number> = {};
    for (const col of NUMERIC_COLUMNS) {
      const rawValue = row[col];
      if (rawValue === "" || rawValue === null || rawValue === undefined) {
        numericValues[col] = 0;
      } else {
        const num = Number(rawValue);
        if (isNaN(num)) {
          if (errors.length < MAX_ERRORS) {
            errors.push(`Baris ${rowNumber}: ${col} harus berupa angka.`);
          }
        } else {
          numericValues[col] = num;
        }
      }
    }

    // Skip row if any numeric field has an error
    if (NUMERIC_COLUMNS.some((col) => !(col in numericValues))) {
      continue;
    }

    const transaction: D9012Transaction = {
      dropping_date: String(row["DROPPING DATE"] ?? "").trim(),
      outlet_code: String(row["OUTLET CODE"] ?? "").trim(),
      outlet_name: String(row["OUTLET NAME"] ?? "").trim(),
      product_code: String(row["PRODUCT CODE"] ?? "").trim(),
      product_name: String(row["PRODUCT NAME"] ?? "").trim(),
      dropping_qty: numericValues["DROPPING QTY"],
      retur_bs_qty: numericValues["RETUR BS QTY"],
      retur_baik_qty: numericValues["RETUR BAIK QTY"],
      net_qty: numericValues["NET QTY"],
    };

    data.push(transaction);
  }

  // If there were too many errors, add a note
  if (errors.length >= MAX_ERRORS) {
    errors.push(
      `... dan ${rows.length - data.length - MAX_ERRORS} error lainnya.`,
    );
  }

  return {
    isValid: errors.length === 0,
    data,
    errors,
  };
}
