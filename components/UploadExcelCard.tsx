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
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { D9012Transaction } from "@/lib/types";
import { parseExcelFile } from "@/lib/excel";
import { validateD9012Rows } from "@/lib/validation";

type UploadExcelCardProps = {
  onDataLoaded: (data: D9012Transaction[]) => void;
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
      // Validate extension
      if (!file.name.toLowerCase().endsWith(".xlsx")) {
        setErrors(["File harus berformat .xlsx"]);
        setIsLoading(false);
        return;
      }

      // Parse Excel
      const rows = await parseExcelFile(file);

      if (rows.length === 0) {
        setErrors(["Sheet pertama tidak memiliki data."]);
        setIsLoading(false);
        return;
      }

      // Validate rows against D9012 schema
      const validation = validateD9012Rows(rows);

      if (!validation.isValid || validation.errors.length > 0) {
        setErrors(validation.errors);
        setIsLoading(false);
        return;
      }

      // Success
      onDataLoaded(validation.data);
      setSuccessMessage(
        `File berhasil dibaca. Total baris: ${validation.data.length}`,
      );
    } catch (err) {
      setErrors([
        err instanceof Error ? err.message : "Gagal membaca file Excel.",
      ]);
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
          Upload Excel Reporting D9012
        </CardTitle>
        <CardDescription>
          Upload file .xlsx dari report Sales Invoice by Dropping Date.
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

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleUploadClick}
            disabled={isLoading}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {isLoading ? "Memproses..." : "Upload Excel"}
          </Button>
          <Button variant="outline" disabled className="gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc pl-4 space-y-1">
                {errors.slice(0, 10).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
                {errors.length > 10 && (
                  <li className="text-muted-foreground">
                    ... dan {errors.length - 10} error lainnya.
                  </li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert>
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
