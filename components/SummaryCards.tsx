"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Store,
  Package,
  TrendingDown,
  RotateCcw,
  Percent,
  BarChart3,
} from "lucide-react";
import { ForecastSummary } from "@/lib/types";

type SummaryCardsProps = {
  summary: ForecastSummary | null;
};

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const summaryItems = [
    {
      label: "Total Outlet",
      value: summary ? summary.total_outlet.toLocaleString() : "-",
      icon: Store,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Produk",
      value: summary ? summary.total_product.toLocaleString() : "-",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Total Dropping Qty",
      value: summary ? summary.total_dropping_qty.toLocaleString() : "-",
      icon: TrendingDown,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Total Retur",
      value: summary ? summary.total_retur_qty.toLocaleString() : "-",
      icon: RotateCcw,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Total Net Qty",
      value: summary ? summary.total_net_qty.toLocaleString() : "-",
      icon: BarChart3,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      label: "Return Rate",
      value: summary ? `${(summary.return_rate * 100).toFixed(2)}%` : "-",
      icon: Percent,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {summaryItems.map((item) => (
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
