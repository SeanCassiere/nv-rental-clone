import { format } from "date-fns";

export function localDateToQueryYearMonthDay(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function localDateTimeToQueryYearMonthDay(date: Date) {
  const dateMaker = "yyyy-MM-dd";
  const timeMaker = "HH:mm:ss";
  const print = `${format(date, dateMaker)}T${format(date, timeMaker)}`;
  return print;
}
