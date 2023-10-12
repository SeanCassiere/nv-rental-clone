import addDays from "date-fns/addDays";
import addMonths from "date-fns/addMonths";
import addYears from "date-fns/addYears";
import endOfMonth from "date-fns/endOfMonth";
import endOfYear from "date-fns/endOfYear";
import format from "date-fns/format";
import startOfMonth from "date-fns/startOfMonth";
import startOfYear from "date-fns/startOfYear";
import subDays from "date-fns/subDays";
import subMonths from "date-fns/subMonths";
import subWeeks from "date-fns/subWeeks";
import subYears from "date-fns/subYears";
import { z } from "zod";

import type { TReportDetail } from "@/schemas/report";

const stringBoolean = (value: unknown) =>
  z.enum(["0", "1"]).catch("0").parse(value);

/**
 * @param date
 * @returns "yyyy-MM-dd"
 */
export const dateFormat = (date: Date) => format(date, "yyyy-MM-dd");

export function makeInitialSearchCriteria(
  list: TReportDetail["searchCriteria"]
) {
  return list.reduce(
    (acc, criteria) => {
      switch (criteria.fieldType) {
        case "Date":
          acc[criteria.name] = getInitialDateValue(criteria);
          break;
        case "CheckBox":
          acc[criteria.name] = stringBoolean(criteria?.defaultValue);
        default:
          acc[criteria.name] = criteria.defaultValue ?? "";
      }

      return acc;
    },
    {} as Record<string, string>
  );
}

function getInitialDateValue(
  criteria: TReportDetail["searchCriteria"][number]
) {
  if (criteria.fieldType !== "Date") {
    throw new Error("Invalid field type passed to getInitialDateValue");
  }

  let value = "";

  const today = new Date();

  switch (criteria.defaultValue) {
    case "YearBefore":
    case "LastYearThisMonth": // last year, same month
      value = dateFormat(subYears(today, 1));
      break;
    case "LastDateYear": // this year, last date
      value = dateFormat(endOfYear(today));
      break;
    case "LastYearFirstMonth": // last year, first month
      value = dateFormat(startOfYear(subYears(today, 1)));
      break;
    case "ThisYearFirstMonth": // this year, first month
      value = dateFormat(startOfYear(today));
      break;
    case "ThisMonth": // this year, start of this month
      value = dateFormat(startOfMonth(today));
      break;
    case "LastDateMonth": // this year, end of this month
      value = dateFormat(endOfMonth(today));
      break;
    case "MonthBefore": // this year, last month
      value = dateFormat(startOfMonth(subMonths(today, 1)));
      break;
    case "NextMonth": // this year, next month
      value = dateFormat(addMonths(today, 1));
      break;
    case "NextYearFirstMonth": // next year, first month
      value = dateFormat(startOfYear(addYears(today, 1)));
      break;
    case "WeekBefore": // this year, last week
      value = dateFormat(subWeeks(today, 1));
      break;
    case "DayBefore": // this year, yesterday
      value = dateFormat(subDays(today, 1));
      break;
    case "NextDay": // this year, tomorrow
      value = dateFormat(addDays(today, 1));
      break;
    default:
      value = criteria?.defaultValue ?? "";
      break;
  }

  return value;
}
