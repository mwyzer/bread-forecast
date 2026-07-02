"use client";

import { useMemo } from "react";
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
import { EstimasiOrderRow, ProductInfo } from "@/lib/types";

type EstimasiOrderTableProps = {
  stores: EstimasiOrderRow[];
  products: ProductInfo[];
};

/** Pick up to 8 products that have non-zero qty in the filtered stores */
function pickTopProducts(
  stores: EstimasiOrderRow[],
  products: ProductInfo[],
): ProductInfo[] {
  const totals = new Map<string, number>();
  for (const store of stores) {
    for (const [name, qty] of Object.entries(store.qtyPerProduct)) {
      totals.set(name, (totals.get(name) ?? 0) + qty);
    }
  }
  return products.filter((p) => (totals.get(p.shortName) ?? 0) > 0).slice(0, 8);
}

export default function EstimasiOrderTable({
  stores,
  products,
}: EstimasiOrderTableProps) {
  const displayProducts = useMemo(
    () => pickTopProducts(stores, products),
    [stores, products],
  );

  if (stores.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2 className="h-5 w-5" />
            Data Estimasi Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm py-8 text-center">
            Data estimasi akan tampil setelah upload dan klik Hitung Estimasi.
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
          Data Estimasi Order
          <span className="text-sm font-normal text-muted-foreground">
            ({stores.length} toko)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto max-h-[70vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap sticky left-0 bg-background z-10">
                  No
                </TableHead>
                <TableHead className="whitespace-nowrap sticky left-[40px] bg-background z-10 min-w-[160px]">
                  Store
                </TableHead>
                <TableHead className="whitespace-nowrap">Type</TableHead>
                <TableHead className="whitespace-nowrap">Salesman</TableHead>
                {displayProducts.map((p) => (
                  <TableHead
                    key={p.shortName}
                    className="whitespace-nowrap text-right text-xs"
                  >
                    {p.shortName}
                  </TableHead>
                ))}
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
              {stores.map((store, idx) => (
                <TableRow key={idx}>
                  <TableCell className="sticky left-0 bg-background">
                    {store.no}
                  </TableCell>
                  <TableCell className="font-medium sticky left-[40px] bg-background max-w-[160px] truncate">
                    {store.store}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {store.storeType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {store.salesmanName}
                  </TableCell>
                  {displayProducts.map((p) => (
                    <TableCell key={p.shortName} className="text-right text-xs">
                      {store.qtyPerProduct[p.shortName] ?? 0}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-semibold">
                    {store.totalQty}
                  </TableCell>
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

              {/* Grand Total Row */}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell className="sticky left-0 bg-muted/50" colSpan={4}>
                  TOTAL ({stores.length} toko)
                </TableCell>
                {displayProducts.map((p) => {
                  const total = stores.reduce(
                    (s, r) => s + (r.qtyPerProduct[p.shortName] ?? 0),
                    0,
                  );
                  return (
                    <TableCell key={p.shortName} className="text-right text-xs">
                      {total}
                    </TableCell>
                  );
                })}
                <TableCell className="text-right">
                  {stores.reduce((s, r) => s + r.totalQty, 0)}
                </TableCell>
                <TableCell className="text-right">
                  {stores.reduce((s, r) => s + r.cbp, 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {stores.reduce((s, r) => s + r.rbp, 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {stores.reduce((s, r) => s + r.rbpNet, 0).toLocaleString()}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
