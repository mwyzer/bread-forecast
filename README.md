# Bread Forecasting Excel App

Forecasting estimasi alokasi roti ke toko berdasarkan Excel reporting D9012 (Sales Invoice by Dropping Date).

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **xlsx** — Excel parsing
- **recharts** — Charting
- **lucide-react** — Icons

## Constraints

- No database
- No authentication
- No backend API
- All processing happens in the browser

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
```

## Features

### Phase 1 — Setup & UI ✅

- Dashboard layout with all component placeholders
- TypeScript types defined

### Phase 2 — Upload & Validation ✅

- Upload Excel .xlsx files (D9012 format)
- Auto-detect required columns (DROPPING DATE, OUTLET CODE, etc.)
- Header normalization (trim + uppercase)
- Numeric column validation
- Data preview (max 20 rows)

### Phase 3 — Forecasting (Coming Soon)

- Generate demand forecasts

## Excel Format (D9012)

Required columns:

| Column         | Internal Field |
| -------------- | -------------- |
| DROPPING DATE  | dropping_date  |
| OUTLET CODE    | outlet_code    |
| OUTLET NAME    | outlet_name    |
| PRODUCT CODE   | product_code   |
| PRODUCT NAME   | product_name   |
| DROPPING QTY   | dropping_qty   |
| RETUR BS QTY   | retur_bs_qty   |
| RETUR BAIK QTY | retur_baik_qty |
| NET QTY        | net_qty        |
