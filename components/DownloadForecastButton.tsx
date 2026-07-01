"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { D9012Transaction, ForecastResult, ForecastSummary } from "@/lib/types";
import { exportForecastToExcel } from "@/lib/excel";

type DownloadForecastButtonProps = {
  rawData: D9012Transaction[];
  forecastData: ForecastResult[];
  summary: ForecastSummary | null;
};

export default function DownloadForecastButton({
  rawData,
  forecastData,
  summary,
}: DownloadForecastButtonProps) {
  const disabled = forecastData.length === 0 || !summary;

  const handleDownload = () => {
    if (!summary || forecastData.length === 0) return;
    exportForecastToExcel(rawData, forecastData, summary);
  };

  return (
    <div className="flex justify-end">
      <Button disabled={disabled} onClick={handleDownload} className="gap-2">
        <Download className="h-4 w-4" />
        Download Hasil Forecast (.xlsx)
      </Button>
    </div>
  );
}
