import { PlusCircleIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { useReportContext } from "@/hooks/context/view-report";

import { dateFormat } from "@/utils/report";

import { cn } from "@/utils";

import { Input } from "../ui/input";

interface ReportFilterProps {
  accessor: string;
  displayName: string;
}

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
            <PlusCircleIcon className="mr-2 h-3 w-3" />
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
          <XIcon className="h-3 w-3" />
        </Button>
      )}
    </span>
  );
}

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
            <PlusCircleIcon className="mr-2 h-3 w-3" />
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
        <PopoverContent className={cn("p-0", "w-[200px]")} align="start">
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
          <XIcon className="h-3 w-3" />
        </Button>
      )}
    </span>
  );
}
