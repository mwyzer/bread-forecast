"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Store,
  Package,
  DollarSign,
  Receipt,
  Calculator,
  Layers,
} from "lucide-react";
import { GrandTotals } from "@/lib/types";

type SummaryCardsProps = {
  totals: GrandTotals | null;
  storeCount: number;
  productCount: number;
};

export default function SummaryCards({
  totals,
  storeCount,
  productCount,
}: SummaryCardsProps) {
  const items = [
    {
      label: "Total Toko",
      value: storeCount.toLocaleString(),
      icon: Store,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total SKU",
      value: productCount.toLocaleString(),
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Total QTY",
      value: totals ? totals.totalQty.toLocaleString() : "-",
      icon: Layers,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Total CBP",
      value: totals ? `Rp ${totals.totalCbp.toLocaleString()}` : "-",
      icon: Calculator,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Total RBP",
      value: totals ? `Rp ${totals.totalRbp.toLocaleString()}` : "-",
      icon: Receipt,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      label: "Total RBP Net",
      value: totals ? `Rp ${totals.totalRbpNet.toLocaleString()}` : "-",
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-md ${item.bgColor}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-lg font-bold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
