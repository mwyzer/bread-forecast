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
import { D9012Transaction } from "@/lib/types";
import { FileText } from "lucide-react";

type DataPreviewTableProps = {
  data: D9012Transaction[];
};

const COLUMNS = [
  { key: "dropping_date", label: "Dropping Date" },
  { key: "outlet_code", label: "Outlet Code" },
  { key: "outlet_name", label: "Outlet Name" },
  { key: "product_code", label: "Product Code" },
  { key: "product_name", label: "Product Name" },
  { key: "dropping_qty", label: "Dropping Qty" },
  { key: "retur_bs_qty", label: "Retur BS Qty" },
  { key: "retur_baik_qty", label: "Retur Baik Qty" },
  { key: "net_qty", label: "Net Qty" },
] as const;

export default function DataPreviewTable({ data }: DataPreviewTableProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Preview Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm py-8 text-center">
            Data preview akan tampil setelah file Excel berhasil diupload.
          </p>
        </CardContent>
      </Card>
    );
  }

  const previewData = data.slice(0, 20);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Preview Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Menampilkan {previewData.length} dari {data.length} baris.
        </p>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableHead key={col.key} className="whitespace-nowrap">
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.dropping_date}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.outlet_code}
                  </TableCell>
                  <TableCell>{row.outlet_name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.product_code}
                  </TableCell>
                  <TableCell>{row.product_name}</TableCell>
                  <TableCell className="text-right">
                    {row.dropping_qty.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.retur_bs_qty.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.retur_baik_qty.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.net_qty.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
