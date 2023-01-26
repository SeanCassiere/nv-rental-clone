import ReactDatePicker, {
  type ReactDatePickerProps,
  CalendarContainer,
} from "react-datepicker";

import { TextInput } from "./index";
import {
  CalendarOutline,
  ChevronLeftOutline,
  ChevronRightOutline,
} from "../icons";
import { dateFormat, getDateFnsLocale } from "../../i18n.config";
import { useTranslation } from "react-i18next";

type TSelectedReactDatePickerProps = Omit<
  ReactDatePickerProps,
  | "customInput"
  | "className"
  | "calendarContainer"
  | "nextMonthButtonLabel"
  | "previousMonthButtonLabel"
  | "dateFormat"
>;

export interface DatePickerProps extends TSelectedReactDatePickerProps {
  placeholderText: string;
  label?: string;
}

export const DatePicker = (props: DatePickerProps) => {
  const { ...pickerProps } = props;
  const { i18n } = useTranslation();

  return (
    <div className="app-day-picker">
      <ReactDatePicker
        {...pickerProps}
        customInput={
          <TextInput
            label={props?.label || props.placeholderText}
            endIcon={<CalendarOutline className="h-4 w-4 text-gray-400" />}
            autoComplete="off"
          />
        }
        calendarContainer={CalendarContainer}
        previousMonthButtonLabel={<ChevronLeftOutline className="h-4 w-4" />}
        nextMonthButtonLabel={<ChevronRightOutline className="h-4 w-4" />}
        dateFormat={dateFormat}
        popperPlacement="bottom-start"
        autoComplete="off"
        locale={getDateFnsLocale(i18n.language)}
      />
    </div>
  );
};
