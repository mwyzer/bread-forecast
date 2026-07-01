import { D9012Transaction, ForecastSummary } from "./types";

export function generateSummary(data: D9012Transaction[]): ForecastSummary {
  const outletSet = new Set<string>();
  const productSet = new Set<string>();

  let totalDroppingQty = 0;
  let totalReturBsQty = 0;
  let totalReturBaikQty = 0;
  let totalNetQty = 0;

  for (const row of data) {
    outletSet.add(row.outlet_code);
    productSet.add(row.product_code);

    totalDroppingQty += row.dropping_qty;
    totalReturBsQty += row.retur_bs_qty;
    totalReturBaikQty += row.retur_baik_qty;
    totalNetQty += row.net_qty;
  }

  const totalReturQty = totalReturBsQty + totalReturBaikQty;
  const returnRate =
    totalDroppingQty > 0 ? totalReturQty / totalDroppingQty : 0;

  return {
    total_outlet: outletSet.size,
    total_product: productSet.size,
    total_dropping_qty: totalDroppingQty,
    total_retur_bs_qty: totalReturBsQty,
    total_retur_baik_qty: totalReturBaikQty,
    total_retur_qty: totalReturQty,
    total_net_qty: totalNetQty,
    return_rate: returnRate,
  };
}
