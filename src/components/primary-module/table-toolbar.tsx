import React from "react";
import { XIcon } from "lucide-react";
import { type Table, type ColumnFiltersState } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { DataTableViewOptions } from "@/components/ui/data-table";
import {
  PrimaryModuleTableFacetedFilter,
  type FacetedFilterType,
  type FilterOption,
} from "./table-filter";

export interface PrimaryModuleTableToolbarProps<
  TData,
  TColumnFilters extends ColumnFiltersState,
> {
  table: Table<TData>;
  onClearFilters: () => void;
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
  onClearFilters,
  filterableColumns = [],
}: PrimaryModuleTableToolbarProps<TData, TColumnFilters>) {
  const tableColumnFilters = table.getState().columnFilters;
  console.log("tableColumnFilters", tableColumnFilters);
  const isFiltered = tableColumnFilters.length > 0;
  // console.log("filterableColumns", filterableColumns);

  return (
    <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center space-x-2">
        {/* <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        /> */}

        {/* {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={[]}
          />
        )} */}
        {filterableColumns.length &&
          filterableColumns.map(
            (column) =>
              tableColumnFilters.find(
                (tableColumnFilter) => tableColumnFilter.id === column.id
              ) && (
                <PrimaryModuleTableFacetedFilter
                  key={`faceted_filter_${column.id}`}
                  table={table}
                  id={column.id}
                  title={column.type}
                  type={column.type}
                  options={column.options}
                />
              )
          )}
        {isFiltered && (
          <Button
            variant="ghost"
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
