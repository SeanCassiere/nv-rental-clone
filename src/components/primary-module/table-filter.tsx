import React from "react";
import { type Table } from "@tanstack/react-table";
import { PlusCircle, CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/utils";

export type FilterOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type PrimaryModuleTableFacetedFilterItem = {
  id: string;
  title: string;
} & (
  | { type: "text"; options?: never; defaultValue?: string | undefined }
  | {
      type: "select";
      options: FilterOption[];
      defaultValue?: string | undefined;
    }
  | {
      type: "multi-select";
      options: FilterOption[];
      defaultValue?: string[] | undefined;
    }
);

interface PrimaryModuleTableFacetedFilterProps<TData, TValue> {
  table: Table<TData>;
  data: PrimaryModuleTableFacetedFilterItem;
}

export function PrimaryModuleTableFacetedFilter<TData, TValue>({
  table,
  data: { id, title, type, options = [] },
}: PrimaryModuleTableFacetedFilterProps<TData, TValue>) {
  const clearFilterText = "Clear filter";

  const baseState = table
    .getState()
    .columnFilters.find((item) => item.id === id);

  const arrayState =
    baseState && Array.isArray(baseState?.value)
      ? baseState.value.map((e) => String(e))
      : [];

  const handleSaveValue = (updateValue: string | string[] | undefined) => {
    table.setColumnFilters((prev) => {
      const newFiltersList = prev.filter((item) => item.id !== id);
      newFiltersList.push({ id, value: updateValue });
      return newFiltersList;
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-3 w-3" />
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
                        key={`${id}_${item}_${idx}`}
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
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        {type === "select" && (
          <Command>
            <CommandInput className="h-8" placeholder={title} />
            <CommandList>
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup>
                {options.map((option, index) => {
                  const isSelected = baseState?.value === option.value;
                  return (
                    <CommandItem
                      key={`col-${id}-select-${index}`}
                      onSelect={() => {
                        handleSaveValue(option.value);
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-3 w-3 items-center justify-center rounded-full border border-primary/70",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className={cn("h-4 w-4")} />
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
                    handleSaveValue(undefined);
                  }}
                  className="justify-center"
                >
                  {clearFilterText}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        )}
        {type === "multi-select" && (
          <Command>
            <CommandInput className="h-8" placeholder={title} />
            <CommandList>
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup>
                {options.map((option, index) => {
                  const isSelected = arrayState.includes(option.value);
                  return (
                    <CommandItem
                      key={`col-${id}-multi-select-${index}`}
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
                          "mr-2 flex h-3 w-3 items-center justify-center rounded-sm border border-primary/70",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className={cn("h-4 w-4")} />
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
                    handleSaveValue([]);
                  }}
                  className="justify-center"
                >
                  {clearFilterText}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}
