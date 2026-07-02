import { EstimasiOrderRow, ProductInfo } from "./types";

/**
 * Calculate CBP (CBP = Gross amount): SUMPRODUCT of price × qty across all products.
 */
export function calcCbp(
  qtyPerProduct: Record<string, number>,
  products: ProductInfo[],
): number {
  let total = 0;
  for (const p of products) {
    const qty = qtyPerProduct[p.shortName] ?? 0;
    total += p.price * qty;
  }
  return total;
}

/**
 * Calculate RBP: CBP after discount.
 * RBP = CBP - (CBP × discPercent / 100)
 */
export function calcRbp(cbp: number, discPercent: number): number {
  return cbp - (cbp * discPercent) / 100;
}

/**
 * Calculate RBP Net: RBP exclude PPN (divided by 1.11).
 * RBP Net = ROUND(RBP / 1.11, 2)
 */
export function calcRbpNet(rbp: number): number {
  return Math.round((rbp / 1.11) * 100) / 100;
}

/**
 * Calculate total QTY: sum of all product quantities in a row.
 */
export function calcTotalQty(qtyPerProduct: Record<string, number>): number {
  return Object.values(qtyPerProduct).reduce((sum, q) => sum + q, 0);
}

/**
 * Calculate # Items: count of products with qty > 0.
 */
export function calcItemCount(qtyPerProduct: Record<string, number>): number {
  return Object.values(qtyPerProduct).filter((q) => q > 0).length;
}

/**
 * Compute all derived fields for a store row and return the complete row.
 */
export function computeOrderRow(
  row: Omit<
    EstimasiOrderRow,
    "cbp" | "rbp" | "rbpNet" | "totalQty" | "itemCount"
  >,
  products: ProductInfo[],
): EstimasiOrderRow {
  const cbp = calcCbp(row.qtyPerProduct, products);
  const rbp = calcRbp(cbp, row.discPercent);
  const rbpNet = calcRbpNet(rbp);
  const totalQty = calcTotalQty(row.qtyPerProduct);
  const itemCount = calcItemCount(row.qtyPerProduct);

  return {
    ...row,
    cbp,
    rbp,
    rbpNet,
    totalQty,
    itemCount,
  };
}
