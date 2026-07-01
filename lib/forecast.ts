import { D9012Transaction, ForecastResult, RiskLevel } from "./types";

function getRiskLevel(returnRate: number): RiskLevel {
  if (returnRate < 0.05) return "Rendah";
  if (returnRate <= 0.1) return "Sedang";
  return "Tinggi";
}

function getRecommendedQty(
  forecastDemand: number,
  safetyStock: number,
  riskLevel: RiskLevel,
  returnRate: number,
): number {
  // Reduction factor based on return rate: higher retur = less allocation
  let reductionFactor: number;

  if (riskLevel === "Rendah") {
    reductionFactor = 1; // no reduction
  } else if (riskLevel === "Sedang") {
    // Mild reduction: keep safety stock, trim forecast proportionally
    reductionFactor = 1 - returnRate * 0.5;
  } else {
    // Aggressive reduction for high risk: reduce based on full return rate
    reductionFactor = 1 - returnRate;
  }

  const baseQty = forecastDemand * reductionFactor;
  const recommendedQty = Math.max(0, Math.round(baseQty + safetyStock));

  return recommendedQty;
}

function parseDate(dateStr: string): Date {
  // Handle Excel date formats: "DD/MM/YYYY", "YYYY-MM-DD", or Excel serial numbers
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;

  // Try DD/MM/YYYY
  const parts = dateStr.split(/[/\-]/);
  if (parts.length === 3) {
    const dayFirst = new Date(+parts[2], +parts[1] - 1, +parts[0]);
    if (!isNaN(dayFirst.getTime())) return dayFirst;
  }

  return new Date(0); // fallback
}

const RECENT_DAYS = 7; // Recent period window for forecast demand

export function generateForecast(data: D9012Transaction[]): ForecastResult[] {
  const groups = new Map<string, D9012Transaction[]>();

  // Group by outlet + product
  for (const row of data) {
    const key = `${row.outlet_code}__${row.product_code}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)?.push(row);
  }

  const results: ForecastResult[] = [];

  for (const groupRows of groups.values()) {
    // Sort by date ascending
    const sorted = [...groupRows].sort(
      (a, b) =>
        parseDate(a.dropping_date).getTime() -
        parseDate(b.dropping_date).getTime(),
    );

    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    // Find the cutoff date for "recent" period (last RECENT_DAYS from max date)
    const maxDate = parseDate(last.dropping_date);
    const cutoffDate = new Date(maxDate);
    cutoffDate.setDate(cutoffDate.getDate() - RECENT_DAYS);

    // Split into recent and older
    const recentRows = sorted.filter(
      (r) => parseDate(r.dropping_date) >= cutoffDate,
    );
    const olderRows = sorted.filter(
      (r) => parseDate(r.dropping_date) < cutoffDate,
    );

    // ── All-time totals ──
    const totalDroppingQty = sorted.reduce((s, r) => s + r.dropping_qty, 0);
    const totalReturBsQty = sorted.reduce((s, r) => s + r.retur_bs_qty, 0);
    const totalReturBaikQty = sorted.reduce((s, r) => s + r.retur_baik_qty, 0);
    const totalReturQty = totalReturBsQty + totalReturBaikQty;
    const totalNetQty = sorted.reduce((s, r) => s + r.net_qty, 0);

    // ── Recent period metrics ──
    const recentDropping = recentRows.reduce((s, r) => s + r.dropping_qty, 0);
    const recentNet = recentRows.reduce((s, r) => s + r.net_qty, 0);
    const recentDays = recentRows.length > 0 ? recentRows.length : 1;
    const avgNetQtyRecent = recentNet / recentDays;

    // ── Older period metrics (for trend detection) ──
    const olderDropping = olderRows.reduce((s, r) => s + r.dropping_qty, 0);
    const olderRetur = olderRows.reduce(
      (s, r) => s + r.retur_bs_qty + r.retur_baik_qty,
      0,
    );
    const olderReturnRate = olderDropping > 0 ? olderRetur / olderDropping : 0;

    // Overall return rate
    const returnRate =
      totalDroppingQty > 0 ? totalReturQty / totalDroppingQty : 0;

    const recentReturnRate =
      recentDropping > 0
        ? recentRows.reduce(
            (s, r) => s + r.retur_bs_qty + r.retur_baik_qty,
            0,
          ) / recentDropping
        : 0;

    // ── Trend detection ──
    // Compare recent return rate vs older return rate
    const trend =
      olderRows.length > 0 && recentReturnRate > olderReturnRate * 1.1
        ? "naik"
        : olderRows.length > 0 && recentReturnRate < olderReturnRate * 0.9
          ? "turun"
          : "stabil";

    // ── Forecast calculation ──
    // Use recent avg net qty as base forecast demand
    const forecastDemand = Math.round(avgNetQtyRecent);
    const safetyStock = Math.ceil(forecastDemand * 0.1);

    // Adjust based on trend
    let trendMultiplier = 1;
    if (trend === "turun") trendMultiplier = 1.05; // improving → send slightly more
    if (trend === "naik") trendMultiplier = 0.95; // worsening → send slightly less

    const riskLevel = getRiskLevel(returnRate);
    const recommendedQty = getRecommendedQty(
      Math.round(forecastDemand * trendMultiplier),
      safetyStock,
      riskLevel,
      returnRate,
    );

    // Overall avg net (for display)
    const avgNetQtyAll = sorted.length > 0 ? totalNetQty / sorted.length : 0;

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
      avg_net_qty: Number(avgNetQtyAll.toFixed(2)),
      return_rate: returnRate,
      forecast_demand: forecastDemand,
      safety_stock: safetyStock,
      recommended_qty: recommendedQty,
      risk_level: riskLevel,
      trend: trend as "naik" | "turun" | "stabil",
    });
  }

  return results.sort((a, b) => b.return_rate - a.return_rate);
}
