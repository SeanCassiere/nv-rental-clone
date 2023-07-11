import { forwardRef } from "react";
import ReactDatePicker, {
  type ReactDatePickerProps,
  CalendarContainer,
} from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

import { TextInput } from "./index";
import {
  CalendarOutline,
  ChevronLeftOutline,
  ChevronRightOutline,
} from "../icons";
import {
  dfnsDateFormat,
  dfnsTimeFormat,
  getDateFnsLocale,
} from "../../i18n.config";
import { getLocalStorageForUser } from "../../utils/user-local-storage";
import { USER_STORAGE_KEYS } from "../../utils/constants";

type TSelectedReactDatePickerProps = Omit<
  ReactDatePickerProps,
  | "customInput"
  | "className"
  | "calendarContainer"
  | "nextMonthButtonLabel"
  | "previousMonthButtonLabel"
  | "dateFormat"
  | "dropdownMode"
>;

export interface DateTimePickerProps extends TSelectedReactDatePickerProps {
  placeholderText: string;
  label?: string;
  inputProps?: Omit<Parameters<typeof TextInput>[0], "label" | "placeholder">;
}

export const DateTimePicker = forwardRef<any, DateTimePickerProps>(
  (props, ref) => {
    const { inputProps, ...pickerProps } = props;
    const { i18n } = useTranslation();
    const auth = useAuth();

    const clientId = auth.user?.profile.navotar_clientid;
    const userId = auth.user?.profile.navotar_userid;

    const fromStorageDate =
      clientId && userId
        ? getLocalStorageForUser(clientId, userId, USER_STORAGE_KEYS.dateFormat)
        : null;
    const fromStorageTime =
      clientId && userId
        ? getLocalStorageForUser(clientId, userId, USER_STORAGE_KEYS.timeFormat)
        : null;

    const defaultDateTimeFormat = `${dfnsDateFormat} ${dfnsTimeFormat}`;
    const parsedUserDateTimeFormat = `${fromStorageDate} ${fromStorageTime}`;

    const dateFormat =
      fromStorageDate && fromStorageTime
        ? parsedUserDateTimeFormat
        : defaultDateTimeFormat;
    const timeFormat = fromStorageTime ? fromStorageTime : dfnsTimeFormat;

    return (
      <div className="app-datetime-picker">
        <ReactDatePicker
          {...pickerProps}
          customInput={
            <TextInput
              label={props?.label || props.placeholderText}
              endIcon={<CalendarOutline className="h-4 w-4 text-gray-400" />}
              autoComplete="off"
              {...inputProps}
            />
          }
          calendarContainer={CalendarContainer}
          previousMonthButtonLabel={<ChevronLeftOutline className="h-4 w-4" />}
          nextMonthButtonLabel={<ChevronRightOutline className="h-4 w-4" />}
          dateFormat={dateFormat}
          popperPlacement="bottom-start"
          autoComplete="off"
          locale={getDateFnsLocale(i18n.language)}
          timeFormat={timeFormat}
          showTimeInput
          customTimeInput={<CustomTimeInput />}
          dropdownMode="select"
          ref={ref}
        />
      </div>
    );
  },
);

const CustomTimeInput = (props: {
  onChange?: any;
  date?: any;
  value?: string;
}) => {
  const { onChange, value, ...others } = props;
  return (
    <input
      type="time"
      value={value}
      onChange={(evt) => {
        onChange?.(evt.target.value);
      }}
      className="border-gray-20 w-full rounded border border-gray-300 py-1.5 text-gray-700 focus:border-teal-500 focus:outline-none focus:ring-teal-500"
      autoComplete="off"
      {...others}
    />
  );
};
