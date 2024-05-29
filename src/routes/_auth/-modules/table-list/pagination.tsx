import React from "react";
import { PaginationState } from "@tanstack/react-table";

import { PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";

import { getPaginationWithDoubleEllipsis } from "@/lib/utils/pagination";

import { cn } from "@/lib/utils";

import { useTableList } from "./context";

function TableListPaginationItems({
  children,
  className,
  count = 7,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof PaginationItem>, "children"> & {
  children: (state: {
    pagination: PaginationState;
    isActive: boolean;
  }) => React.ReactNode;
  count?: number;
}) {
  const { table } = useTableList();

  const pagination = React.useMemo(
    () => table.getState().pagination,
    // todo-eslint-disable-next-line react-hooks/exhaustive-deps
    [table.getState().pagination]
  );
  const totalPages = React.useMemo(
    () => table.getPageCount(),
    // todo-eslint-disable-next-line react-hooks/exhaustive-deps
    [table.getPageCount()]
  );

  const pages = React.useMemo(
    () =>
      getPaginationWithDoubleEllipsis(
        pagination.pageIndex + 1,
        totalPages,
        count
      ),
    [pagination.pageIndex, totalPages, count]
  );

  const items: JSX.ElementType[] = React.useMemo(
    () =>
      pages.map(
        (page) => () =>
          isNaN(page) ? (
            <PaginationEllipsis />
          ) : (
            children({
              pagination: {
                pageIndex: page - 1,
                pageSize: pagination.pageSize,
              },
              isActive: page === pagination.pageIndex + 1,
            })
          )
      ),
    [children, pages, pagination.pageSize, pagination.pageIndex]
  );

  return (
    <React.Fragment>
      {items.map((Comp, idx) => (
        <PaginationItem
          key={`table_list_pagination_item_${idx}`}
          className={cn("", className)}
          {...props}
        >
          <Comp />
        </PaginationItem>
      ))}
    </React.Fragment>
  );
}
TableListPaginationItems.displayName = "TableListPaginationItems";

function TableListPaginationPrevious({
  children,
}: {
  children: (state: {
    pagination: PaginationState;
    disabled: boolean;
  }) => React.ReactNode;
}) {
  const { table } = useTableList();

  const pagination = React.useMemo(
    () => table.getState().pagination,
    // todo-eslint-disable-next-line react-hooks/exhaustive-deps
    [table.getState().pagination]
  );
  const canPrevious = React.useMemo(
    () => table.getCanPreviousPage(),
    // todo-eslint-disable-next-line react-hooks/exhaustive-deps
    [table.getCanPreviousPage()]
  );

  const previousPagePagination: PaginationState = React.useMemo(() => {
    return canPrevious
      ? { pageIndex: pagination.pageIndex - 1, pageSize: pagination.pageSize }
      : { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize };
  }, [canPrevious, pagination.pageIndex, pagination.pageSize]);

  return (
    <PaginationItem {...(!canPrevious ? { "aria-disabled": true } : {})}>
      {children({
        pagination: previousPagePagination,
        disabled: !canPrevious,
      })}
    </PaginationItem>
  );
}
TableListPaginationPrevious.displayName = "TableListPaginationPrevious";

function TableListPaginationNext({
  children,
}: {
  children: (state: {
    pagination: PaginationState;
    disabled: boolean;
  }) => React.ReactNode;
}) {
  const { table } = useTableList();

  const pagination = React.useMemo(
    () => table.getState().pagination,
    // todo-eslint react-hooks/exhaustive-deps
    [table.getState().pagination]
  );
  const canNext = React.useMemo(
    () => table.getCanNextPage(),
    // todo-eslint react-hooks/exhaustive-deps
    [table.getCanNextPage()]
  );

  const nextPagePagination: PaginationState = React.useMemo(() => {
    return canNext
      ? { pageIndex: pagination.pageIndex + 1, pageSize: pagination.pageSize }
      : { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize };
  }, [canNext, pagination.pageIndex, pagination.pageSize]);

  return (
    <PaginationItem {...(!canNext ? { "aria-disabled": true } : {})}>
      {children({
        pagination: nextPagePagination,
        disabled: !canNext,
      })}
    </PaginationItem>
  );
}
TableListPaginationNext.displayName = "TableListPaginationNext";

export {
  TableListPaginationItems,
  TableListPaginationPrevious,
  TableListPaginationNext,
};
