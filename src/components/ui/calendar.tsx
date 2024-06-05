import * as React from "react";
import {
  DayPicker,
  useDayPicker,
  useNavigation,
  type CaptionLayout,
  type DropdownProps,
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

import { setMonth } from "@/lib/config/date-fns";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fromYear,
  toYear,
  captionLayout,
  ...props
}: CalendarProps) {
  const layout: CaptionLayout = captionLayout || "dropdown-buttons";

  const currentYear = new Date().getFullYear();

  const oldestYear = fromYear || currentYear - 15;
  const newestYear = toYear || currentYear + 7;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      captionLayout={layout}
      fromYear={oldestYear}
      toYear={newestYear}
      classNames={{
        months: cn(
          "flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
        ),
        month: "space-y-4",
        caption: cn(
          "relative",
          layout === "buttons" && "flex items-center justify-between"
        ),
        caption_label: cn(
          "font-medium",
          layout === "dropdown" && "hidden",
          layout === "dropdown-buttons" && "hidden"
        ),
        caption_dropdowns: cn(
          "flex items-center justify-center",
          layout === "dropdown" && "-translate-x-1 gap-1.5",
          layout === "dropdown-buttons" && "-translate-x-0.5 gap-1"
        ),
        nav: cn(
          layout === "buttons" && "flex items-center justify-between gap-1"
        ),
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: cn(
          layout === "dropdown-buttons" && "absolute left-1 top-0"
        ),
        nav_button_next: cn(
          layout === "dropdown-buttons" && "absolute right-1 top-0"
        ),
        dropdown_month: cn("h-8", layout === "dropdown-buttons" && "w-20"),
        dropdown_year: cn("h-8", layout === "dropdown-buttons" && "w-20"),
        table: cn("w-full border-collapse space-y-1"),
        head_row: "flex",
        head_cell: cn(
          "w-9 select-none rounded-md text-[0.8rem] font-normal text-muted-foreground"
        ),
        row: cn("mt-2 flex w-full"),
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected: cn(
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
        ),
        day_today: cn("bg-accent text-accent-foreground"),
        day_outside: cn(
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30"
        ),
        day_disabled: cn("text-muted-foreground opacity-50"),
        day_range_middle: cn(
          "aria-selected:bg-accent aria-selected:text-accent-foreground"
        ),
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: (props) => (
          <icons.ChevronLeft
            style={props.style}
            className={cn("h-5 w-5", props.className)}
          />
        ),
        IconRight: (props) => (
          <icons.ChevronRight
            style={props.style}
            className={cn("h-5 w-5", props.className)}
          />
        ),
        Dropdown: CalendarDropdown,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

function CalendarDropdown(props: DropdownProps) {
  const { id, fromYear, fromMonth, fromDate, toYear, toMonth, toDate } =
    useDayPicker();
  const { currentMonth, goToMonth } = useNavigation();

  const months = Array.from({ length: 12 }, (_, i) => {
    const value = i.toString();
    const label = setMonth(new Date(), i).toLocaleString("default", {
      month: "long",
    });
    return { value, label };
  });

  const years = React.useMemo(() => {
    const items: { value: string; label: string }[] = [];

    const oldestYear =
      fromYear || fromMonth?.getFullYear() || fromDate?.getFullYear();
    const newestYear =
      toYear || toMonth?.getFullYear() || toDate?.getFullYear();

    if (oldestYear && newestYear) {
      const range = newestYear - oldestYear + 1;
      for (let i = 0; i < range; i++) {
        const value = (oldestYear + i).toString();
        items.push({ value, label: value });
      }
    }

    return items;
  }, [fromYear, fromMonth, fromDate, toYear, toMonth, toDate]);

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

  if (props.name === "months") {
    return (
      <Select onValueChange={handleMonthChange} value={props.value?.toString()}>
        <SelectTrigger className={props.className} style={props.style}>
          {currentMonth.toLocaleString("default", { month: "long" })}
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="overflow-auto" style={{ maxHeight: "400px" }}>
            {months.map(({ value, label }) => (
              <SelectItem key={`${id}_month_${value}`} value={value}>
                {label}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    );
  }

  if (props.name === "years") {
    return (
      <Select onValueChange={handleYearChange} value={props.value?.toString()}>
        <SelectTrigger className={props.className} style={props.style}>
          {currentMonth.getFullYear()}
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="overflow-auto" style={{ maxHeight: "400px" }}>
            {years.map(({ value, label }) => (
              <SelectItem key={`${id}_year_${value}`} value={value}>
                {label}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    );
  }

  return null;
}

export { Calendar };
