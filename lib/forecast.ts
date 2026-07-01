import { D9012Transaction, ForecastResult, RiskLevel } from "./types";

function getRiskLevel(returnRate: number): RiskLevel {
  if (returnRate < 0.15) return "Rendah";
  if (returnRate <= 0.3) return "Sedang";
  return "Tinggi";
}

function getRecommendedQty(
  forecastDemand: number,
  safetyStock: number,
  riskLevel: RiskLevel,
): number {
  const initialQty = forecastDemand + safetyStock;

  if (riskLevel === "Sedang") {
    return Math.max(0, Math.round(initialQty * 0.9));
  }

  if (riskLevel === "Tinggi") {
    return Math.max(0, Math.round(initialQty * 0.8));
  }

  return Math.max(0, Math.round(initialQty));
}

export function generateForecast(data: D9012Transaction[]): ForecastResult[] {
  const groups = new Map<string, D9012Transaction[]>();

  for (const row of data) {
    const key = `${row.outlet_code}__${row.product_code}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key)?.push(row);
  }

  const results: ForecastResult[] = [];

  for (const groupRows of groups.values()) {
    const first = groupRows[0];

    const totalDroppingQty = groupRows.reduce(
      (sum, row) => sum + row.dropping_qty,
      0,
    );
    const totalReturBsQty = groupRows.reduce(
      (sum, row) => sum + row.retur_bs_qty,
      0,
    );
    const totalReturBaikQty = groupRows.reduce(
      (sum, row) => sum + row.retur_baik_qty,
      0,
    );
    const totalReturQty = totalReturBsQty + totalReturBaikQty;
    const totalNetQty = groupRows.reduce((sum, row) => sum + row.net_qty, 0);

    const avgNetQty = groupRows.length > 0 ? totalNetQty / groupRows.length : 0;
    const returnRate =
      totalDroppingQty > 0 ? totalReturQty / totalDroppingQty : 0;

    const forecastDemand = Math.round(avgNetQty);
    const safetyStock = Math.ceil(forecastDemand * 0.1);
    const riskLevel = getRiskLevel(returnRate);
    const recommendedQty = getRecommendedQty(
      forecastDemand,
      safetyStock,
      riskLevel,
    );

    results.push({
      outlet_code: first.outlet_code,
      outlet_name: first.outlet_name,
      product_code: first.product_code,
      product_name: first.product_name,
      total_dropping_qty: totalDroppingQty,
      total_retur_bs_qty: totalReturBsQty,
      total_retur_baik_qty: totalReturBaikQty,
      total_retur_qty: totalReturQty,
      total_net_qty: totalNetQty,
      avg_net_qty: Number(avgNetQty.toFixed(2)),
      return_rate: returnRate,
      forecast_demand: forecastDemand,
      safety_stock: safetyStock,
      recommended_qty: recommendedQty,
      risk_level: riskLevel,
    });
  }

  return results.sort((a, b) => b.return_rate - a.return_rate);
}
