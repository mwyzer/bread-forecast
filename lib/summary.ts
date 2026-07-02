import {
  EstimasiOrderRow,
  GrandTotals,
  RekapByTypeRow,
  RekapRow,
  SalesmanSummary,
} from "./types";
import { PRODUCT_CATALOG } from "./products";

/**
 * Generate Rekap: per-SKU total QTY across all stores.
 * Mirrors the "Rekap" sheet in the workbook.
 */
export function generateRekap(stores: EstimasiOrderRow[]): RekapRow[] {
  return PRODUCT_CATALOG.map((product, index) => {
    const totalQty = stores.reduce((sum, store) => {
      return sum + (store.qtyPerProduct[product.shortName] ?? 0);
    }, 0);

    return {
      no: index + 1,
      shortName: product.shortName,
      qty: totalQty,
      totalQty,
    };
  });
}

/**
 * Generate Rekap by Type: grouped by Store Type and Classification.
 * Mirrors the "Rekap by Type" sheet in the workbook.
 */
export function generateRekapByType(
  stores: EstimasiOrderRow[],
): RekapByTypeRow[] {
  const groupMap = new Map<string, RekapByTypeRow>();

  for (const store of stores) {
    const key = `${store.storeType}||${store.classification}`;
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        storeType: store.storeType,
        classification: store.classification,
        qty: 0,
        cbp: 0,
        rbp: 0,
        rbpExcludePpn: 0,
      });
    }
    const entry = groupMap.get(key)!;
    entry.qty += store.totalQty;
    entry.cbp += store.cbp;
    entry.rbp += store.rbp;
    entry.rbpExcludePpn += store.rbpNet;
  }

  return Array.from(groupMap.values());
}

/**
 * Generate salesman summaries: aggregates per salesman.
 */
export function generateSalesmanSummaries(
  stores: EstimasiOrderRow[],
): SalesmanSummary[] {
  const map = new Map<string, SalesmanSummary>();

  for (const store of stores) {
    const key = store.salesmanCode;
    if (!map.has(key)) {
      map.set(key, {
        salesmanCode: key,
        salesmanName: store.salesmanName,
        storeCount: 0,
        totalQty: 0,
        totalCbp: 0,
        totalRbp: 0,
        totalRbpNet: 0,
      });
    }
    const entry = map.get(key)!;
    entry.storeCount++;
    entry.totalQty += store.totalQty;
    entry.totalCbp += store.cbp;
    entry.totalRbp += store.rbp;
    entry.totalRbpNet += store.rbpNet;
  }

  return Array.from(map.values());
}

/**
 * Generate grand totals across all stores.
 */
export function generateGrandTotals(stores: EstimasiOrderRow[]): GrandTotals {
  return {
    totalQty: stores.reduce((s, r) => s + r.totalQty, 0),
    totalCbp: stores.reduce((s, r) => s + r.cbp, 0),
    totalRbp: stores.reduce((s, r) => s + r.rbp, 0),
    totalRbpNet: stores.reduce((s, r) => s + r.rbpNet, 0),
  };
}
