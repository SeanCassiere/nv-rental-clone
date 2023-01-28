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
import { dfnsDateFormat, getDateFnsLocale } from "../../i18n.config";
import {
  getLocalStorageForUser,
  userLocalStorageKeys,
} from "../../utils/user-local-storage";

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
  const auth = useAuth();

  const clientId = auth.user?.profile.navotar_clientid;
  const userId = auth.user?.profile.navotar_userid;

  const fromStorage =
    clientId && userId
      ? getLocalStorageForUser(
          clientId,
          userId,
          userLocalStorageKeys.dateFormat
        )
      : null;

  const dateFormat = fromStorage ? fromStorage : dfnsDateFormat;

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
