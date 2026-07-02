import * as XLSX from "xlsx";
import { PRODUCT_CATALOG, PRODUCT_SHORT_NAMES } from "./products";
import { validateAndParseEstimasiRows } from "./validation";
import { computeOrderRow } from "./calc";
import {
  EstimasiOrderRow,
  EstimasiWorkbook,
  RekapRow,
  RekapByTypeRow,
  SalesmanSummary,
  GrandTotals,
  WorkbookMetadata,
} from "./types";
import {
  generateRekap,
  generateRekapByType,
  generateSalesmanSummaries,
  generateGrandTotals,
} from "./summary";

/**
 * Detect the main data sheet name (date-formatted, e.g. "2026-07-04").
 */
function findMainSheet(workbook: XLSX.WorkBook): string | null {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  for (const name of workbook.SheetNames) {
    if (datePattern.test(name)) return name;
  }
  // Fallback: return first sheet that isn't "Rekap" or "Rekap by Type"
  for (const name of workbook.SheetNames) {
    if (name !== "Rekap" && name !== "Rekap by Type") return name;
  }
  return workbook.SheetNames[0] ?? null;
}

/**
 * Parse the main estimasi order sheet.
 *
 * The sheet structure (from the template):
 *   Row 1: product short names in product columns (P onwards)
 *   Row 2: headers + product prices in product columns
 *   Rows 3–N: store data rows
 *
 * We use sheet_to_json with header row detection to get column names.
 */
export async function parseEstimasiExcel(
  file: File,
): Promise<EstimasiWorkbook> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  if (workbook.SheetNames.length === 0) {
    throw new Error("File Excel tidak memiliki sheet.");
  }

  const mainSheetName = findMainSheet(workbook);
  if (!mainSheetName) {
    throw new Error("Tidak dapat menemukan sheet data utama.");
  }

  const worksheet = workbook.Sheets[mainSheetName];
  if (!worksheet) {
    throw new Error(`Sheet "${mainSheetName}" tidak dapat dibaca.`);
  }

  // Convert to JSON — the xlsx library will use the first row as headers
  // We read raw values and handle product columns ourselves
  const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
    worksheet,
    { raw: false, defval: "" },
  );

  if (jsonData.length === 0) {
    throw new Error(`Sheet "${mainSheetName}" tidak memiliki data.`);
  }

  // Normalize header keys: trim whitespace and convert to uppercase
  const normalizedRows = jsonData.map((row) => {
    const normalized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      // Preserve original case for product short names — normalize only base columns
      const trimmedKey = key.trim();
      const upperKey = trimmedKey.toUpperCase();
      // If it's a known base column, use uppercase
      const baseCols = [
        "NO",
        "TANGGAL",
        "SALESMAN CODE",
        "SALESMAN NAME",
        "STORE",
        "STORE TYPE",
        "CLASSIFICATION",
        "SALES TYPE",
        "REMARKS",
        "DISC %",
        "CBP",
        "RBP",
        "RBP NET",
        "QTY",
        "# ITEMS",
      ];
      if (baseCols.includes(upperKey)) {
        normalized[upperKey] = value;
      } else {
        // Keep original for product names (they may have mixed case like "RJKU II")
        normalized[trimmedKey] = value;
      }
    }
    return normalized;
  });

  // Validate and parse rows
  const validation = validateAndParseEstimasiRows(
    normalizedRows,
    PRODUCT_CATALOG,
  );

  if (!validation.isValid && validation.data.length === 0) {
    throw new Error(
      validation.errors.length > 0
        ? validation.errors.join("\n")
        : "Data tidak valid. Periksa format file.",
    );
  }

  // Compute derived fields for each store row
  const stores: EstimasiOrderRow[] = validation.data.map((row) =>
    computeOrderRow(row, PRODUCT_CATALOG),
  );

  // Generate summaries
  const salesmanSummaries = generateSalesmanSummaries(stores);
  const grandTotals = generateGrandTotals(stores);
  const rekap = generateRekap(stores);
  const rekapByType = generateRekapByType(stores);

  // Determine metadata
  const tanggal = stores[0]?.tanggal ?? "";
  const sheetDate = mainSheetName;

  // Build periode from dates in the data
  const dates = stores
    .map((s) => s.tanggal)
    .filter(Boolean)
    .sort();
  const periodeStart = dates[0] ?? sheetDate;
  const periodeEnd = dates[dates.length - 1] ?? sheetDate;
  const formattedPeriode = `(${periodeStart} - ${periodeEnd})`;

  const metadata: WorkbookMetadata = {
    periode: formattedPeriode,
    depo: "D/BGR/CITEREUP/PT. MUD/CBT",
    date: new Date().toLocaleDateString("en-GB"),
    sheetDate,
  };

  return {
    metadata,
    products: PRODUCT_CATALOG,
    stores,
    salesmanSummaries,
    grandTotals,
    rekap,
    rekapByType,
  };
}

/**
 * Export the estimasi workbook to an .xlsx file.
 * Produces 3 sheets matching the original template structure.
 */
