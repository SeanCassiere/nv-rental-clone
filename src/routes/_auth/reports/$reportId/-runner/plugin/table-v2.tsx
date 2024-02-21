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

function ReportTableContent<TData, TValue>(
  props: ReportTableProps<TData, TValue>
) {
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

  const visibleColumns = table.getVisibleLeafColumns();

  //The virtualizers need to know the scrollable container element
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  //we are using a slightly different virtualization strategy for columns (compared to virtual rows) in order to support dynamic row heights
  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index]!.getSize(), //estimate width of each column for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 3, //how many columns to render on each side off screen each way (adjust this for performance)
  });

  //dynamic row height virtualization - alternatively you could use a simpler fixed row height strategy without the need for `measureElement`
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();
  const virtualRows = rowVirtualizer.getVirtualItems();

  //different virtualization strategy for columns - instead of absolute and translateY, we add empty columns to the left and right
  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;

  if (columnVirtualizer && virtualColumns?.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
    virtualPaddingRight =
      columnVirtualizer.getTotalSize() -
      (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }

  return (
    <div>
      <div>
        <p>Plugins go here</p>
      </div>
      <div
        ref={tableContainerRef}
        className="relative h-[700px] overflow-auto rounded border bg-card"
      >
        {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        <table className="grid w-auto caption-bottom">
          <TableHeader
            className="sticky top-0 grid bg-card"
            style={{ zIndex: 1 }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="flex w-full">
                {virtualPaddingLeft ? (
                  //fake empty column to the left for virtualization scroll padding
                  <TableHead
                    className="flex h-auto"
                    style={{ width: virtualPaddingLeft }}
                  />
                ) : null}
                {virtualColumns.map((vc) => {
                  const header = headerGroup.headers[vc.index] as Header<
                    TData,
                    TValue
                  >;
                  return (
                    <TableHead
                      key={header.id}
                      className="flex h-auto gap-2 whitespace-nowrap"
                      style={{ width: header.getSize() }}
                    >
                      <div className="inline select-none">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                      <div
                        className={cn(
                          "inline",
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                          false: " ↕️",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </TableHead>
                  );
                })}
                {virtualPaddingRight ? (
                  //fake empty column to the right for virtualization scroll padding
                  <TableHead
                    className="flex h-auto"
                    style={{ width: virtualPaddingRight }}
                  />
                ) : null}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            className="relative grid"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
            }}
          >
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<TData>;
              const visibleCells = row.getVisibleCells();

              return (
                <TableRow
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  key={row.id}
                  className="absolute flex w-full"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                  }}
                >
                  {virtualPaddingLeft ? (
                    //fake empty column to the left for virtualization scroll padding
                    <TableCell
                      className="flex"
                      style={{ width: virtualPaddingLeft }}
                    />
                  ) : null}
                  {virtualColumns.map((vc) => {
                    const cell = visibleCells[vc.index] as Cell<TData, TValue>;
                    return (
                      <TableCell
                        key={cell.id}
                        className="flex whitespace-nowrap"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                  {virtualPaddingRight ? (
                    //fake empty column to the right for virtualization scroll padding
                    <TableCell
                      className="flex"
                      style={{ width: virtualPaddingRight }}
                    />
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </table>
      </div>
    </div>
  );
}

const ReportTableV2 = React.memo(ReportTableContent);

export { ReportTableV2 };
