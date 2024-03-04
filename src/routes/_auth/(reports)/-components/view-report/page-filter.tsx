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
} from "@/components/ui/command";
import { icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { useReportContext } from "@/routes/_auth/(reports)/-components/view-report/view-report-context";

import { dateFormat } from "@/lib/utils/report";

import type { ReportFilterOption } from "@/lib/types/report";

import { cn } from "@/lib/utils";

interface ReportFilterProps {
  accessor: string;
  displayName: string;
}

/**
 * Used for selecting a single date
 */
export function DateReportFilter(props: ReportFilterProps) {
  const { t } = useTranslation();
  const { searchCriteria, initialSearchCriteria, setCriteriaValue } =
    useReportContext();

  const originalCriteria = initialSearchCriteria[props.accessor];
  const clearable = (originalCriteria ?? "").length === 0;

  const baseState = searchCriteria[props.accessor];

  if (typeof baseState === "undefined") {
    return null;
  }

  return (
    <span className="flex w-full justify-between">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex w-full justify-start whitespace-nowrap border-dashed",
              baseState && clearable ? "border-r-0" : ""
            )}
          >
            <icons.PlusCircle className="mr-2 h-3 w-3" />
            {props.displayName}

            {baseState && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {t("intlDate", { value: baseState, ns: "format" })}
                </Badge>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("p-0", "w-auto")} align="start">
          <Calendar
            mode="single"
            selected={baseState ? new Date(baseState) : undefined}
            today={baseState ? new Date(baseState) : new Date()}
            onSelect={(day) => {
              if (!day && clearable) {
                setCriteriaValue(props.accessor, "");
                return;
              }

              if (!day) return;

              setCriteriaValue(props.accessor, dateFormat(day));
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {baseState && clearable && (
        <Button
          size="sm"
          variant="outline"
          className="-ml-2 border-l-0 border-dashed pl-2.5"
          onClick={() => {
            setCriteriaValue(props.accessor, "");
          }}
        >
          <icons.X className="h-3 w-3" />
        </Button>
      )}
    </span>
  );
}

/**
 * Used for entering a single line of text
 */
export function TextBoxReportFilter(props: ReportFilterProps) {
  const { searchCriteria, setCriteriaValue } = useReportContext();

  const baseState = searchCriteria[props.accessor];

  if (typeof baseState === "undefined") {
    return null;
  }

  return (
    <span className="flex w-full justify-between">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex w-full justify-start whitespace-nowrap border-dashed"
            )}
          >
            <icons.PlusCircle className="mr-2 h-3 w-3" />
            {props.displayName}

            {baseState && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="max-w-[180px] rounded-sm px-1 font-normal"
                >
                  <span className="truncate">{baseState}</span>
                </Badge>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("p-0", "max-w-[250px]")} align="start">
          <div className="px-2 py-3">
            <Input
              placeholder={props.displayName}
              value={typeof baseState === "string" ? baseState : ""}
              onChange={(event) => {
                const writeValue = event.target.value.trim();
                setCriteriaValue(props.accessor, writeValue);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
      {baseState && (
        <Button
          size="sm"
          variant="outline"
          className="-ml-2 border-l-0 border-dashed pl-2.5"
          onClick={() => {
            setCriteriaValue(props.accessor, "");
          }}
        >
          <icons.X className="h-3 w-3" />
        </Button>
      )}
    </span>
  );
}

/**
 * Used for selecting multiple options from a list
 */
export function SelectDropdownReportFilter(
  props: ReportFilterProps & { options: ReportFilterOption[] }
) {
  const { searchCriteria, initialSearchCriteria, setCriteriaValue } =
    useReportContext();

  const options = props.options;

  const originalCriteria = initialSearchCriteria[props.accessor];
  const clearable = (originalCriteria ?? "").length === 0;

  const baseState = searchCriteria[props.accessor];

  const selectedOption = options.find((option) => option.value === baseState);

  if (typeof baseState === "undefined") {
    return null;
  }

  return (
    <span className="flex w-full justify-between">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex w-full justify-start whitespace-nowrap border-dashed"
            )}
          >
            <icons.PlusCircle className="mr-2 h-3 w-3" />
            {props.displayName}

            {selectedOption && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selectedOption.display}
                </Badge>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("p-0", "max-w-[250px]")} align="start">
          <Command>
            <CommandInput placeholder={props.displayName} />
            <CommandList>
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup>
                {options.map((option, index) => {
                  const isSelected = baseState === option.value;
                  return (
                    <CommandItem
                      key={`report_filter_${props.accessor}-select-${index}`}
                      className="text-base"
                      onSelect={() => {
                        setCriteriaValue(props.accessor, option.value);
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
                      <span>{option.display}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {baseState && clearable && (
        <Button
          size="sm"
          variant="outline"
          className="-ml-2 border-l-0 border-dashed pl-2.5"
          onClick={() => {
            setCriteriaValue(props.accessor, originalCriteria ?? "");
          }}
        >
          <icons.X className="h-3 w-3" />
        </Button>
      )}
    </span>
  );
}

/**
 * Used for selecting a single option from a list
 */
export function MultiSelectDropdownReportFilter(
  props: ReportFilterProps & { options: ReportFilterOption[] }
) {
  const { searchCriteria, initialSearchCriteria, setCriteriaValue } =
    useReportContext();

  const options = props.options;

  const originalCriteria = initialSearchCriteria[props.accessor];
  const clearable = (originalCriteria ?? "").length === 0;

  const baseState = (searchCriteria[props.accessor] ?? "")
    .split(",")
    .filter(Boolean);

  return (
    <span className="flex w-full justify-between">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex w-full justify-start whitespace-nowrap border-dashed"
            )}
          >
            <icons.PlusCircle className="mr-2 h-3 w-3" />
            {props.displayName}

            {baseState.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {baseState.length}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {baseState.length > 2 ? (
                    <>
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {baseState.length} selected
                      </Badge>
                    </>
                  ) : (
                    <>
                      {baseState.map((item, idx) => (
                        <Badge
                          key={`${props.accessor}_${item}_${idx}`}
                          variant="secondary"
                          className="rounded-sm px-1 font-normal"
                        >
                          {options.find((i) => i.value === item)?.display}
                        </Badge>
                      ))}
                    </>
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("p-0", "max-w-[250px]")} align="start">
          <Command>
            <CommandInput placeholder={props.displayName} />
            <CommandList>
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup>
                {options.map((option, index) => {
                  const isSelected = baseState.includes(option.value);
                  return (
                    <CommandItem
                      key={`report_filter_${props.accessor}-multi-select-${index}`}
                      className="text-base"
                      onSelect={() => {
                        if (isSelected) {
                          setCriteriaValue(
                            props.accessor,
                            baseState
                              .filter((item) => item !== option.value)
                              .join(",")
                          );
                        } else {
                          setCriteriaValue(
                            props.accessor,
                            [...baseState, option.value].join(",")
                          );
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
                      <span>{option.display}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {/* <CommandSeparator />
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
                </CommandGroup> */}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {baseState.length > 0 && clearable && (
        <Button
          size="sm"
          variant="outline"
          className="-ml-2 border-l-0 border-dashed pl-2.5"
          onClick={() => {
            setCriteriaValue(props.accessor, originalCriteria ?? "");
          }}
        >
          <icons.X className="h-3 w-3" />
        </Button>
      )}
    </span>
  );
}
