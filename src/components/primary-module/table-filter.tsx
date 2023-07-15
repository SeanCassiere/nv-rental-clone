import React from "react";
import { useTranslation } from "react-i18next";
import { PlusCircle, CheckIcon, XIcon } from "lucide-react";
import { type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/utils";
import { localDateToQueryYearMonthDay } from "@/utils/date";

export type FilterOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type PrimaryModuleTableFacetedFilterItem = {
  id: string;
  title: string;
} & (
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

interface PrimaryModuleTableFacetedFilterProps<TData, TValue> {
  table: Table<TData>;
  data: PrimaryModuleTableFacetedFilterItem;
  isLargeSearchFullWidth?: boolean;
}

export function PrimaryModuleTableFacetedFilter<TData, TValue>({
  table,
  data: { id, title, type, options = [], size = "normal", defaultValue },
  isLargeSearchFullWidth = false,
}: PrimaryModuleTableFacetedFilterProps<TData, TValue>) {
  const clearFilterText = "Clear filter";

  const { t } = useTranslation();

  const baseState = table
    .getState()
    .columnFilters.find((item) => item.id === id);

  const arrayState =
    baseState && Array.isArray(baseState?.value)
      ? baseState.value.map((e) => String(e))
      : [];

  const handleSaveValue = (
    updateValue: string | string[] | Date | undefined,
    handleType?: "date"
  ) => {
    table.setColumnFilters((prev) => {
      const newFiltersList = prev.filter((item) => item.id !== id);

      if (handleType === "date" && updateValue instanceof Date) {
        newFiltersList.push({
          id,
          value: localDateToQueryYearMonthDay(updateValue),
        });
      } else {
        newFiltersList.push({ id, value: updateValue });
      }

      return newFiltersList;
    });
  };

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
          className="h-8 w-full md:w-[250px]"
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
                    {t("intlDate", { value: baseState?.value })}
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
                      if (defaultValue) {
                        handleSaveValue(defaultValue);
                      } else {
                        handleSaveValue(undefined);
                      }
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
                      if (defaultValue) {
                        handleSaveValue(defaultValue);
                      } else {
                        handleSaveValue([]);
                      }
                    }}
                    className="justify-center"
                  >
                    {clearFilterText}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          )}
          {type === "date" && (
            <Calendar
              mode="single"
              selected={
                baseState?.value && typeof baseState.value === "string"
                  ? new Date(baseState.value)
                  : undefined
              }
              onSelect={(day) => {
                handleSaveValue(day, "date");
              }}
              initialFocus
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
              <XIcon className="h-3 w-3" />
            </Button>
          </>
        )}
    </div>
  );
}
