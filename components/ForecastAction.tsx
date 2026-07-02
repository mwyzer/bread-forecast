"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

type CalculateActionProps = {
  disabled: boolean;
  onCalculate: () => void;
};

export default function CalculateAction({
  disabled,
  onCalculate,
}: CalculateActionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Hitung Estimasi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {disabled
            ? "Upload file Excel estimasi order terlebih dahulu."
            : "Klik tombol di bawah untuk menghitung CBP, RBP, RBP Net, QTY, dan # Items."}
        </p>
        <Button disabled={disabled} onClick={onCalculate} className="gap-2">
          <Calculator className="h-4 w-4" />
          Hitung Semua
        </Button>
      </CardContent>
    </Card>
  );
}
