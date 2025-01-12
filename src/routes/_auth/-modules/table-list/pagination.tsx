import React from "react";
import type { PaginationState } from "@tanstack/react-table";

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

  const pagination = table.getState().pagination;
  const totalPages = table.getPageCount();

  const pages = React.useMemo(
    () =>
      getPaginationWithDoubleEllipsis(
        pagination.pageIndex + 1,
        totalPages,
        count
      ),
    [pagination.pageIndex, totalPages, count]
  );

  const items: React.JSX.ElementType[] = React.useMemo(
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

  const pagination = table.getState().pagination;
  const canPrevious = table.getCanPreviousPage();

  const previousPagePagination: PaginationState = canPrevious
    ? { pageIndex: pagination.pageIndex - 1, pageSize: pagination.pageSize }
    : { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize };

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

  const pagination = table.getState().pagination;
  const canNext = table.getCanNextPage();

  const nextPagePagination: PaginationState = canNext
    ? { pageIndex: pagination.pageIndex + 1, pageSize: pagination.pageSize }
    : { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize };

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
