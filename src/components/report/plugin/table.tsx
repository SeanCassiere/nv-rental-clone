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
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <table
        className="relative border-collapse [scrollbar-gutter:stable]"
        style={{
          width: table.getCenterTotalSize(),
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        <thead ref={tableHeadRef}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    className="sticky top-0 z-10 bg-background"
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
                            className="absolute right-0 h-full w-1 bg-transparent focus:bg-muted-foreground group-hover:bg-muted-foreground/20"
                            onClick={(evt) => evt.stopPropagation()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                          />
                        </div>
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {virtualizer.getVirtualItems().map((virtualRow, index) => {
            const row = rows[virtualRow.index] as Row<TReportResult>;
            return (
              <tr
                key={row.id}
                className="absolute left-0 top-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className="whitespace-nowrap"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
