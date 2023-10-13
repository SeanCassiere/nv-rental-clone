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
    // debug
    debugTable: true,
  });

  const { rows } = table.getRowModel();
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 10,
  });

  return (
    <div>
      <div ref={parentRef} className="relative h-[600px] overflow-auto">
        <table className="relative table table-fixed">
          <thead className="sticky left-0 top-0 z-10 table-header-group bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="table-row">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className="table-cell"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center justify-start whitespace-nowrap",
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          )}
                          onClick={header.column.getToggleSortingHandler()}
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
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="table-row-group">
            {virtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = rows[virtualRow.index] as Row<TReportResult>;
              return (
                <tr
                  key={row.id}
                  className="table-row"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${
                      virtualRow.start - index * virtualRow.size
                    }px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className="table-cell whitespace-nowrap"
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
    </div>
  );
};
