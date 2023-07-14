import React from "react";
import { XIcon } from "lucide-react";
import { type Table, type ColumnFiltersState } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/ui/data-table";
import {
  PrimaryModuleTableFacetedFilter,
  type PrimaryModuleTableFacetedFilterItem,
} from "@/components/primary-module/table-filter";

export interface PrimaryModuleTableToolbarProps<TData> {
  table: Table<TData>;
  onClearFilters: () => void;
  onSearchWithFilters: () => void;
  filterableColumns?: PrimaryModuleTableFacetedFilterItem[];
}

export function PrimaryModuleTableToolbar<TData>({
  table,
  filterableColumns = [],
  onClearFilters: callClearFiltersFn,
  onSearchWithFilters,
}: PrimaryModuleTableToolbarProps<TData>) {
  const tableColumnFilters = table.getState().columnFilters;
  const isFiltered = tableColumnFilters.length > 0;

  const handleReset = () => {
    const f = table.getState().columnFilters;
    const newState = f.reduce((prev, current) => {
      const currentInFilterable = filterableColumns.find(
        (i) => i.id === current.id
      );

      if (currentInFilterable) {
        current.value = currentInFilterable?.defaultValue || undefined;
      }

      prev.push(current);
      return prev;
    }, [] as ColumnFiltersState);

    table.setColumnFilters(newState);

    callClearFiltersFn();
  };

  return (
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-wrap items-start justify-start gap-2 sm:space-x-2">
        {filterableColumns.length &&
          filterableColumns.map((column) => (
            <PrimaryModuleTableFacetedFilter
              key={`faceted_filter_${column.id}`}
              table={table}
              data={column}
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
            onClick={handleReset}
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
