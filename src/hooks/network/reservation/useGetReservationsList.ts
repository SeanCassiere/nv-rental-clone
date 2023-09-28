import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { localDateToQueryYearMonthDay } from "@/utils/date";
import { reservationQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetReservationsList(params: {
  page: number;
  pageSize: number;
  filters: Omit<
    QueryParams,
    "clientId" | "userId" | "page" | "pageSize" | "clientDate"
  >;
  enabled?: boolean;
}) {
  const enabled = typeof params.enabled !== "undefined" ? params.enabled : true;
  const auth = useAuth();
  const query = useQuery({
    queryKey: reservationQKeys.search({
      pagination: { page: params.page, pageSize: params.pageSize },
      filters: params.filters,
    }),
    queryFn: () =>
      fetchReservationsListModded({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        page: params.page,
        pageSize: params.pageSize,
        clientDate: new Date(),
      }),
    enabled: enabled && auth.isAuthenticated,
    placeholderData: keepPreviousData,
  });
  return query;
}

type QueryParams = Omit<
  Parameters<(typeof apiClient)["reservation"]["getList"]>[0]["query"],
  "clientDate"
> & {
  clientDate: Date;
};

export async function fetchReservationsListModded(params: QueryParams) {
  const {
    clientId,
    userId,
    page = 1,
    pageSize = 10,
    clientDate,
    ...filters
  } = params;

  return await apiClient.reservation.getList({
    query: {
      clientId: clientId,
      userId: userId,
      page: page ?? 1,
      pageSize: pageSize ?? 10,
      clientDate: localDateToQueryYearMonthDay(clientDate),
      ...filters,
    },
  });
}
