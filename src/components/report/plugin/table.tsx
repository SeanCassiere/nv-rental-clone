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
  type ColumnDef,
  type Header,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ArrowDownNarrowWideIcon,
  ArrowUpDownIcon,
  ArrowUpNarrowWideIcon,
} from "lucide-react";

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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useReportContext } from "@/hooks/context/view-report";

import type { TReportResult } from "@/schemas/report";

import { fuzzyFilter } from "@/utils/table";
import type { ReportTablePlugin } from "@/types/report";

import { cn } from "@/utils";

interface ReportTableProps<TData, TValue> {
  columnDefinitions: ColumnDef<TData, TValue>[];
  columnVisibility?: VisibilityState;
  rows: TData[];
  topRowPlugins?: ReportTablePlugin[];
  topRowPluginsAlignment?: "start" | "end";
}

export function ReportTable<TData, TValue>(
  props: ReportTableProps<TData, TValue>
) {
  const { topRowPlugins = [], topRowPluginsAlignment = "end" } = props;
  const { isPending } = useReportContext();

  const parentRef = React.useRef<HTMLDivElement>(null);
  const tableHeadRef = React.useRef<HTMLTableSectionElement>(null);

  const [globalFilter, onGlobalFilterChange] = React.useState("");
  const [sorting, onSortingChange] = React.useState<SortingState>([]);
  const [columnVisibility, onColumnVisibilityChange] =
    React.useState<VisibilityState>(props?.columnVisibility ?? {});

  const table = useReactTable({
    data: props.rows,
    columns: props.columnDefinitions,
    state: {
      columnVisibility,
      globalFilter,
      sorting,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    columnResizeMode: "onChange",
    onColumnVisibilityChange,
    onGlobalFilterChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    sortDescFirst: false,
    enableColumnResizing: true,
    enableSorting: true,
  });

  const { rows } = table.getRowModel();
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 20,
    paddingStart: tableHeadRef?.current?.clientHeight ?? 0,
    scrollPaddingStart: tableHeadRef?.current?.clientHeight ?? 0,
  });

  React.useEffect(() => {
    if (props.columnVisibility) {
      onColumnVisibilityChange(props.columnVisibility);
      return;
    }

    onColumnVisibilityChange({});
  }, [props.columnVisibility]);

  React.useEffect(() => {
    onSortingChange([]);
  }, [props.rows]);

  React.useEffect(() => {
    onGlobalFilterChange("");
  }, [props.rows]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {topRowPlugins.length > 0 && (
        <div
          className={cn(
            "flex flex-col flex-wrap items-center gap-2 sm:flex-row",
            topRowPluginsAlignment === "end" ? "justify-end" : "justify-start"
          )}
        >
          {topRowPlugins.map((Plugin, idx) => (
            <React.Fragment key={`report_table_top_plugin_${idx}`}>
              <Plugin table={table} align={topRowPluginsAlignment} />
            </React.Fragment>
          ))}
        </div>
      )}
      <div
        ref={parentRef}
        className={cn(
          "relative overflow-auto rounded border",
          topRowPlugins.length > 0
            ? "h-[550px] sm:h-[520px]"
            : "h-[600px] sm:h-[550px]"
        )}
      >
        {isPending ? (
          <Skeleton
            className={cn(
              "absolute left-0 top-0 w-full rounded-b-none bg-primary/50"
            )}
            aria-label="Report loading"
            style={{ height: "3px" }}
          />
        ) : (
          <div
            className="absolute left-0 top-0 w-full bg-muted"
            aria-label="Report loaded"
            style={{ height: "3px" }}
          />
        )}
        <table
          className={cn(
            "relative w-full caption-bottom bg-card text-sm transition-opacity [scrollbar-gutter:stable]",
            isPending ? "opacity-50" : "opacity-100"
          )}
          style={{
            width: table.getCenterTotalSize(),
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          <TableHeader ref={tableHeadRef} className="bg-card">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <ReportTableColumnHeader
                    key={header.id}
                    header={header}
                    index={index}
                  />
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<TReportResult>;
              return (
                <TableRow
                  key={row.id}
                  className="absolute left-0 top-0 w-full"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "inline-flex whitespace-nowrap",
                          cell.column.columnDef.meta?.cellContentAlign === "end"
                            ? "justify-end pr-6"
                            : "justify-start"
                        )}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </table>
        {isPending ? (
          <Skeleton
            className={cn(
              "absolute bottom-0 left-0 w-full rounded-b-none bg-primary/50"
            )}
            aria-label="Report loading"
            style={{ height: "3px" }}
          />
        ) : (
          <div
            className="absolute bottom-0 left-0 w-full"
            aria-label="Report loaded"
            style={{ height: "3px" }}
          />
        )}
      </div>
    </div>
  );
}

interface ReportTableColumnHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
  index: number;
}

function ReportTableColumnHeader<TData, TValue>(
  props: ReportTableColumnHeaderProps<TData, TValue>
) {
  const { header, index } = props;

  return (
    <TableHead
      colSpan={header.colSpan}
      style={{ width: header.getSize() }}
      className={cn("sticky top-0 z-10 border-b bg-muted px-0 py-0")}
    >
      <TooltipProvider>
        {header.isPlaceholder ? null : (
          <div
            className={cn(
              "relative flex h-full flex-col items-center justify-start gap-2 pr-4",
              index === 0 ? "pl-4" : "pl-2"
            )}
          >
            <div className="flex w-full justify-start whitespace-nowrap pt-2">
              {flexRender(header.column.columnDef.header, header.getContext())}
            </div>
            <div className="flex w-full justify-start gap-2 whitespace-nowrap pb-2">
              {header.column.getCanSort() && (
                <Tooltip delayDuration={250}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={header.column.getToggleSortingHandler()}
                      aria-label="Toggle sorting"
                      className="flex items-center justify-start"
                    >
                      {{
                        asc: (
                          <ArrowUpNarrowWideIcon className="h-3.5 w-3.5 text-foreground" />
                        ),
                        desc: (
                          <ArrowDownNarrowWideIcon className="h-3.5 w-3.5 text-foreground" />
                        ),
                      }[header.column.getIsSorted() as string] ?? (
                        <ArrowUpDownIcon className="h-3.5 w-3.5 text-foreground/30" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent>
                      <p>
                        {header.column.getIsSorted() === "asc"
                          ? "Sorted " +
                            (header.column.columnDef?.meta?.columnName ??
                              header.column.id) +
                            " column in ascending"
                          : header.column.getIsSorted() === "desc"
                          ? "Sorted " +
                            (header.column.columnDef?.meta?.columnName ??
                              header.column.id) +
                            " column in descending"
                          : "Sort " +
                            (header.column.columnDef?.meta?.columnName ??
                              header.column.id) +
                            " column in ascending"}
                      </p>
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              )}
            </div>
            {header.column.getCanResize() && (
              <span
                className={cn(
                  "absolute right-0 top-1/4 z-20 mr-1 inline-block h-2/4 w-[3px] cursor-col-resize touch-none select-none bg-foreground opacity-10 transition-all focus-within:h-full focus:h-full sm:w-[2px]",
                  header.column.getIsResizing()
                    ? "top-0 h-full w-[4px] opacity-40 sm:w-[3px]"
                    : "top-1/4 hover:h-2/4 hover:opacity-40"
                )}
                onMouseDown={header.getResizeHandler()}
                onTouchStart={header.getResizeHandler()}
              />
            )}
          </div>
        )}
      </TooltipProvider>
    </TableHead>
  );
}
