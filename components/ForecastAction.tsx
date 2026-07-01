"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

type ForecastActionProps = {
  disabled: boolean;
  onGenerate: () => void;
};

export default function ForecastAction({
  disabled,
  onGenerate,
}: ForecastActionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Generate Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {disabled
            ? "Upload file Excel D9012 terlebih dahulu untuk generate forecast."
            : "Klik tombol di bawah untuk generate forecast berdasarkan data yang sudah diupload."}
        </p>
        <Button disabled={disabled} onClick={onGenerate} className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Generate Forecast
        </Button>
      </CardContent>
    </Card>
  );
}
