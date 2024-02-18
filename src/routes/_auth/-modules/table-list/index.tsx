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
  filtering?: {
    columnFilters: ColumnFiltersState;
    onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  };
  visibility?: {
    columns: VisibilityState;
    onColumnVisibilityChange: OnChangeFn<VisibilityState>;
  };
}

function TableList<TData, TValue>(rootProps: TableListProps<TData, TValue>) {
  const { list, columnDefs, filtering, ...props } = rootProps;

  const { columnFilters = [], onColumnFiltersChange } = filtering || {};

  const table = useReactTable({
    data: list,
    columns: columnDefs,

    state: {
      columnFilters,
    },

    manualFiltering: true,
    manualPagination: true,

    onColumnFiltersChange: onColumnFiltersChange,

    getCoreRowModel: getCoreRowModel(),
  });

  const memoizedTable = React.useMemo(() => table, [table]);

  return (
    <tableListContext.Provider value={{ table: memoizedTable }}>
      <div {...props} />
    </tableListContext.Provider>
  );
}

export {
  TableList,
  TableListColumnVisibility,
  TableListToolbar,
  TableListToolbarProps,
  TableListToolbarFilterItem,
};
