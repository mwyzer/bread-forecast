export type RiskLevel = "Rendah" | "Sedang" | "Tinggi";
export type TrendLevel = "naik" | "turun" | "stabil";

export type D9012Transaction = {
  dropping_date: string;
  outlet_code: string;
  outlet_name: string;
  product_code: string;
  product_name: string;
  dropping_qty: number;
  retur_bs_qty: number;
  retur_baik_qty: number;
  net_qty: number;
};

export type ForecastResult = {
  outlet_code: string;
  outlet_name: string;
  product_code: string;
  product_name: string;
  total_dropping_qty: number;
  total_retur_bs_qty: number;
  total_retur_baik_qty: number;
  total_retur_qty: number;
  total_net_qty: number;
  avg_net_qty: number;
  return_rate: number;
  forecast_demand: number;
  safety_stock: number;
  recommended_qty: number;
  risk_level: RiskLevel;
  trend: TrendLevel;
};

export type ForecastSummary = {
  total_outlet: number;
  total_product: number;
  total_dropping_qty: number;
  total_retur_bs_qty: number;
  total_retur_baik_qty: number;
  total_retur_qty: number;
  total_net_qty: number;
  return_rate: number;
};
