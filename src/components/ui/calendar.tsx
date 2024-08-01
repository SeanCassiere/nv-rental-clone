import * as React from "react";
import {
  DayPicker,
  useDayPicker,
  type DropdownProps,
  type Matcher,
} from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { addMonths } from "@/lib/config/date-fns";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  startMonth,
  endMonth,
  hidden,
  captionLayout,
  ...props
}: CalendarProps) {
  const layout: CalendarProps["captionLayout"] = captionLayout || "dropdown";

  const calendarStartMonth = startMonth ?? new Date(1900, 0, 0);
  const calendarEndMonth =
    endMonth ?? new Date(new Date().getFullYear() + 15, 11);

  const hiddenIsArray = Array.isArray(hidden);

  const calendarHiddenOptions: Matcher[] = [
    ...(startMonth ? [{ before: startMonth }] : []),
    ...(endMonth ? [{ after: endMonth }] : []),
    ...(hiddenIsArray ? hidden : []),
    hidden && !hiddenIsArray ? hidden : [],
  ];

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("inline-flex justify-start", className)}
      captionLayout={layout}
      startMonth={calendarStartMonth}
      endMonth={calendarEndMonth}
      hidden={calendarHiddenOptions}
      classNames={{
        months: "relative",
        month: cn(layout === "label" ? "space-y-4" : "space-y-2"),
        month_caption: cn(
          layout === "label" ? "translate-y-1" : "",
          layout === "dropdown" && "flex w-full justify-center"
        ),
        caption_label: cn(
          "pl-2 font-medium",
          layout === "dropdown" && "hidden"
        ),
        dropdowns: cn(
          layout === "dropdown"
            ? "flex items-center justify-center gap-1.5"
            : "",
          layout === "dropdown-years" || layout === "dropdown-months"
            ? "flex w-8/12 items-center justify-between [&>button]:translate-x-3 [&>span]:pl-2 [&>span]:font-medium"
            : "",
          layout === "dropdown-months" ? "flex-row-reverse" : ""
        ),
        nav: cn(
          layout === "label" ||
            layout === "dropdown-years" ||
            layout === "dropdown-months"
            ? "absolute right-1 top-0 flex gap-1.5"
            : ""
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 bg-transparent p-0 opacity-50 hover:opacity-100",
          layout === "dropdown" && "absolute left-1 top-0"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 bg-transparent p-0 opacity-50 hover:opacity-100",
          layout === "dropdown" && "absolute right-1 top-0"
        ),
        table: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "m-0.5 h-7 w-9 select-none rounded-md text-[0.8rem] font-normal text-muted-foreground",
        row: "mt-2 flex w-full",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "m-0.5 size-9 p-0 font-normal aria-selected:opacity-100 [&>button]:h-full [&>button]:w-full"
        ),
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "text-muted-foreground opacity-50 transition-all aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:opacity-90 aria-selected:hover:opacity-100",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron(props) {
          switch (props.orientation) {
            case "left":
              return (
                <icons.ChevronLeft className={cn("size-5", props.className)} />
              );
            case "right":
              return (
                <icons.ChevronRight className={cn("size-5", props.className)} />
              );
            default:
              return <span>·</span>;
          }
        },
        Dropdown: CalendarDropdown,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

const numberRegex = /^\d+$/;

function CalendarDropdown(props: DropdownProps) {
  const dropdownType: "unknown" | "months" | "years" = React.useMemo(() => {
    const option = props.options?.[0];
    if (!option) {
      return "unknown";
    }
    const label = option.label;

    if (!numberRegex.test(label)) {
      return "months";
    }

    return "years";
  }, [props.options]);
  const { goToMonth, previousMonth } = useDayPicker();

  const currentMonth = addMonths(previousMonth ?? new Date(), 1);
  const options = props.options ?? [];

  const handleMonthChange = (value: string) => {
    const date = new Date(currentMonth);
    date.setMonth(parseInt(value, 10));
    goToMonth(date);
  };

  const handleYearChange = (value: string) => {
    const date = new Date(currentMonth);
    date.setFullYear(parseInt(value, 10));
    goToMonth(date);
  };

  if (dropdownType === "months") {
    return (
      <Select onValueChange={handleMonthChange} value={props.value?.toString()}>
        <SelectTrigger
          className={cn("m-0 h-8 w-24", props.className)}
          style={props.style}
        >
          {currentMonth.toLocaleString("default", { month: "long" })}
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="overflow-auto" style={{ maxHeight: "400px" }}>
            {options.map(({ value, label, disabled }) => (
              <SelectItem
                key={`${"id"}_month_${value}`}
                value={value.toString()}
                disabled={disabled}
              >
                {label}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    );
  }

  if (dropdownType === "years") {
    return (
      <Select onValueChange={handleYearChange} value={props.value?.toString()}>
        <SelectTrigger
          className={cn("m-0 h-8 w-24", props.className)}
          style={props.style}
        >
          {currentMonth.getFullYear()}
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="overflow-auto" style={{ maxHeight: "400px" }}>
            {options.map(({ value, label, disabled }) => (
              <SelectItem
                key={`${"id"}_year_${value}`}
                value={value.toString()}
                disabled={disabled}
              >
                {label}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    );
  }

  return <div>dropdown</div>;
}

CalendarDropdown.displayName = "CalendarDropdown";

export { Calendar };
