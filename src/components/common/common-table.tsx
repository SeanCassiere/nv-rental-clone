import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getPaginationWithDoubleEllipsis } from "@/utils/pagination";

import { cn } from "@/utils";

interface TCommonTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  hasPagination?: boolean;
  paginationMode?: "server" | "client";
  paginationState?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  totalPages?: number;
  stickyHeader?: boolean;
}

export const CommonTable = <T extends unknown>(props: TCommonTableProps<T>) => {
  const hasPagination = props.hasPagination ?? false;
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    { pageIndex: 0, pageSize: 10 }
  );

  const totalPages =
    props.paginationMode === "server" && props.totalPages
      ? props.totalPages
      : Math.ceil(props.data.length / internalPagination.pageSize) ?? -1;

  const paginationState =
    props?.paginationMode === "server" && props.paginationState
      ? props.paginationState
      : internalPagination;

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    manualPagination: props?.paginationMode === "server",
    pageCount: totalPages,
    state: {
      pagination: paginationState,
    },
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(paginationState) : updater;
      if (props?.paginationMode === "server") {
        props?.onPaginationChange?.(newPagination);
      } else {
        setInternalPagination(newPagination);
      }
    },
  });

  const pageNumbers = useMemo(() => {
    if (hasPagination) {
      return getPaginationWithDoubleEllipsis(
        paginationState.pageIndex + 1,
        totalPages ?? 0,
        7
      );
    }
    return [];
  }, [hasPagination, totalPages, paginationState.pageIndex]);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden overflow-y-auto rounded border",
        props.stickyHeader ? "mr-2 max-h-[650px]" : ""
      )}
    >
      {/* <div className="overflow-x-auto"> */}
      <Table className="table-auto overflow-x-auto bg-card">
        <TableHeader
          className={cn(props.stickyHeader ? "sticky top-0 z-10" : "")}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} scope="col" colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="divide-y divide-slate-200">
          {table.getRowModel()?.rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell, cellIdx) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "whitespace-nowrap",
                      cellIdx === 0 ? "sm:pl-4" : ""
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={props.columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* </div> */}
      {hasPagination && (
        <>
          <div className="flex flex-1 justify-between px-2 py-2.5 sm:hidden">
            <Button
              variant="outline"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next
            </Button>
          </div>

          {/* Desktop */}
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between sm:py-3.5">
            <div>
              <nav
                className="isolate inline-flex space-x-1 rounded-md"
                aria-label="Pagination"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="rounded-l px-2 tabular-nums"
                >
                  <span className="sr-only">Previous</span>
                  <icons.ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                {pageNumbers.map((pageNum, idx) => {
                  const current = Boolean(
                    paginationState.pageIndex + 1 === pageNum
                  );
                  return (
                    <Button
                      key={`common-table-pagination-button-${pageNum}-${idx}`}
                      variant={current ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        !isNaN(pageNum) && table.setPageIndex(pageNum - 1);
                      }}
                      disabled={isNaN(pageNum)}
                      className="tabular-nums"
                      {...(current
                        ? { "aria-current": "page", current: `${current}` }
                        : {})}
                    >
                      {!isNaN(pageNum) ? pageNum : "..."}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="rounded-r px-2 tabular-nums"
                >
                  <span className="sr-only">Next</span>
                  <icons.ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
