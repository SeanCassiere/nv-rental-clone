import React from "react";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { localDateToQueryYearMonthDay } from "@/lib/utils/date";

import { cn, compareStringArrays } from "@/lib/utils";

import { useTableList } from "./context";

type TableListToolbarContextProps = {
  filterItems: TableListToolbarFilterItem[];
  handleReset: () => void;
  handleSearch: () => void;
};

const tableListToolbarContext =
  React.createContext<TableListToolbarContextProps | null>(null);

function useTableListToolbar() {
  const context = React.useContext(tableListToolbarContext);
  if (!context) {
    throw new Error(
      "useTableListToolbar must be used within a TableListToolbar"
    );
  }
  return context;
}

function TableListToolbar({
  filterItems,
  onSearchWithFilters,
  onClearFilters,
  children,
  className,
  ...props
}: {
  filterItems: TableListToolbarContextProps["filterItems"];
  onSearchWithFilters: () => void;
  onClearFilters: () => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { table } = useTableList();

  const handleReset = React.useCallback(() => {
    const f = table.getState().columnFilters;
    const newState = f.reduce((prev, current) => {
      const currentInFilterable = filterItems.find((i) => i.id === current.id);

      if (currentInFilterable) {
        current.value = currentInFilterable?.defaultValue || undefined;
      }

      prev.push(current);
      return prev;
    }, [] as ColumnFiltersState);

    table.setColumnFilters(newState);

    onClearFilters();
  }, [filterItems, onClearFilters, table]);

  return (
    <tableListToolbarContext.Provider
      value={{
        filterItems,
        handleReset,
        handleSearch: onSearchWithFilters,
      }}
    >
      <div
        className={cn("rounded-md border bg-card p-2", className)}
        {...props}
      >
        {children}
      </div>
    </tableListToolbarContext.Provider>
  );
}
TableListToolbar.displayName = "TableListToolbar";

function TableListToolbarFilters() {
  const { filterItems } = useTableListToolbar();

  const publicFilters = filterItems.filter((item) => item.type !== "hidden");

  return (
    <React.Fragment>
      {publicFilters.length &&
        publicFilters.map((column) => (
          <ToolbarFilter
            key={`tableList_faceted_filter_${column.id}`}
            data={column}
          />
        ))}
    </React.Fragment>
  );
}
TableListToolbarFilters.displayName = "TableListToolbarFilters";

function TableListToolbarActions({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { handleSearch, handleReset, filterItems } = useTableListToolbar();
  const { table } = useTableList();

  const tableFilters = React.useMemo(
    () => table.getState().columnFilters,
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-compiler/react-compiler
    [table.getState().columnFilters]
  );

  const isFiltered = React.useMemo(() => {
    let isDirty = false;

    tableFilters.forEach((filter) => {
      const schema = filterItems.find((item) => item.id === filter.id);

      if (!schema) {
        if (typeof filter.value !== "undefined") {
          console.warn(
            `TableListToolbarActions.isFiltered ~ filter schema not found for "${filter.id}" and value`,
            filter.value
          );
          isDirty = true;
        }
        return;
      }

      switch (schema.type) {
        case "select":
          const selectDefault = schema.defaultValue;
          if (filter.value !== selectDefault) {
            isDirty = true;
          }
          break;
        case "multi-select":
          const multiSelectDefault = schema.defaultValue;
          if (Array.isArray(filter.value)) {
            const isBothArraysEqual = compareStringArrays(
              filter.value,
              multiSelectDefault || []
            );
            if (!isBothArraysEqual) {
              isDirty = true;
            }
          }
          break;
        case "date":
          if (filter.value) {
            isDirty = true;
          }
          break;
        case "text":
          if (filter.value) {
            isDirty = true;
          }
          break;
        case "hidden":
          if (filter.value) {
            isDirty = true;
          }
          break;
        default:
          break;
      }
    });

    return isDirty;
  }, [filterItems, tableFilters]);

  return (
    <div className={cn(className)} {...props}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSearch}
        className="h-8 px-2 lg:px-3"
      >
        <icons.Search className="mr-2 h-3 w-3" />
        Search
      </Button>

      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 px-2 lg:px-3"
        >
          <icons.X className="mr-2 h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  );
}
TableListToolbarActions.displayName = "TableListToolbarActions";

// The stuff for the individual filter items is below
type FilterOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type TableListToolbarFilterItem = {
  id: string;
  title: string;
} & (
  | {
      type: "hidden";
      options?: never;
      defaultValue?: string | undefined;
      size?: never;
    }
  | {
      type: "text";
      options?: never;
      defaultValue?: string | undefined;
      size?: "large" | "normal";
    }
  | {
      type: "select";
      options: FilterOption[];
      defaultValue?: string | undefined;
      size?: never;
    }
  | {
      type: "multi-select";
      options: FilterOption[];
      defaultValue?: string[] | undefined;
      size?: never;
    }
  | {
      type: "date";
      options?: never;
      defaultValue?: string | undefined;
      size?: never;
    }
);

interface TableListToolbarFilterOption {
  data: TableListToolbarFilterItem;
  isLargeSearchFullWidth?: boolean;
}

function ToolbarFilter({
  data: { id, title, type, options = [], size = "normal", defaultValue },
  isLargeSearchFullWidth = false,
}: TableListToolbarFilterOption) {
  const { table } = useTableList();
  const { t } = useTranslation();

  const clearText = t("buttons.clear", { ns: "labels" });

  const baseState = React.useMemo(
    () => table.getState().columnFilters.find((item) => item.id === id),
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-compiler/react-compiler
    [id, table.getState().columnFilters]
  );

  const arrayState =
    baseState && Array.isArray(baseState?.value)
      ? baseState.value.map((e) => String(e))
      : [];

  const handleSaveValue = React.useCallback(
    (
      updateValue: string | string[] | Date | undefined,
      handleType: "date" | "date-time" | "array" | "text" = "text"
    ) => {
      table.setColumnFilters((prev) => {
        const newFiltersList = prev.filter((item) => item.id !== id);

        switch (handleType) {
          case "date":
            newFiltersList.push({
              id,
              value:
                updateValue instanceof Date
                  ? localDateToQueryYearMonthDay(updateValue)
                  : undefined,
            });
            break;
          default:
            newFiltersList.push({ id, value: updateValue });
            break;
        }

        return newFiltersList;
      });
    },
    [id, table]
  );

  if (type === "text" && size === "large") {
    return (
      <div className={cn(isLargeSearchFullWidth ? "w-full" : "")}>
        <Input
          placeholder={`${title}...`}
          value={typeof baseState?.value === "string" ? baseState.value : ""}
          onChange={(event) => {
            const writeValue = event.target.value.trim();
            handleSaveValue(writeValue !== "" ? writeValue : undefined);
          }}
          className="h-8 w-full border-dashed md:w-[250px]"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 whitespace-nowrap border-dashed",
              type === "date" && baseState?.value ? "border-r-0" : ""
            )}
          >
            <icons.PlusCircle className="mr-2 h-3 w-3" />
            {title}
            {type === "select" &&
              baseState?.value !== "" &&
              baseState?.value !== undefined && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {
                      options.find((item) => item.value === baseState?.value)
                        ?.label
                    }
                  </Badge>
                </>
              )}
            {type === "multi-select" && arrayState.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {arrayState.length}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {arrayState.length > 2 ? (
                    <>
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {arrayState.length} selected
                      </Badge>
                    </>
                  ) : (
                    <>
                      {arrayState.map((item, idx) => (
                        <Badge
                          key={`table_list_${id}_${item}_${idx}`}
                          variant="secondary"
                          className="rounded-sm px-1 font-normal"
                        >
                          {options.find((i) => i.value === item)?.label}
                        </Badge>
                      ))}
                    </>
                  )}
                </div>
              </>
            )}
            {type === "date" &&
              baseState?.value !== "" &&
              baseState?.value !== undefined &&
              typeof baseState?.value === "string" && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {t("intlDate", { value: baseState?.value, ns: "format" })}
                  </Badge>
                </>
              )}
            {type === "text" &&
              baseState?.value !== "" &&
              baseState?.value !== undefined && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge
                    variant="secondary"
                    className="max-w-[180px] rounded-sm px-1 font-normal"
                  >
                    <span className="truncate">
                      {typeof baseState?.value === "string"
                        ? baseState?.value
                        : null}
                    </span>
                  </Badge>
                </>
              )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("p-0", type === "date" ? "w-auto" : "w-[200px]")}
          align="start"
        >
          {type === "select" && (
            <Command>
              <CommandInput placeholder={title} />
              <CommandList>
                <CommandEmpty>No results found</CommandEmpty>
                <CommandGroup>
                  {options.map((option, index) => {
                    const isSelected = baseState?.value === option.value;
                    return (
                      <CommandItem
                        key={`table_list_col-${id}-select-${index}`}
                        className="text-base"
                        onSelect={() => {
                          handleSaveValue(option.value);
                        }}
                      >
                        <div
                          className={cn(
                            "mr-3 flex h-3 w-3 items-center justify-center rounded-full border border-primary/70",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <icons.Check className={cn("h-4 w-4")} />
                        </div>
                        <span>{option.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      handleSaveValue(defaultValue || undefined);
                    }}
                    className="justify-center"
                  >
                    {clearText}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          )}
          {type === "multi-select" && (
            <Command>
              <CommandInput placeholder={title} />
              <CommandList>
                <CommandEmpty>No results found</CommandEmpty>
                <CommandGroup>
                  {options.map((option, index) => {
                    const isSelected = arrayState.includes(option.value);
                    return (
                      <CommandItem
                        key={`table_list_col-${id}-multi-select-${index}`}
                        className="text-base"
                        onSelect={() => {
                          if (isSelected) {
                            handleSaveValue(
                              arrayState.filter((item) => item !== option.value)
                            );
                          } else {
                            handleSaveValue([...arrayState, option.value]);
                          }
                        }}
                      >
                        <div
                          className={cn(
                            "mr-3 flex h-3 w-3 items-center justify-center rounded-sm border border-primary/70",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <icons.Check className={cn("h-4 w-4")} />
                        </div>
                        <span>{option.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      handleSaveValue(defaultValue || []);
                    }}
                    className="justify-center"
                  >
                    {clearText}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          )}
          {type === "date" && (
            <Calendar
              mode="single"
              className="p-2 pt-3"
              autoFocus
              selected={
                baseState?.value && typeof baseState.value === "string"
                  ? new Date(baseState.value)
                  : undefined
              }
              onSelect={(day) => {
                handleSaveValue(day, "date");
              }}
            />
          )}
          {type === "text" && (
            <div className="px-2 py-3">
              <Input
                placeholder={title}
                value={
                  typeof baseState?.value === "string" ? baseState.value : ""
                }
                onChange={(event) => {
                  const writeValue = event.target.value.trim();
                  handleSaveValue(writeValue !== "" ? writeValue : undefined);
                }}
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
      {(type === "date" || type === "text") &&
        baseState?.value !== "" &&
        baseState?.value !== undefined && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="-ml-2 h-8 border-l-0 border-dashed pl-2.5"
              onClick={() => {
                handleSaveValue(undefined);
              }}
            >
              <icons.X className="h-3 w-3" />
            </Button>
          </>
        )}
    </div>
  );
}
ToolbarFilter.displayName = "ToolbarFilter";

export { TableListToolbar, TableListToolbarFilters, TableListToolbarActions };
