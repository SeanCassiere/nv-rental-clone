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
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useReportContext } from "@/routes/_auth/(reports)/-components/view-report/view-report-context";

import { fuzzyFilter } from "@/lib/utils/table";

import type { ReportTablePlugin } from "@/lib/types/report";

import { cn } from "@/lib/utils";

/**
 * Removes any spaces and special characters from the id
 * @param id
 */
const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, "_");

const PENDING_UI_ROW_COUNT = 14;
const PENDING_ROWS = Array.from({ length: PENDING_UI_ROW_COUNT });

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
  const { topRowPlugins = [], topRowPluginsAlignment = "end" } = props;
  const { isPending } = useReportContext();

  const [globalFilter, onGlobalFilterChange] = React.useState("");
  const [sorting, onSortingChange] = React.useState<SortingState>([]);
  const [columnVisibility, onColumnVisibilityChange] =
    React.useState<VisibilityState>(props?.columnVisibility ?? {});

  const table = useReactTable({
    data: isPending ? (PENDING_ROWS as TData[]) : props.rows,
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
      colSizes[`--header-${parseCSSVarId(header.id)}-size`] = header.getSize();
      colSizes[`--col-${parseCSSVarId(header.column.id)}-size`] =
        header.column.getSize();
    }
    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnSizingInfo, table.getFlatHeaders()]);

  const visibleColumns = table.getVisibleLeafColumns();

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index]!.getSize(), //estimate width of each column for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 3, //how many columns to render on each side off screen each way (adjust this for performance)
  });

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

  React.useEffect(() => {
    onSortingChange([]);
  }, [props.rows]);

  React.useEffect(() => {
    onGlobalFilterChange("");
  }, [props.rows]);

  return (
    <div className="grid grid-cols-1">
      {topRowPlugins.length > 0 && (
        <div
          className={cn(
            "mb-2 flex flex-col flex-wrap items-center gap-2 sm:flex-row",
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
      {isPending ? (
        <Skeleton
          className={cn("w-full rounded-b-none bg-foreground/10")}
          aria-label="Report loading"
          style={{ height: "3px" }}
        />
      ) : (
        <div
          className="w-full bg-transparent"
          aria-label="Report loaded"
          style={{ height: "3px" }}
        />
      )}
      <div
        ref={tableContainerRef}
        className="relative h-[600px] overflow-auto rounded-md border bg-card"
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
                    className="flex h-auto py-2"
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
                        "relative flex h-auto justify-between whitespace-nowrap border-x-2 py-2",
                        header.column.getIsResizing()
                          ? "border-border"
                          : "border-transparent"
                      )}
                      style={{
                        width: `calc(var(--header-${parseCSSVarId(header?.id)}-size) * 1px)`,
                      }}
                    >
                      <div className="inline-flex w-full grow flex-col whitespace-nowrap">
                        <div className="inline w-full select-none truncate">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                        <div>
                          {header.column.getCanSort() ? (
                            <Tooltip delayDuration={250}>
                              <TooltipTrigger asChild>
                                <button
                                  className={cn(
                                    "inline",
                                    header.column.getCanSort()
                                      ? "cursor-pointer select-none"
                                      : ""
                                  )}
                                  onClick={header.column.getToggleSortingHandler()}
                                  aria-label="Toggle sorting"
                                >
                                  {{
                                    asc: (
                                      <icons.SortAsc className="h-3.5 w-3.5 text-foreground" />
                                    ),
                                    desc: (
                                      <icons.SortDesc className="h-3.5 w-3.5 text-foreground" />
                                    ),
                                  }[header.column.getIsSorted() as string] ?? (
                                    <icons.SortUnsorted className="h-3.5 w-3.5 text-foreground/30" />
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {header.column.getIsSorted()
                                    ? "Sorted"
                                    : "Sort"}
                                  &nbsp;
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  &nbsp;in&nbsp;
                                  {header.column.getIsSorted() === "desc"
                                    ? "descending"
                                    : "ascending"}
                                  &nbsp;order.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          ) : null}
                        </div>
                      </div>
                      {header.column.getCanResize() ? (
                        <div
                          onDoubleClick={() => header.column.resetSize()}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={cn(
                            "-mr-2.5 mt-2.5 inline-block h-3/5 w-1 shrink-0 cursor-col-resize rounded",
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
                    className="flex h-auto py-2"
                    style={{ width: virtualPaddingRight }}
                  />
                ) : null}
              </TableRow>
            ))}
          </TableHeader>
          {table.getState().columnSizingInfo.isResizingColumn ? (
            <MemoedReportTableBody
              table={table}
              tableContainerRef={tableContainerRef}
              columnVirtualizer={columnVirtualizer}
              virtualPaddingLeft={virtualPaddingLeft}
              virtualPaddingRight={virtualPaddingRight}
            />
          ) : (
            <ReportTableBody
              table={table}
              tableContainerRef={tableContainerRef}
              columnVirtualizer={columnVirtualizer}
              virtualPaddingLeft={virtualPaddingLeft}
              virtualPaddingRight={virtualPaddingRight}
            />
          )}
        </table>
      </div>
      {isPending ? (
        <Skeleton
          className={cn("w-full rounded-t-none bg-foreground/10")}
          aria-label="Report loading"
          style={{ height: "3px" }}
        />
      ) : (
        <div
          className="w-full bg-transparent"
          aria-label="Report loaded"
          style={{ height: "3px" }}
        />
      )}
    </div>
  );
}

const ReportTable = React.memo(ReportTableContent) as typeof ReportTableContent;

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
  const { isPending } = useReportContext();
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
            className={cn(
              "absolute flex w-full",
              isPending ? "hover:bg-transparent" : ""
            )}
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
                    "flex w-full whitespace-nowrap border-x-2",
                    cell.column.getIsResizing()
                      ? "border-border"
                      : "border-transparent"
                  )}
                  style={{
                    width: `calc(var(--col-${parseCSSVarId(cell.column.id)}-size) * 1px)`,
                  }}
                >
                  {isPending ? (
                    <Skeleton
                      className="h-6"
                      style={{
                        width: `calc((var(--col-${parseCSSVarId(cell.column.id)}-size) * 1px) / ${virtualRow.index % 2 === 0 ? 2 : 2.7})`,
                      }}
                    />
                  ) : (
                    <span className="w-full truncate tabular-nums">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </span>
                  )}
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
  (prev, next) => prev.table.options.data === next.table.options.data
) as typeof ReportTableBody;

export { ReportTable };
