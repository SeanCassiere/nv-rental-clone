import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type Cell,
  type ColumnDef,
  type Header,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  useVirtualizer,
  type VirtualItem,
  type Virtualizer,
} from "@tanstack/react-virtual";

import { icons } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useReportContext } from "@/routes/_auth/reports/$reportId/-runner/view-report-context";

import { fuzzyFilter } from "@/lib/utils/table";

import type { ReportTablePlugin } from "@/lib/types/report";

import { cn } from "@/lib/utils";

interface ReportTableProps<TData, TValue> {
  columnDefinitions: ColumnDef<TData, TValue>[];
  columnVisibility?: VisibilityState;
  rows: TData[];
  topRowPlugins?: ReportTablePlugin[];
  topRowPluginsAlignment?: "start" | "end";
}

export function ReportTableV2<TData, TValue>(
  props: ReportTableProps<TData, TValue>
) {
  return <div>ReportTablePerformant</div>;
}