export function exportEstimasiToExcel(workbook: EstimasiWorkbook): void {
  const wb = XLSX.utils.book_new();
  const {
    metadata,
    stores,
    salesmanSummaries,
    grandTotals,
    rekap,
    rekapByType,
  } = workbook;

  // ── Sheet 1: Main order sheet (named by date) ──
  const mainRows: Record<string, unknown>[] = [];

  for (const store of stores) {
    const row: Record<string, unknown> = {
      NO: store.no,
      TANGGAL: store.tanggal,
      "SALESMAN CODE": store.salesmanCode,
      "SALESMAN NAME": store.salesmanName,
      STORE: store.store,
      "STORE TYPE": store.storeType,
      CLASSIFICATION: store.classification,
      "SALES TYPE": store.salesType,
      REMARKS: store.remarks,
      "DISC %": store.discPercent,
      CBP: store.cbp,
      RBP: store.rbp,
      "RBP NET": store.rbpNet,
      QTY: store.totalQty,
      "# ITEMS": store.itemCount,
    };
    // Add product qty columns
    for (const name of PRODUCT_SHORT_NAMES) {
      row[name] = store.qtyPerProduct[name] ?? 0;
    }
    mainRows.push(row);
  }

  // Add grand total row (row 97 in template)
  const totalRow: Record<string, unknown> = {
    NO: "",
    TANGGAL: "",
    "SALESMAN CODE": "",
    "SALESMAN NAME": "",
    STORE: "TOTAL",
    "STORE TYPE": "",
    CLASSIFICATION: "",
    "SALES TYPE": "",
    REMARKS: "",
    "DISC %": "",
    CBP: grandTotals.totalCbp,
    RBP: grandTotals.totalRbp,
    "RBP NET": grandTotals.totalRbpNet,
    QTY: grandTotals.totalQty,
    "# ITEMS": "",
  };
  for (const name of PRODUCT_SHORT_NAMES) {
    totalRow[name] = rekap.find((r) => r.shortName === name)?.qty ?? 0;
  }
  mainRows.push(totalRow);

  // Add salesman summary rows (rows 98-107 in template)
  for (const sm of salesmanSummaries) {
    const smRow: Record<string, unknown> = {
      NO: "",
      TANGGAL: `Kuota ${sm.salesmanName}`,
      "SALESMAN CODE": sm.salesmanCode,
      "SALESMAN NAME": sm.salesmanName,
      STORE: `${sm.storeCount} toko`,
      "STORE TYPE": "",
      CLASSIFICATION: "",
      "SALES TYPE": "",
      REMARKS: "",
      "DISC %": "",
      CBP: sm.totalCbp,
      RBP: sm.totalRbp,
      "RBP NET": sm.totalRbpNet,
      QTY: sm.totalQty,
      "# ITEMS": "",
    };
    for (const name of PRODUCT_SHORT_NAMES) {
      smRow[name] = "";
    }
    mainRows.push(smRow);
    // Total Estimasi row
    const teRow: Record<string, unknown> = {
      NO: "",
      TANGGAL: "Total Estimasi",
      "SALESMAN CODE": "",
      "SALESMAN NAME": "",
      STORE: "",
      "STORE TYPE": "",
      CLASSIFICATION: "",
      "SALES TYPE": "",
      REMARKS: "",
      "DISC %": "",
      CBP: sm.totalCbp,
      RBP: sm.totalRbp,
      "RBP NET": sm.totalRbpNet,
      QTY: sm.totalQty,
      "# ITEMS": "",
    };
    for (const name of PRODUCT_SHORT_NAMES) {
      teRow[name] = "";
    }
    mainRows.push(teRow);
  }

  const mainSheet = XLSX.utils.json_to_sheet(mainRows);
  XLSX.utils.book_append_sheet(wb, mainSheet, metadata.sheetDate);

  // ── Sheet 2: Rekap ──
  const rekapRows = [
    { PERIODE: metadata.periode, DEPO: metadata.depo, DATE: metadata.date },
    {}, // empty row spacer
    {}, // empty row spacer
    {
      NO: "No",
      "SHORT NAME": "Short Name",
      QTY: "QTY",
      "TOTAL QTY": "TOTAL QTY",
    },
    ...rekap.map((r) => ({
      NO: r.no,
      "SHORT NAME": r.shortName,
      QTY: r.qty,
      "TOTAL QTY": r.totalQty,
    })),
  ];
  const rekapSheet = XLSX.utils.json_to_sheet(rekapRows, {
    skipHeader: true,
  });
  XLSX.utils.book_append_sheet(wb, rekapSheet, "Rekap");

  // ── Sheet 3: Rekap by Type ──
  const typeHeaderRow = {
    "MAIN STORE": "Main Store",
    KLASIFIKASI: "Klasifikasi",
    "STORE TYPE": "Store Type",
    QTY: "QTY",
    CBP: "CBP",
    RBP: "RBP",
    "RBP EXCLUDE PPN": "RBP Exclude PPN",
  };
  const typeRows = [
    typeHeaderRow,
    ...rekapByType.map((r) => ({
      "MAIN STORE": r.storeType,
      KLASIFIKASI: r.classification,
      "STORE TYPE": r.storeType,
      QTY: r.qty,
      CBP: r.cbp,
      RBP: r.rbp,
      "RBP EXCLUDE PPN": r.rbpExcludePpn,
    })),
  ];
  const typeSheet = XLSX.utils.json_to_sheet(typeRows, {
    skipHeader: true,
  });
  XLSX.utils.book_append_sheet(wb, typeSheet, "Rekap by Type");

  XLSX.writeFile(wb, `Estimasi_Order_${metadata.sheetDate}.xlsx`);
}
