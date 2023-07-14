import React from "react";
import { XIcon } from "lucide-react";
import { type Table, type ColumnFiltersState } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/ui/data-table";
import {
  PrimaryModuleTableFacetedFilter,
  type FacetedFilterType,
  type FilterOption,
} from "@/components/primary-module/table-filter";

export interface PrimaryModuleTableToolbarProps<
  TData,
  TColumnFilters extends ColumnFiltersState,
> {
  table: Table<TData>;
  onClearFilters: () => void;
  onSearchWithFilters: () => void;
  filterableColumns?: {
    id: TColumnFilters[number]["id"];
    title: string;
    type: FacetedFilterType;
    options: FilterOption[];
  }[];
}

export function PrimaryModuleTableToolbar<
  TData,
  TColumnFilters extends ColumnFiltersState,
>({
  table,
  filterableColumns = [],
  onClearFilters,
  onSearchWithFilters,
}: PrimaryModuleTableToolbarProps<TData, TColumnFilters>) {
  const tableColumnFilters = table.getState().columnFilters;
  const isFiltered = tableColumnFilters.length > 0;

  return (
    <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center space-x-2">
        {filterableColumns.length &&
          filterableColumns.map((column) => (
            <PrimaryModuleTableFacetedFilter
              key={`faceted_filter_${column.id}`}
              table={table}
              id={column.id}
              title={column.title}
              type={column.type}
              options={column.options}
            />
          ))}
        <Button
          size="sm"
          onClick={onSearchWithFilters}
          className="h-8 px-2 lg:px-3"
        >
          Search
        </Button>
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 lg:px-3"
          >
            Clear
            <XIcon className="ml-2 h-3 w-3" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
