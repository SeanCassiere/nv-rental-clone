import React from "react";
import { XIcon } from "lucide-react";
import { type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { DataTableViewOptions } from "@/components/ui/data-table";

export interface PrimaryModuleTableToolbarProps<TData> {
  table: Table<TData>;
  onClearFilters: () => void;
}

export function PrimaryModuleTableToolbar<TData>({
  table,
  onClearFilters,
}: PrimaryModuleTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

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
