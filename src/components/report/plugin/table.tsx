import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ArrowDownNarrowWideIcon,
  ArrowUpDownIcon,
  ArrowUpNarrowWideIcon,
} from "lucide-react";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TReportResult } from "@/schemas/report";

import { ReportTablePlugin } from "@/types/report";

import { cn } from "@/utils";

interface ReportTableProps {
  columnDefs: ColumnDef<TReportResult>[];
  rows: TReportResult[];
  topRowPlugins?: ReportTablePlugin[];
  topRowPluginsAlignment?: "start" | "end";
}

export const ReportTable = (props: ReportTableProps) => {
  const { topRowPlugins = [], topRowPluginsAlignment = "end" } = props;
  const parentRef = React.useRef<HTMLDivElement>(null);
  const tableHeadRef = React.useRef<HTMLTableSectionElement>(null);

  const [sorting, onSortingChange] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: props.rows,
    columns: props.columnDefs,
    state: {
      sorting,
    },
    columnResizeMode: "onChange",
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
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
          "overflow-auto rounded border ",
          topRowPlugins.length > 0
            ? "h-[550px] sm:h-[520px]"
            : "h-[600px] sm:h-[550px]"
        )}
      >
        <table
          className="relative w-full caption-bottom bg-card text-sm [scrollbar-gutter:stable]"
          style={{
            width: table.getCenterTotalSize(),
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          <TableHeader ref={tableHeadRef} className="bg-card">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, header_idx) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className={cn(
                        "sticky top-0 z-10 border-b bg-muted",
                        header_idx !== 0 ? "px-2" : "pl-4"
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={cn(
                              "group relative flex h-full items-center justify-start whitespace-nowrap",
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                            )}
                            onClick={
                              !header.column.getIsResizing()
                                ? header.column.getToggleSortingHandler()
                                : () => {}
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: (
                                <ArrowUpNarrowWideIcon className="ml-2 h-3.5 w-3.5 text-foreground" />
                              ),
                              desc: (
                                <ArrowDownNarrowWideIcon className="ml-2 h-3.5 w-3.5 text-foreground" />
                              ),
                            }[header.column.getIsSorted() as string] ?? (
                              <ArrowUpDownIcon className="ml-2 h-3.5 w-3.5 text-foreground/30" />
                            )}
                            {header.column.getCanResize() && (
                              <span
                                className={cn(
                                  "absolute right-0 z-20 mr-1 inline-block h-2/4 w-[4px] cursor-col-resize touch-none select-none bg-foreground opacity-10 transition-all focus-within:h-full sm:w-[2px]",
                                  header.column.getIsResizing()
                                    ? "h-full opacity-40 sm:w-[4px]"
                                    : "hover:h-4/6 hover:opacity-40"
                                )}
                                onClick={(evt) => evt.stopPropagation()}
                                onMouseDown={header.getResizeHandler()}
                                onTouchStart={header.getResizeHandler()}
                              />
                            )}
                          </div>
                        </>
                      )}
                    </TableHead>
                  );
                })}
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
                  {row.getVisibleCells().map((cell, cell_idx) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "inline-flex whitespace-nowrap",
                          // cell_idx !== 0 ? "px-0" : "",
                          // "pr-6",
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
      </div>
    </div>
  );
};
