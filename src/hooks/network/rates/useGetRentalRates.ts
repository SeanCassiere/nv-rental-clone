import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/utils/date";

import { apiClient } from "@/api";

type QueryParams = Omit<
  Parameters<(typeof apiClient)["rate"]["getList"]>[0]["query"],
  "CheckoutDate" | "CheckinDate"
> & {
  CheckoutDate?: Date;
  CheckinDate?: Date;
};

export function useGetRentalRates(opts?: {
  enabled?: boolean;
  filters: Omit<QueryParams, "userId" | "clientId">;
}) {
  const auth = useAuth();

  const { enabled: isEnabled, filters = {} } = opts ?? {};

  const enabled = typeof isEnabled !== "undefined" ? isEnabled : true;

  const { CheckoutDate, CheckinDate, ...otherFilters } = filters;

  const query = useQuery({
    queryKey: ["rates", filters],
    queryFn: () =>
      apiClient.rate.getList({
        query: {
          clientId: auth.user?.profile.navotar_clientid || "",
          userId: auth.user?.profile.navotar_userid || "",
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
          ...otherFilters,
        },
      }),
    enabled: enabled && auth.isAuthenticated,
  });

  return query;
}
