import { queryOptions } from "@tanstack/react-query";

import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/utils/date";
import { sortObjectKeys } from "@/utils/sort";

import { apiClient } from "@/api";

import { isEnabled, makeQueryKey, type Auth } from "./helpers";

const SEGMENT = "rates";

/**
 *
 * @api `/rates`
 */
export function fetchRatesListOptions(
  options: {
    filters: Omit<
      Parameters<(typeof apiClient)["rate"]["getList"]>[0]["query"],
      "clientId" | "userId" | "CheckoutDate" | "CheckinDate"
    > & {
      CheckoutDate?: Date;
      CheckinDate?: Date;
    };
    enabled?: boolean;
  } & Auth
) {
  const { enabled = true } = options;
  const { CheckoutDate, CheckinDate, ...otherFilers } = options.filters;

  const filters = {
    ...otherFilers,
    ...(CheckoutDate
      ? {
          CheckoutDate:
            localDateTimeWithoutSecondsToQueryYearMonthDay(CheckoutDate),
        }
      : {}),
    ...(CheckinDate
      ? {
          CheckinDate:
            localDateTimeWithoutSecondsToQueryYearMonthDay(CheckinDate),
        }
      : {}),
  };

  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "list", sortObjectKeys(filters)]),
    queryFn: () =>
      apiClient.rate.getList({
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
          ...filters,
        },
      }),
    enabled: isEnabled(options) && enabled,
  });
}

/**
 *
 * @api `/rates/ratesname/optimal`
 */
export function fetchRatesOptimalNameOptions(
  options: {
    filters: Omit<
      Parameters<(typeof apiClient)["rate"]["getOptimal"]>[0]["query"],
      "clientId" | "userId" | "CheckoutDate" | "CheckinDate"
    > & { CheckoutDate: Date; CheckinDate: Date };
    enabled?: boolean;
  } & Auth
) {
  const { enabled = true } = options;

  const filters = {
    ...options.filters,
    CheckoutDate: localDateTimeWithoutSecondsToQueryYearMonthDay(
      options.filters.CheckoutDate
    ),
    CheckinDate: localDateTimeWithoutSecondsToQueryYearMonthDay(
      options.filters.CheckinDate
    ),
  };

  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      "optimal",
      sortObjectKeys(filters),
    ]),
    queryFn: () =>
      apiClient.rate.getOptimal({
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
          ...filters,
        },
      }),
    enabled: isEnabled(options) && enabled,
  });
}
