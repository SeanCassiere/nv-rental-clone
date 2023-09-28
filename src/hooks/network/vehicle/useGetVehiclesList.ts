import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/utils/date";
import { fleetQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetVehiclesList(params: {
  page: number;
  pageSize: number;
  filters: Omit<QueryParams, "clientId" | "userId" | "page" | "pageSize">;
  enabled?: boolean;
}) {
  const enabled = typeof params.enabled !== "undefined" ? params.enabled : true;
  const auth = useAuth();
  const query = useQuery({
    queryKey: fleetQKeys.search({
      pagination: { page: params.page, pageSize: params.pageSize },
      filters: params.filters,
    }),
    queryFn: () =>
      fetchVehiclesListModded({
        page: params.page,
        pageSize: params.pageSize,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        ...params.filters,
      }),
    enabled: enabled && auth.isAuthenticated,
    placeholderData: (prev) => prev,
  });
  return query;
}

type QueryParams = Omit<
  Parameters<(typeof apiClient)["vehicle"]["getList"]>[0]["query"],
  "StartDate" | "EndDate"
> & {
  StartDate?: Date;
  EndDate?: Date;
};

export async function fetchVehiclesListModded(params: QueryParams) {
  const {
    clientId,
    userId,
    page = 1,
    pageSize = 10,
    StartDate,
    EndDate,
    ...filters
  } = params;
  return await apiClient.vehicle.getList({
    query: {
      clientId: clientId,
      userId: userId,
      page: page,
      pageSize: pageSize,
      ...(StartDate
        ? {
            StartDate:
              localDateTimeWithoutSecondsToQueryYearMonthDay(StartDate),
          }
        : {}),
      ...(EndDate
        ? { EndDate: localDateTimeWithoutSecondsToQueryYearMonthDay(EndDate) }
        : {}),
      ...filters,
    },
  });
}
