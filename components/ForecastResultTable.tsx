"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Table2 } from "lucide-react";
import { ForecastResult } from "@/lib/types";

type ForecastResultTableProps = {
  data: ForecastResult[];
};

function getRiskBadge(risk: string) {
  switch (risk) {
    case "Rendah":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-300">
          Rendah
        </Badge>
      );
    case "Sedang":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-300">
          Sedang
        </Badge>
      );
    case "Tinggi":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-300">
          Tinggi
        </Badge>
      );
    default:
      return <Badge variant="secondary">{risk}</Badge>;
  }
}

export default function ForecastResultTable({
  data,
}: ForecastResultTableProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2 className="h-5 w-5" />
            Hasil Forecasting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm py-8 text-center">
            Hasil forecasting akan tampil setelah user klik Generate Forecast.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Table2 className="h-5 w-5" />
          Hasil Forecasting
          <span className="text-sm font-normal text-muted-foreground">
            ({data.length} item)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Outlet Code</TableHead>
                <TableHead className="whitespace-nowrap">Outlet Name</TableHead>
                <TableHead className="whitespace-nowrap">
                  Product Code
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  Product Name
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  Total Dropping
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  Total Retur
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  Total Net
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  Avg Net
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  Return Rate
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  Forecast Demand
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  Safety Stock
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  Recommended Qty
                </TableHead>
                <TableHead className="whitespace-nowrap">Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={`${row.outlet_code}-${row.product_code}-${idx}`}>
                  <TableCell className="font-mono text-xs">
                    {row.outlet_code}
                  </TableCell>
                  <TableCell>{row.outlet_name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.product_code}
                  </TableCell>
                  <TableCell>{row.product_name}</TableCell>
                  <TableCell className="text-right">
                    {row.total_dropping_qty.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.total_retur_qty.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.total_net_qty.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.avg_net_qty.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {(row.return_rate * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {row.forecast_demand.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.safety_stock.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {row.recommended_qty.toLocaleString()}
                  </TableCell>
                  <TableCell>{getRiskBadge(row.risk_level)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
