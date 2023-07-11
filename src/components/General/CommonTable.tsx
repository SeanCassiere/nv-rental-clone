import {
  type ButtonHTMLAttributes,
  type DetailedHTMLProps,
  useState,
  useMemo,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";

import { getPaginationWithDoubleEllipsis } from "../../utils/pagination";
import { ChevronLeftOutline, ChevronRightOutline } from "../icons";
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

const CommonTable = <T extends unknown>(props: TCommonTableProps<T>) => {
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
    onPaginationChange: (paginationUpdaterFn) => {
      // @ts-expect-error
      const newPagination = paginationUpdaterFn(paginationState);
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
        "relative w-full overflow-hidden overflow-y-auto rounded border border-slate-200",
        props.stickyHeader ? "mr-2 max-h-[650px]" : ""
      )}
    >
      {/* <div className="overflow-x-auto"> */}
      <table className="min-w-full table-auto divide-y divide-slate-200 overflow-x-auto bg-slate-50">
        <thead
          className={cn(
            "bg-slate-100",
            props.stickyHeader
              ? "sticky top-0 z-10 border-b border-slate-200"
              : ""
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  colSpan={header.colSpan}
                  className={cn(
                    header.index === 0 ? "sm:pl-6" : "",
                    "px-4 py-5 text-left text-base font-semibold text-gray-700"
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-200">
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell, cellIdx) => (
                  <td
                    key={cell.id}
                    className={cn(
                      cellIdx === 0 ? "sm:pl-6" : "",
                      "whitespace-nowrap px-4 py-3 text-base font-normal text-slate-700"
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={table.getAllColumns().length}>
                <span className="block min-h-[50px]">&nbsp;</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* </div> */}
      {hasPagination && (
        <>
          <div className="flex flex-1 justify-between bg-slate-50 px-2 py-2.5 sm:hidden">
            <button
              className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-50 disabled:text-slate-300"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Previous
            </button>
            <button
              className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-50 disabled:text-slate-300"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next
            </button>
          </div>

          {/* Desktop */}
          <div className="hidden border-t border-slate-200 bg-slate-50 sm:flex sm:flex-1 sm:items-center sm:justify-between sm:px-4 sm:py-3.5">
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <DesktopPaginationBtn
                  className="rounded-l px-2"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftOutline className="h-5 w-5" aria-hidden="true" />
                </DesktopPaginationBtn>
                {pageNumbers.map((pageNum, idx) => (
                  <DesktopPaginationBtn
                    key={`common-table-pagination-button-${pageNum}-${idx}`}
                    disabled={isNaN(pageNum)}
                    onClick={() => {
                      !isNaN(pageNum) && table.setPageIndex(pageNum - 1);
                    }}
                    current={Boolean(paginationState.pageIndex + 1 === pageNum)}
                  >
                    {!isNaN(pageNum) ? pageNum : "..."}
                  </DesktopPaginationBtn>
                ))}
                <DesktopPaginationBtn
                  className="rounded-r px-2"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightOutline className="h-5 w-5" aria-hidden="true" />
                </DesktopPaginationBtn>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CommonTable;

const DesktopPaginationBtn = (
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { current?: boolean }
) => {
  const { children, current, className, ...otherProps } = props;
  return (
    <button
      {...otherProps}
      className={cn(
        "relative inline-flex items-center border px-4 py-2 text-sm font-medium hover:bg-slate-50 focus:z-20",
        current
          ? "z-10 border-teal-500 bg-teal-50 text-teal-600"
          : "border-slate-300 bg-white text-slate-500",
        "disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-50 disabled:text-slate-300",
        className
      )}
      {...(current ? { "aria-current": "page", current: `${current}` } : {})}
    >
      {children}
    </button>
  );
};
