import { format } from "date-fns/format";

/**
 *
 * @param {Date} date
 * @returns "yyyy-MM-dd"
 */
export function localDateToQueryYearMonthDay(date: Date) {
  return format(date, "yyyy-MM-dd");
}

/**
 *
 * @param {Date} date
 * @returns "yyyy-MM-dd" + "T" + "HH:mm:ss"
 */
export function localDateTimeToQueryYearMonthDay(date: Date) {
  const dateMaker = "yyyy-MM-dd";
  const timeMaker = "HH:mm:ss";
  const print = `${format(date, dateMaker)}T${format(date, timeMaker)}`;
  return print;
}

/**
 *
 * @param {Date} date
 * @returns "yyyy-MM-dd" + "T" + "HH:mm"
 */
export function localDateTimeWithoutSecondsToQueryYearMonthDay(
  date: Date | string
) {
  const dateToUse = typeof date === "string" ? new Date(date) : date;
  const dateMaker = "yyyy-MM-dd";
  const timeMaker = "HH:mm";
  const print = `${format(dateToUse, dateMaker)}T${format(
    dateToUse,
    timeMaker
  )}`;
  return print;
}
