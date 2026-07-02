"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, Store, ArrowUpDown } from "lucide-react";

type EstimasiFilterProps = {
  searchStore: string;
  storeType: string;
  salesmanCode: string;
  sortBy: string;
  storeTypes: string[];
  salesmanCodes: { code: string; name: string }[];
  onSearchStoreChange: (value: string) => void;
  onStoreTypeChange: (value: string) => void;
  onSalesmanCodeChange: (value: string) => void;
  onSortByChange: (value: string) => void;
};

export default function EstimasiFilter({
  searchStore,
  storeType,
  salesmanCode,
  sortBy,
  storeTypes,
  salesmanCodes,
  onSearchStoreChange,
  onStoreTypeChange,
  onSalesmanCodeChange,
  onSortByChange,
}: EstimasiFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter & Sort
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Store */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" />
              Cari Toko
            </label>
            <Input
              placeholder="Nama toko..."
              value={searchStore}
              onChange={(e) => onSearchStoreChange(e.target.value)}
              className="h-9"
            />
          </div>

          {/* Store Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5" />
              Store Type
            </label>
            <Select value={storeType} onValueChange={onStoreTypeChange}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua</SelectItem>
                {storeTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Salesman */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5" />
              Salesman
            </label>
            <Select value={salesmanCode} onValueChange={onSalesmanCodeChange}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua</SelectItem>
                {salesmanCodes.map((s) => (
                  <SelectItem key={s.code} value={s.code}>
                    {s.name} ({s.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Urutkan
            </label>
            <Select value={sortBy} onValueChange={onSortByChange}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qty_desc">QTY Terbesar</SelectItem>
                <SelectItem value="qty_asc">QTY Terkecil</SelectItem>
                <SelectItem value="cbp_desc">CBP Terbesar</SelectItem>
                <SelectItem value="items_desc"># Items Terbanyak</SelectItem>
                <SelectItem value="store_asc">Nama Toko A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
