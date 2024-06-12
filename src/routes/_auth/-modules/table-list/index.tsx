import React from "react";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type OnChangeFn,
  type PaginationState,
  type VisibilityState,
} from "@tanstack/react-table";

import { TableListColumnVisibilityDropdown } from "./column-visibility";
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

interface TableListProps<TData, TValue> {
  children: React.ReactNode;

  list: TData[];
  columnDefs: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  ordering?: {
    columnOrder?: ColumnOrderState;
    onColumnOrderChange?: (columnOrder: ColumnOrderState) => void;
  };
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
    ordering,
    isLoading,
    children,
  } = rootProps;

  const { columnFilters = [], onColumnFiltersChange } = filtering || {};
  const { columnOrder: _columnOrder, onColumnOrderChange } = ordering || {};
  const { columnVisibility: _columnVisibility, onColumnVisibilityChange } =
    visibility || {};
  const {
    pagination: _pagination = { pageIndex: 0, pageSize: 10 },
    onPaginationChange,
    totalPages = 1,
  } = pagination || {};

  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    () => _columnOrder ?? columnDefs.map((column) => column.id!)
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => _columnVisibility ?? {});

  const table = useReactTable({
    data: list,
    columns: columnDefs,

    state: {
      columnOrder,
      columnFilters,
      columnVisibility,
      pagination: _pagination,
    },

    manualFiltering: true,
    manualPagination: true,

    pageCount: totalPages,

    onColumnFiltersChange: onColumnFiltersChange,
    onColumnOrderChange: (updater) => {
      const updated =
        typeof updater === "function" ? updater(columnOrder) : updater;
      setColumnOrder(updated);
      onColumnOrderChange?.(updated);
    },
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

  return (
    <tableListContext.Provider value={{ table, isLoading }}>
      {children}
    </tableListContext.Provider>
  );
}

export {
  TableList,
  TableListColumnVisibilityDropdown,
  TableListContent,
  TableListToolbar,
  TableListToolbarActions,
  TableListToolbarFilters,
  TableListToolbarFilterItem,
  TableListPaginationItems,
  TableListPaginationPrevious,
  TableListPaginationNext,
};
