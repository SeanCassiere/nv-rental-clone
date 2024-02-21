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
  type Table,
  type VisibilityState,
} from "@tanstack/react-table";
import { useVirtualizer, type Virtualizer } from "@tanstack/react-virtual";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

/**
 * Removes any spaces and special characters from the id
 * @param id
 */
function clean(id: string) {
  return id.replace(/[^a-zA-Z0-9]/g, "");
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

  /**
   * Instead of calling `column.getSize()` on every render for every header
   * and especially every data cell (very expensive),
   * we will calculate all column sizes at once at the root table level in a useMemo
   * and pass the column sizes down as CSS variables to the <table> element.
   */
  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      colSizes[`--header-${clean(header.id)}-size`] = header.getSize();
      colSizes[`--col-${clean(header.column.id)}-size`] =
        header.column.getSize();
    }
    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnSizingInfo]);

  // const { rows } = table.getRowModel();

  const visibleColumns = table.getVisibleLeafColumns();

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index]!.getSize(), //estimate width of each column for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 3, //how many columns to render on each side off screen each way (adjust this for performance)
  });

  // const rowVirtualizer = useVirtualizer({
  //   count: rows.length,
  //   estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
  //   getScrollElement: () => tableContainerRef.current,
  //   //measure dynamic row height, except in firefox because it measures table border height incorrectly
  //   measureElement:
  //     typeof window !== "undefined" &&
  //     navigator.userAgent.indexOf("Firefox") === -1
  //       ? (element) => element?.getBoundingClientRect().height
  //       : undefined,
  //   overscan: 5,
  // });

  const virtualColumns = columnVirtualizer.getVirtualItems();
  // const virtualRows = rowVirtualizer.getVirtualItems();

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
      <div className="mb-4 flex justify-end">
        <p>Plugins go here</p>
      </div>
      <div
        ref={tableContainerRef}
        className="relative h-[700px] overflow-auto rounded border bg-card"
      >
        {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        <table
          className="grid w-fit caption-bottom"
          style={{
            ...columnSizeVars,
          }}
        >
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
                      colSpan={header.colSpan}
                      className={cn(
                        "relative flex h-auto justify-between gap-2 whitespace-nowrap border-x",
                        header.column.getIsResizing()
                          ? "border-border"
                          : "border-transparent"
                      )}
                      style={{
                        width: `calc(var(--header-${clean(header?.id)}-size) * 1px)`,
                      }}
                    >
                      <div className="inline-flex w-full flex-col whitespace-nowrap">
                        <div className="inline w-full select-none truncate">
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
                      </div>
                      {header.column.getCanResize() ? (
                        <div
                          onDoubleClick={() => header.column.resetSize()}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={cn(
                            "mt-2 inline-block h-3/5 w-1 shrink-0 cursor-col-resize rounded",
                            header.column.getIsResizing()
                              ? "bg-foreground/75"
                              : "bg-foreground/15 hover:bg-foreground/45"
                          )}
                        />
                      ) : null}
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
          <MemoedReportTableBody
            table={table}
            tableContainerRef={tableContainerRef}
            columnVirtualizer={columnVirtualizer}
            virtualPaddingLeft={virtualPaddingLeft}
            virtualPaddingRight={virtualPaddingRight}
          />
          {/* <TableBody
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
                    <td
                      className="flex"
                      style={{ width: virtualPaddingLeft }}
                    />
                  ) : null}
                  {virtualColumns.map((vc) => {
                    const cell = visibleCells[vc.index] as Cell<TData, TValue>;
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "flex w-full truncate whitespace-nowrap border-x",
                          cell.column.getIsResizing()
                            ? "border-border"
                            : "border-transparent"
                        )}
                        style={{
                          width: `calc(var(--col-${clean(cell.column.id)}-size) * 1px)`,
                        }}
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
                    <td
                      className="flex"
                      style={{ width: virtualPaddingRight }}
                    />
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody> */}
        </table>
      </div>
    </div>
  );
}

function ReportTableBody<TData, TValue>({
  table,
  tableContainerRef,
  columnVirtualizer,
  virtualPaddingLeft,
  virtualPaddingRight,
}: {
  table: Table<TData>;
  tableContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  columnVirtualizer: Virtualizer<HTMLDivElement, Element>;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
}) {
  const { rows } = table.getRowModel();

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

  return (
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
              <td className="flex" style={{ width: virtualPaddingLeft }} />
            ) : null}
            {virtualColumns.map((vc) => {
              const cell = visibleCells[vc.index] as Cell<TData, TValue>;
              return (
                <TableCell
                  key={cell.id}
                  className={cn(
                    "flex w-full truncate whitespace-nowrap border-x",
                    cell.column.getIsResizing()
                      ? "border-border"
                      : "border-transparent"
                  )}
                  style={{
                    width: `calc(var(--col-${clean(cell.column.id)}-size) * 1px)`,
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              );
            })}
            {virtualPaddingRight ? (
              //fake empty column to the right for virtualization scroll padding
              <td className="flex" style={{ width: virtualPaddingRight }} />
            ) : null}
          </TableRow>
        );
      })}
    </TableBody>
  );
}

const MemoedReportTableBody = React.memo(
  ReportTableBody,
  (prev, next) =>
    prev.table.options.data === next.table.options.data &&
    prev.tableContainerRef.current === next.tableContainerRef.current &&
    prev.columnVirtualizer === next.columnVirtualizer &&
    prev.virtualPaddingLeft === next.virtualPaddingLeft &&
    prev.virtualPaddingRight === next.virtualPaddingRight
) as typeof ReportTableBody;

const ReportTableV2 = React.memo(
  ReportTableContent
) as typeof ReportTableContent;

export { ReportTableV2 };
