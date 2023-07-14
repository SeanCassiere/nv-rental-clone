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
  const filterState = table
    .getState()
    .columnFilters.find((item) => item.id === id);

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
            filterState?.value !== "" &&
            filterState?.value !== undefined && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {
                    options.find((item) => item.value === filterState?.value)
                      ?.label
                  }
                </Badge>
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
                  const isSelected = filterState?.value === option.value;
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
                  Clear filter
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}
