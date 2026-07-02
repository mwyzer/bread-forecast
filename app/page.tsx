"use client";

import { useState, useMemo } from "react";
import { EstimasiWorkbook } from "@/lib/types";
import {
  generateGrandTotals,
  generateSalesmanSummaries,
  generateRekap,
  generateRekapByType,
} from "@/lib/summary";
import AppHeader from "@/components/AppHeader";
import UploadExcelCard from "@/components/UploadExcelCard";
import SummaryCards from "@/components/SummaryCards";
import DataPreviewTable from "@/components/DataPreviewTable";
import CalculateAction from "@/components/ForecastAction";
import EstimasiFilter from "@/components/ForecastFilter";
import EstimasiOrderTable from "@/components/ForecastResultTable";
import DownloadEstimasiButton from "@/components/DownloadForecastButton";

export default function Home() {
  const [workbook, setWorkbook] = useState<EstimasiWorkbook | null>(null);
  const [calculated, setCalculated] = useState(false);

  // Filter & sort states
  const [searchStore, setSearchStore] = useState("");
  const [storeType, setStoreType] = useState("Semua");
  const [salesmanCode, setSalesmanCode] = useState("Semua");
  const [sortBy, setSortBy] = useState("qty_desc");

  function handleDataLoaded(wb: EstimasiWorkbook) {
    setWorkbook(wb);
    setCalculated(false);
  }

  function handleCalculate() {
    if (!workbook) return;
    // Recompute summaries (already computed on import, but this ensures freshness)
    const updatedWorkbook: EstimasiWorkbook = {
      ...workbook,
      salesmanSummaries: generateSalesmanSummaries(workbook.stores),
      grandTotals: generateGrandTotals(workbook.stores),
      rekap: generateRekap(workbook.stores),
      rekapByType: generateRekapByType(workbook.stores),
    };
    setWorkbook(updatedWorkbook);
    setCalculated(true);
  }

  // Derive unique filter values
  const storeTypes = useMemo(() => {
    if (!workbook) return [];
    return [...new Set(workbook.stores.map((s) => s.storeType))].sort();
  }, [workbook]);

  const salesmanCodes = useMemo(() => {
    if (!workbook) return [];
    const map = new Map<string, string>();
    for (const s of workbook.stores) {
      map.set(s.salesmanCode, s.salesmanName);
    }
    return Array.from(map.entries()).map(([code, name]) => ({ code, name }));
  }, [workbook]);

  // Filter + sort stores
  const filteredStores = useMemo(() => {
    if (!workbook) return [];
    return workbook.stores
      .filter((s) => {
        const storeMatch = s.store
          .toLowerCase()
          .includes(searchStore.toLowerCase());
        const typeMatch = storeType === "Semua" || s.storeType === storeType;
        const smMatch =
          salesmanCode === "Semua" || s.salesmanCode === salesmanCode;
        return storeMatch && typeMatch && smMatch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "qty_asc":
            return a.totalQty - b.totalQty;
          case "cbp_desc":
            return b.cbp - a.cbp;
          case "items_desc":
            return b.itemCount - a.itemCount;
          case "store_asc":
            return a.store.localeCompare(b.store);
          case "qty_desc":
          default:
            return b.totalQty - a.totalQty;
        }
      });
  }, [workbook, searchStore, storeType, salesmanCode, sortBy]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <AppHeader />

        <UploadExcelCard onDataLoaded={handleDataLoaded} />

        {workbook && (
          <SummaryCards
            totals={workbook.grandTotals}
            storeCount={workbook.stores.length}
            productCount={workbook.products.length}
          />
        )}

        <DataPreviewTable stores={workbook?.stores ?? []} />

        <CalculateAction
          disabled={!workbook || workbook.stores.length === 0}
          onCalculate={handleCalculate}
        />

        {calculated && workbook && (
          <EstimasiFilter
            searchStore={searchStore}
            storeType={storeType}
            salesmanCode={salesmanCode}
            sortBy={sortBy}
            storeTypes={storeTypes}
            salesmanCodes={salesmanCodes}
            onSearchStoreChange={setSearchStore}
            onStoreTypeChange={setStoreType}
            onSalesmanCodeChange={setSalesmanCode}
            onSortByChange={setSortBy}
          />
        )}

        <EstimasiOrderTable
          stores={filteredStores}
          products={workbook?.products ?? []}
        />

        <DownloadEstimasiButton workbook={workbook} />
      </div>
    </main>
  );
}
