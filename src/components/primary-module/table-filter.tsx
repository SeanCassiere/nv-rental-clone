import React from "react";
import { type Table } from "@tanstack/react-table";

export type FilterOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type FacetedFilterType = "select" | "text";

interface PrimaryModuleTableFacetedFilterProps<TData, TValue> {
  table: Table<TData>;
  id: string;
  title: string;
  type: FacetedFilterType;
  options: FilterOption[];
}

export function PrimaryModuleTableFacetedFilter<TData, TValue>({
  table,
  id,
  title,
  type,
  options,
}: PrimaryModuleTableFacetedFilterProps<TData, TValue>) {
  const handleSaveValue = (value: string | string[] | undefined) => {
    table.setColumnFilters((prev) => [
      ...prev.filter((item) => item.id !== id),
      { id, value: value },
    ]);
  };

  return (
    <div>
      {id}{" "}
      <button onClick={() => handleSaveValue("hello world")}>save value</button>
    </div>
  );
}
