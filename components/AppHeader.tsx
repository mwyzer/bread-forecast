"use client";

import { Badge } from "@/components/ui/badge";
import { Croissant } from "lucide-react";

export default function AppHeader() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Croissant className="h-8 w-8 text-amber-600" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Estimasi Order Mingguan
          </h1>
          <p className="text-muted-foreground text-sm">
            Upload, edit, kalkulasi, rekap, dan export estimasi order mingguan
            per toko &amp; produk.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">67 SKU</Badge>
        <Badge variant="secondary">CBP / RBP / RBP Net</Badge>
        <Badge variant="secondary">Next.js</Badge>
      </div>
    </div>
  );
}
