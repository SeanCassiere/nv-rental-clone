// customized based on source: https://github.com/gpbl/react-day-picker/blob/HEAD/src/hooks/useInput/useInput.ts
import React, { useEffect, useState } from "react";
import {
  format as _format,
  differenceInCalendarDays,
  endOfMonth,
  getHours,
  getMinutes,
  isEqual,
  parse,
  setHours,
  setMinutes,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { enUS } from "date-fns/locale";
import type {
  DayClickEventHandler,
  DayPickerBase,
  DayPickerSingleProps,
  MonthChangeEventHandler,
} from "react-day-picker/dist";

function isValidDate(day: Date): boolean {
  return !isNaN(day.getTime());
}

function parseFromToProps(
  props: Pick<
    DayPickerBase,
    "fromYear" | "toYear" | "fromDate" | "toDate" | "fromMonth" | "toMonth"
  >
): { fromDate: Date | undefined; toDate: Date | undefined } {
  const { fromYear, toYear, fromMonth, toMonth } = props;
  let { fromDate, toDate } = props;

  if (fromMonth) {
    fromDate = startOfMonth(fromMonth);
  } else if (fromYear) {
    fromDate = new Date(fromYear, 0, 1);
  }
  if (toMonth) {
    toDate = endOfMonth(toMonth);
  } else if (toYear) {
    toDate = new Date(toYear, 11, 31);
  }

  return {
    fromDate: fromDate ? startOfDay(fromDate) : undefined,
    toDate: toDate ? startOfDay(toDate) : undefined,
  };
}

/** The props to attach to the input field when using {@link useDateInput}. */
export type InputHTMLAttributes = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  | "onBlur"
  | "onChange"
  | "onFocus"
  | "value"
  | "placeholder"
  | "disabled"
  | "readOnly"
>;

/** The props to attach to the DayPicker component when using {@link useDateInput}. */
export type InputDayPickerProps = Pick<
  DayPickerSingleProps,
  | "fromDate"
  | "toDate"
  | "locale"
  | "month"
  | "onDayClick"
  | "onMonthChange"
  | "selected"
  | "today"
>;

export interface UseDateInputOptions
  extends Pick<
    DayPickerBase,
    | "locale"
    | "fromDate"
    | "toDate"
    | "fromMonth"
    | "toMonth"
    | "fromYear"
    | "toYear"
    | "today"
  > {
  /** The initially selected date */
  defaultSelected?: Date;
  /**
   * The format string for formatting the input field. See
   * https://date-fns.org/docs/format for a list of format strings.
   *
   * @defaultValue PP
   */
  format?: string;
  /** Make the selection required. */
  required?: boolean;

  /** Callback function that is called when the user selects a valid day. */
  onValidChange?: (date: Date) => void;
  /**
   * Disable the input field and the calendar.
   *
   * @defaultValue false
   *  */
  disabled?: boolean;
  /**
   * Make the input field read-only.
   *
   * @defaultValue false
   *  */
  readOnly?: boolean;
}

/** Represent the value returned by {@link useDateInput}. */
export interface UseDateInputValue {
  /** The props to pass to a DayPicker component. */
  dayPickerProps: InputDayPickerProps;
  /** The props to pass to an input field. */
  inputProps: InputHTMLAttributes;
  /** A function to reset to the initial state. */
  reset: () => void;
  /** A function to set the selected day. */
  setSelected: (day: Date | undefined) => void;
}

/** Return props and setters for binding an input field to DayPicker. */
export function useDateInput(
  options: UseDateInputOptions = {}
): UseDateInputValue {
  const {
    locale = enUS,
    required,
    format = "PP",
    defaultSelected,
    today = new Date(),
    onValidChange = undefined,
    disabled = false,
    readOnly = false,
  } = options;
  const { fromDate, toDate } = parseFromToProps(options);

  // Shortcut to the DateFns functions
  const parseValue = (value: string) => parse(value, format, today, { locale });

  // Initialize states
  const [month, setMonth] = useState(defaultSelected ?? today);
  const [selectedDay, setSelectedDay] = useState(defaultSelected);
  const defaultInputValue = defaultSelected
    ? _format(defaultSelected, format, { locale })
    : "";
  const [inputValue, setInputValue] = useState(defaultInputValue);

  const reset = () => {
    setSelectedDay(defaultSelected);
    setMonth(defaultSelected ?? today);
    setInputValue(defaultInputValue ?? "");
  };

  const setSelected = (date: Date | undefined) => {
    setSelectedDay(date);
    setMonth(date ?? today);
    setInputValue(date ? _format(date, format, { locale }) : "");
  };

  const handleDayClick: DayClickEventHandler = (day, { selected }) => {
    if (!required && selected) {
      setSelectedDay(undefined);
      setInputValue("");
      return;
    }
    const hours = getHours(defaultSelected ?? today);
    const minutes = getMinutes(defaultSelected ?? today);
    const dateWithHoursAndMinutes = setMinutes(setHours(day, hours), minutes);

    setSelectedDay(dateWithHoursAndMinutes);
    onValidChange?.(dateWithHoursAndMinutes);
    setInputValue(
      dateWithHoursAndMinutes
        ? _format(dateWithHoursAndMinutes, format, { locale })
        : ""
    );
  };

  const handleMonthChange: MonthChangeEventHandler = (month) => {
    setMonth(month);
  };

  // When changing the input field, save its value in state and check if the
  // string is a valid date. If it is a valid day, set it as selected and update
  // the calendar’s month.
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
    const day = parseValue(e.target.value);
    const isBefore = fromDate && differenceInCalendarDays(fromDate, day) > 0;
    const isAfter = toDate && differenceInCalendarDays(day, toDate) > 0;
    if (!isValidDate(day) || isBefore || isAfter) {
      setSelectedDay(undefined);
      return;
    }
    setSelectedDay(day);
    onValidChange?.(day);
    setMonth(day);
  };

  // Special case for _required_ fields: on blur, if the value of the input is not
  // a valid date, reset the calendar and the input value.
  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    const day = parseValue(e.target.value);
    if (!isValidDate(day)) {
      reset();
    }
  };

  // When focusing, make sure DayPicker visualizes the month of the date in the
  // input field.
  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.value) {
      reset();
      return;
    }
    const day = parseValue(e.target.value);
    if (isValidDate(day)) {
      setMonth(day);
    }
  };

  const dayPickerProps: InputDayPickerProps = {
    month: month,
    onDayClick: handleDayClick,
    onMonthChange: handleMonthChange,
    selected: selectedDay,
    locale,
    fromDate,
    toDate,
    today,
  };

  const inputProps: InputHTMLAttributes = {
    onBlur: handleBlur,
    onChange: handleChange,
    onFocus: handleFocus,
    value:
      (disabled || readOnly) && defaultSelected
        ? _format(defaultSelected, format, { locale })
        : inputValue,
    placeholder: defaultSelected
      ? _format(defaultSelected, format, { locale })
      : undefined,
    disabled,
    readOnly,
  };

  useEffect(() => {
    if (
      selectedDay &&
      defaultSelected &&
      !isEqual(selectedDay, defaultSelected)
    ) {
      setSelectedDay(defaultSelected);
      setInputValue(
        defaultSelected ? _format(defaultSelected, format, { locale }) : ""
      );
      setMonth(defaultSelected);
    }
  }, [defaultSelected, format, locale, selectedDay]);

  return { dayPickerProps, inputProps, reset, setSelected };
}
