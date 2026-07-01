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
            Bread Forecasting Excel App
          </h1>
          <p className="text-muted-foreground text-sm">
            Forecasting estimasi alokasi roti ke toko berdasarkan Excel
            reporting D9012.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">No Database</Badge>
        <Badge variant="secondary">Excel Forecasting</Badge>
        <Badge variant="secondary">Next.js</Badge>
      </div>
    </div>
  );
}
