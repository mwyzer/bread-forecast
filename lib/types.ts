// ── Product Catalog ──
export type ProductInfo = {
  shortName: string; // e.g., "RTSII"
  price: number; // e.g., 15000
};

// ── Workbook Metadata ──
export type WorkbookMetadata = {
  periode: string; // e.g., "(04/07/2026 - 04/07/2026)"
  depo: string; // e.g., "D/BGR/CITEREUP/PT. MUD/CBT"
  date: string; // e.g., "01/07/2026"
  sheetDate: string; // e.g., "2026-07-04"
};

// ── Estimasi Order Row (one store) ──
export type EstimasiOrderRow = {
  no: number;
  tanggal: string;
  salesmanCode: string;
  salesmanName: string;
  store: string;
  storeType: string;
  classification: string;
  salesType: string;
  remarks: string;
  discPercent: number; // default 10
  qtyPerProduct: Record<string, number>; // shortName → qty
  // Computed fields
  cbp: number; // SUMPRODUCT(harga × qty)
  rbp: number; // CBP - (CBP × discPercent/100)
  rbpNet: number; // ROUND(RBP / 1.11, 2)
  totalQty: number; // SUM of all product qtys
  itemCount: number; // COUNT of products where qty > 0
};

// ── Summary per salesman ──
export type SalesmanSummary = {
  salesmanCode: string;
  salesmanName: string;
  storeCount: number;
  totalQty: number;
  totalCbp: number;
  totalRbp: number;
  totalRbpNet: number;
};

// ── Rekap (per-SKU total QTY) ──
export type RekapRow = {
  no: number;
  shortName: string;
  qty: number;
  totalQty: number;
};

// ── Rekap by Type ──
export type RekapByTypeRow = {
  storeType: string;
  classification: string;
  qty: number;
  cbp: number;
  rbp: number;
  rbpExcludePpn: number;
};

// ── Grand totals ──
export type GrandTotals = {
  totalQty: number;
  totalCbp: number;
  totalRbp: number;
  totalRbpNet: number;
};

// ── Full workbook data ──
export type EstimasiWorkbook = {
  metadata: WorkbookMetadata;
  products: ProductInfo[];
  stores: EstimasiOrderRow[];
  salesmanSummaries: SalesmanSummary[];
  grandTotals: GrandTotals;
  rekap: RekapRow[];
  rekapByType: RekapByTypeRow[];
};
