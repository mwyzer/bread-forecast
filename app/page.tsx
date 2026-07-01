"use client";

import { useState, useMemo } from "react";
import { D9012Transaction, ForecastResult, ForecastSummary } from "@/lib/types";
import { generateSummary } from "@/lib/summary";
import { generateForecast } from "@/lib/forecast";
import AppHeader from "@/components/AppHeader";
import UploadExcelCard from "@/components/UploadExcelCard";
import SummaryCards from "@/components/SummaryCards";
import DataPreviewTable from "@/components/DataPreviewTable";
import ForecastAction from "@/components/ForecastAction";
import ForecastFilter from "@/components/ForecastFilter";
import ForecastResultTable from "@/components/ForecastResultTable";
import DownloadForecastButton from "@/components/DownloadForecastButton";

export default function Home() {
  const [transactions, setTransactions] = useState<D9012Transaction[]>([]);
  const [summary, setSummary] = useState<ForecastSummary | null>(null);
  const [forecastResults, setForecastResults] = useState<ForecastResult[]>([]);

  // Filter & sort states
  const [searchOutlet, setSearchOutlet] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [riskLevel, setRiskLevel] = useState("Semua");
  const [sortBy, setSortBy] = useState("return_rate_desc");

  function handleDataLoaded(data: D9012Transaction[]) {
    setTransactions(data);
    setSummary(generateSummary(data));
    setForecastResults([]);
  }

  function handleGenerateForecast() {
    const results = generateForecast(transactions);
    setForecastResults(results);
  }

  const filteredForecastResults = useMemo(() => {
    return forecastResults
      .filter((item) => {
        const outletMatch =
          item.outlet_name.toLowerCase().includes(searchOutlet.toLowerCase()) ||
          item.outlet_code.toLowerCase().includes(searchOutlet.toLowerCase());

        const productMatch =
          item.product_name
            .toLowerCase()
            .includes(searchProduct.toLowerCase()) ||
          item.product_code.toLowerCase().includes(searchProduct.toLowerCase());

        const riskMatch =
          riskLevel === "Semua" || item.risk_level === riskLevel;

        return outletMatch && productMatch && riskMatch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "recommended_qty_desc":
            return b.recommended_qty - a.recommended_qty;
          case "total_retur_desc":
            return b.total_retur_qty - a.total_retur_qty;
          case "total_dropping_desc":
            return b.total_dropping_qty - a.total_dropping_qty;
          case "outlet_name_asc":
            return a.outlet_name.localeCompare(b.outlet_name);
          case "product_name_asc":
            return a.product_name.localeCompare(b.product_name);
          case "return_rate_desc":
          default:
            return b.return_rate - a.return_rate;
        }
      });
  }, [forecastResults, searchOutlet, searchProduct, riskLevel, sortBy]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <AppHeader />

        <UploadExcelCard onDataLoaded={handleDataLoaded} />

        <SummaryCards summary={summary} />

        <DataPreviewTable data={transactions} />

        <ForecastAction
          disabled={transactions.length === 0}
          onGenerate={handleGenerateForecast}
        />

        {forecastResults.length > 0 && (
          <ForecastFilter
            searchOutlet={searchOutlet}
            searchProduct={searchProduct}
            riskLevel={riskLevel}
            sortBy={sortBy}
            onSearchOutletChange={setSearchOutlet}
            onSearchProductChange={setSearchProduct}
            onRiskLevelChange={setRiskLevel}
            onSortByChange={setSortBy}
          />
        )}

        <ForecastResultTable data={filteredForecastResults} />

        <DownloadForecastButton
          rawData={transactions}
          forecastData={forecastResults}
          summary={summary}
        />
      </div>
    </main>
  );
}
