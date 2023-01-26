import ReactDatePicker, {
  type ReactDatePickerProps,
  CalendarContainer,
} from "react-datepicker";

import { TextInput } from "./index";
import {
  CalendarSolid,
  ChevronLeftOutline,
  ChevronRightOutline,
} from "../icons";

type TSelectedReactDatePickerProps = Omit<
  ReactDatePickerProps,
  | "customInput"
  | "className"
  | "calendarContainer"
  | "nextMonthButtonLabel"
  | "previousMonthButtonLabel"
  | "dateFormat"
>;

interface DatePickerProps extends TSelectedReactDatePickerProps {
  placeholderText: string;
  label?: string;
}

export const DatePicker = (props: DatePickerProps) => {
  const { ...pickerProps } = props;

  return (
    <div className="app-day-picker">
      <ReactDatePicker
        {...pickerProps}
        customInput={
          <TextInput
            label={props?.label || props.placeholderText}
            endIcon={<CalendarSolid className="h-4 w-4" />}
          />
        }
        calendarContainer={CalendarContainer}
        previousMonthButtonLabel={<ChevronLeftOutline className="h-4 w-4" />}
        nextMonthButtonLabel={<ChevronRightOutline className="h-4 w-4" />}
        dateFormat="dd/MM/yyyy"
        popperPlacement="bottom-start"
      />
    </div>
  );
};
