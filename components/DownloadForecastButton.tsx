"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { EstimasiWorkbook } from "@/lib/types";
import { exportEstimasiToExcel } from "@/lib/excel";

type DownloadEstimasiButtonProps = {
  workbook: EstimasiWorkbook | null;
};

export default function DownloadEstimasiButton({
  workbook,
}: DownloadEstimasiButtonProps) {
  const disabled = !workbook || workbook.stores.length === 0;

  const handleDownload = () => {
    if (!workbook) return;
    exportEstimasiToExcel(workbook);
  };

  return (
    <div className="flex justify-end">
      <Button disabled={disabled} onClick={handleDownload} className="gap-2">
        <Download className="h-4 w-4" />
        Download Estimasi Order (.xlsx)
      </Button>
    </div>
  );
}
