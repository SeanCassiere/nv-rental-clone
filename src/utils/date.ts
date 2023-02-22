import format from "date-fns/format";

export function localDateToQueryYearMonthDay(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function localDateTimeToQueryYearMonthDay(date: Date) {
  const dateMaker = "yyyy-MM-dd";
  const timeMaker = "HH:mm:ss";
  const print = `${format(date, dateMaker)}T${format(date, timeMaker)}`;
  return print;
}

export function localDateTimeWithoutSecondsToQueryYearMonthDay(date: Date) {
  const dateMaker = "yyyy-MM-dd";
  const timeMaker = "HH:mm";
  const print = `${format(date, dateMaker)}T${format(date, timeMaker)}`;
  return print;
}
