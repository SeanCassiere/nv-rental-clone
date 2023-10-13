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

import { cn } from "@/utils";

interface ReportTableProps {
  columnDefs: ColumnDef<TReportResult>[];
  rows: TReportResult[];
}

export const ReportTable = (props: ReportTableProps) => {
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
    // debug
    debugTable: true,
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
    <div ref={parentRef} className="h-[600px] overflow-auto rounded border">
      <table
        className="relative w-full caption-bottom border-separate bg-card text-sm [scrollbar-gutter:stable]"
        style={{
          width: table.getCenterTotalSize(),
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        <TableHeader ref={tableHeadRef}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, header_idx) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    className={cn(
                      "sticky top-0 z-10 border-b bg-card",
                      header_idx !== 0 ? "px-0" : ""
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={cn(
                            "group relative flex items-center justify-start whitespace-nowrap",
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
                          <button
                            className="absolute right-0 h-full w-1 bg-transparent px-1 focus:bg-muted-foreground group-hover:bg-muted-foreground/20"
                            onClick={(evt) => evt.stopPropagation()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                          />
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
                        "whitespace-nowrap",
                        cell_idx !== 0 ? "px-0" : ""
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
  );
};
