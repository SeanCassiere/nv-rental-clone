import React from "react";
import {
  getCoreRowModel,
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
  TableListToolbar,
  type TableListToolbarFilterItem,
  type TableListToolbarProps,
} from "./toolbar";

interface TableListProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  list: TData[];
  columnDefs: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
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
  const { list, columnDefs, filtering, visibility, isLoading, ...props } =
    rootProps;

  const { columnFilters = [], onColumnFiltersChange } = filtering || {};
  const { columnVisibility: _columnVisibility, onColumnVisibilityChange } =
    visibility || {};

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => _columnVisibility ?? {});

  const table = useReactTable({
    data: list,
    columns: columnDefs,

    state: {
      columnFilters,
      columnVisibility,
    },

    manualFiltering: true,
    manualPagination: true,

    onColumnFiltersChange: onColumnFiltersChange,
    onColumnVisibilityChange: (updater) => {
      const updated =
        typeof updater === "function" ? updater(columnVisibility) : updater;
      setColumnVisibility(updated);
      onColumnVisibilityChange?.(updated);
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
  TableListToolbarProps,
  TableListToolbarFilterItem,
};
