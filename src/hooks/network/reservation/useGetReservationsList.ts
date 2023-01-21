import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchReservationsList } from "../../../api/reservation";
import { makeInitialApiData } from "../../../api/fetcher";
import { ReservationListItemListSchema } from "../../../utils/schemas/reservation";
import { validateApiResWithZodSchema } from "../../../utils/schemas/apiFetcher";
import { reservationQKeys } from "../../../utils/query-key";

export function useGetReservationsList(params: {
  page: number;
  pageSize: number;
  filters: any;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: reservationQKeys.search({
      pagination: { page: params.page, pageSize: params.pageSize },
      filters: params.filters,
    }),
    queryFn: () =>
      fetchReservationsListModded({
        page: params.page,
        pageSize: params.pageSize,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        filters: params.filters,
        clientDate: new Date(),
      }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialApiData([] as any[]),
  });
  return query;
}

export async function fetchReservationsListModded(
  params: Parameters<typeof fetchReservationsList>[0]
) {
  return await fetchReservationsList({
    clientId: params.clientId || "",
    userId: params.userId || "",
    accessToken: params.accessToken || "",
    page: params.page,
    pageSize: params.pageSize,
    clientDate: params.clientDate,
    filters: params.filters,
  })
    .then((res) => {
      if (res.ok) return res;
      return { ...res, data: [] };
    })
    .then((res) =>
      validateApiResWithZodSchema(ReservationListItemListSchema, res)
    )
    .catch((e) => {
      console.error(e);
      throw e;
    });
}
