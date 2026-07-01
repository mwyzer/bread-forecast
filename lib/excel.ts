import * as XLSX from "xlsx";
import { D9012Transaction, ForecastResult, ForecastSummary } from "./types";

/**
 * Parse an Excel file and return the first sheet's data as an array of row objects.
 * All header keys are trimmed and converted to uppercase for consistency.
 */
export async function parseExcelFile(
  file: File,
): Promise<Record<string, unknown>[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  const sheetNames = workbook.SheetNames;
  if (sheetNames.length === 0) {
    throw new Error("File Excel tidak memiliki sheet.");
  }

  const firstSheetName = sheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  if (!worksheet) {
    throw new Error("Sheet pertama tidak dapat dibaca.");
  }

  // Convert sheet to JSON with raw values
  const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
    worksheet,
    {
      raw: false,
      defval: "",
    },
  );

  if (jsonData.length === 0) {
    throw new Error("Sheet pertama tidak memiliki data.");
  }

  // Normalize header keys: trim whitespace and convert to uppercase
  const normalizedRows = jsonData.map((row) => {
    const normalized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      const normalizedKey = key.trim().toUpperCase();
      normalized[normalizedKey] = value;
    }
    return normalized;
  });

  return normalizedRows;
}

export function exportForecastToExcel(
  rawData: D9012Transaction[],
  forecastData: ForecastResult[],
  summary: ForecastSummary,
): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Forecast Result
  const forecastSheet = XLSX.utils.json_to_sheet(
    forecastData.map((row) => ({
      "Outlet Code": row.outlet_code,
      "Outlet Name": row.outlet_name,
      "Product Code": row.product_code,
      "Product Name": row.product_name,
      "Total Dropping Qty": row.total_dropping_qty,
      "Total Retur BS Qty": row.total_retur_bs_qty,
      "Total Retur Baik Qty": row.total_retur_baik_qty,
      "Total Retur Qty": row.total_retur_qty,
      "Total Net Qty": row.total_net_qty,
      "Avg Net Qty": row.avg_net_qty,
      "Return Rate %": Number((row.return_rate * 100).toFixed(2)),
      "Forecast Demand": row.forecast_demand,
      "Safety Stock": row.safety_stock,
      "Recommended Qty": row.recommended_qty,
      "Risk Level": row.risk_level,
    })),
  );
  XLSX.utils.book_append_sheet(wb, forecastSheet, "Forecast Result");

  // Sheet 2: Summary
  const summarySheet = XLSX.utils.json_to_sheet([
    { Metric: "Total Outlet", Value: summary.total_outlet },
    { Metric: "Total Product", Value: summary.total_product },
    { Metric: "Total Dropping Qty", Value: summary.total_dropping_qty },
    { Metric: "Total Retur BS Qty", Value: summary.total_retur_bs_qty },
    { Metric: "Total Retur Baik Qty", Value: summary.total_retur_baik_qty },
    { Metric: "Total Retur Qty", Value: summary.total_retur_qty },
    { Metric: "Total Net Qty", Value: summary.total_net_qty },
    {
      Metric: "Return Rate %",
      Value: Number((summary.return_rate * 100).toFixed(2)),
    },
  ]);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  // Sheet 3: Raw Data
  const rawSheet = XLSX.utils.json_to_sheet(
    rawData.map((row) => ({
      "Dropping Date": row.dropping_date,
      "Outlet Code": row.outlet_code,
      "Outlet Name": row.outlet_name,
      "Product Code": row.product_code,
      "Product Name": row.product_name,
      "Dropping Qty": row.dropping_qty,
      "Retur BS Qty": row.retur_bs_qty,
      "Retur Baik Qty": row.retur_baik_qty,
      "Net Qty": row.net_qty,
    })),
  );
  XLSX.utils.book_append_sheet(wb, rawSheet, "Raw Data");

  XLSX.writeFile(wb, "hasil_forecast_roti_D9012.xlsx");
}
