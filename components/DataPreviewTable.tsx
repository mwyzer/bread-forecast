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
import { EstimasiOrderRow } from "@/lib/types";
import { FileText } from "lucide-react";

type DataPreviewTableProps = {
  stores: EstimasiOrderRow[];
};

export default function DataPreviewTable({ stores }: DataPreviewTableProps) {
  if (stores.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Preview Data Toko
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

  const previewStores = stores.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Preview Data Toko
          <span className="text-sm font-normal text-muted-foreground">
            (10 dari {stores.length} toko)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">No</TableHead>
                <TableHead className="whitespace-nowrap">Store</TableHead>
                <TableHead className="whitespace-nowrap">Store Type</TableHead>
                <TableHead className="whitespace-nowrap">Salesman</TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  QTY
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  CBP
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  RBP
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  RBP Net
                </TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  # Items
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewStores.map((store, idx) => (
                <TableRow key={idx}>
                  <TableCell>{store.no}</TableCell>
                  <TableCell className="font-medium max-w-[180px] truncate">
                    {store.store}
                  </TableCell>
                  <TableCell>{store.storeType}</TableCell>
                  <TableCell>{store.salesmanName}</TableCell>
                  <TableCell className="text-right">{store.totalQty}</TableCell>
                  <TableCell className="text-right">
                    {store.cbp.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {store.rbp.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {store.rbpNet.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {store.itemCount}
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
