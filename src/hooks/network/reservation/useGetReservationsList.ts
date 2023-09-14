import { useQuery } from "@tanstack/react-query";
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
}) {
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
    enabled: auth.isAuthenticated,
    keepPreviousData: true,
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

  // return await fetchReservationsList({
  //   clientId: params.clientId || "",
  //   userId: params.userId || "",
  //   accessToken: params.accessToken || "",
  //   page: params.page,
  //   pageSize: params.pageSize,
  //   clientDate: params.clientDate,
  //   filters: params.filters,
  // })
  //   .then((res) => {
  //     if (res.ok) return res;
  //     return { ...res, data: [] };
  //   })
  //   .then((res) =>
  //     validateApiResWithZodSchema(ReservationListItemListSchema, res)
  //   )
  //   .catch((e) => {
  //     console.error(e);
  //     throw e;
  //   });
}
