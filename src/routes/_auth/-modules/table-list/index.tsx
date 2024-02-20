import React from "react";
import {
  getCoreRowModel,
  PaginationState,
  useReactTable,
  VisibilityState,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
} from "@tanstack/react-table";

import { TableListColumnVisibility } from "./column-visibility";
import { TableListContent } from "./content";
import { tableListContext } from "./context";
import {
  TableListPaginationItems,
  TableListPaginationNext,
  TableListPaginationPrevious,
} from "./pagination";
import {
  TableListToolbar,
  TableListToolbarActions,
  TableListToolbarFilters,
  type TableListToolbarFilterItem,
} from "./toolbar";

interface TableListProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  list: TData[];
  columnDefs: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  pagination?: {
    pagination: PaginationState;
    onPaginationChange?: (pagination: PaginationState) => void;
    totalPages?: number;
  };
  filtering?: {
    columnFilters: ColumnFiltersState;
    onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  };
  visibility?: {
    columnVisibility: VisibilityState;
    onColumnVisibilityChange: (graph: VisibilityState) => void;
  };
}

function TableList<TData, TValue>(rootProps: TableListProps<TData, TValue>) {
  const {
    list,
    columnDefs,
    filtering,
    visibility,
    pagination,
    isLoading,
    ...props
  } = rootProps;

  const { columnFilters = [], onColumnFiltersChange } = filtering || {};
  const { columnVisibility: _columnVisibility, onColumnVisibilityChange } =
    visibility || {};

  const {
    pagination: _pagination = { pageIndex: 0, pageSize: 10 },
    onPaginationChange,
    totalPages = 1,
  } = pagination || {};

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => _columnVisibility ?? {});

  const table = useReactTable({
    data: list,
    columns: columnDefs,

    state: {
      columnFilters,
      columnVisibility,
      pagination: _pagination,
    },

    manualFiltering: true,
    manualPagination: true,

    pageCount: totalPages,

    onColumnFiltersChange: onColumnFiltersChange,
    onColumnVisibilityChange: (updater) => {
      const updated =
        typeof updater === "function" ? updater(columnVisibility) : updater;
      setColumnVisibility(updated);
      onColumnVisibilityChange?.(updated);
    },
    onPaginationChange: (updater) => {
      const updated =
        typeof updater === "function" ? updater(_pagination) : updater;
      onPaginationChange?.(updated);
    },

    getCoreRowModel: getCoreRowModel(),
  });

  const memoizedTable = React.useMemo(() => table, [table]);

  return (
    <tableListContext.Provider value={{ table: memoizedTable, isLoading }}>
      <div {...props} />
    </tableListContext.Provider>
  );
}

export {
  TableList,
  TableListColumnVisibility,
  TableListContent,
  TableListToolbar,
  TableListToolbarActions,
  TableListToolbarFilters,
  TableListToolbarFilterItem,
  TableListPaginationItems,
  TableListPaginationPrevious,
  TableListPaginationNext,
};
