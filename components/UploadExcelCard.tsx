"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { EstimasiWorkbook } from "@/lib/types";
import { parseEstimasiExcel } from "@/lib/excel";

type UploadExcelCardProps = {
  onDataLoaded: (workbook: EstimasiWorkbook) => void;
};

export default function UploadExcelCard({
  onDataLoaded,
}: UploadExcelCardProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrors([]);
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (!file.name.toLowerCase().endsWith(".xlsx")) {
        setErrors(["File harus berformat .xlsx"]);
        setIsLoading(false);
        return;
      }

      const workbook = await parseEstimasiExcel(file);

      setSuccessMessage(
        `File berhasil dibaca. ${workbook.stores.length} toko, ${workbook.products.length} produk. Sheet: ${workbook.metadata.sheetDate}`,
      );
      onDataLoaded(workbook);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Gagal membaca file Excel.";
      setErrors(msg.split("\n"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />
          Upload Excel Estimasi Order
        </CardTitle>
        <CardDescription>
          Upload file .xlsx template estimasi order mingguan (3 sheet: data
          toko, Rekap, Rekap by Type).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          onClick={handleUploadClick}
          disabled={isLoading}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {isLoading ? "Membaca file..." : "Pilih File .xlsx"}
        </Button>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc pl-4 space-y-1">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="border-green-300 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
