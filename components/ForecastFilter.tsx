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
import { Filter, Search, ShieldAlert, ArrowUpDown } from "lucide-react";

type ForecastFilterProps = {
  searchOutlet: string;
  searchProduct: string;
  riskLevel: string;
  sortBy: string;
  onSearchOutletChange: (value: string) => void;
  onSearchProductChange: (value: string) => void;
  onRiskLevelChange: (value: string) => void;
  onSortByChange: (value: string) => void;
};

export default function ForecastFilter({
  searchOutlet,
  searchProduct,
  riskLevel,
  sortBy,
  onSearchOutletChange,
  onSearchProductChange,
  onRiskLevelChange,
  onSortByChange,
}: ForecastFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter & Sort Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Outlet */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" />
              Search Outlet
            </label>
            <Input
              placeholder="Outlet code / name..."
              value={searchOutlet}
              onChange={(e) => onSearchOutletChange(e.target.value)}
              className="h-9"
            />
          </div>

          {/* Search Product */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" />
              Search Product
            </label>
            <Input
              placeholder="Product code / name..."
              value={searchProduct}
              onChange={(e) => onSearchProductChange(e.target.value)}
              className="h-9"
            />
          </div>

          {/* Risk Level */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              Risk Level
            </label>
            <Select value={riskLevel} onValueChange={onRiskLevelChange}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua</SelectItem>
                <SelectItem value="Rendah">Rendah</SelectItem>
                <SelectItem value="Sedang">Sedang</SelectItem>
                <SelectItem value="Tinggi">Tinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Sort By
            </label>
            <Select value={sortBy} onValueChange={onSortByChange}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="return_rate_desc">
                  Return Rate (Highest)
                </SelectItem>
                <SelectItem value="recommended_qty_desc">
                  Recommended Qty (Highest)
                </SelectItem>
                <SelectItem value="total_retur_desc">
                  Total Retur (Highest)
                </SelectItem>
                <SelectItem value="total_dropping_desc">
                  Total Dropping (Highest)
                </SelectItem>
                <SelectItem value="outlet_name_asc">
                  Outlet Name (A-Z)
                </SelectItem>
                <SelectItem value="product_name_asc">
                  Product Name (A-Z)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
