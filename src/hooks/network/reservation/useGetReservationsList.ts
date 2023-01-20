import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchReservationsList } from "../../../api/reservation";
import { makeInitialApiData, type ResponseParsed } from "../../../api/fetcher";
import {
  ReservationListItemListSchema,
  type TReservationListItemParsed,
} from "../../../utils/schemas/reservation";

export function useGetReservationsList(params: {
  page: number;
  pageSize: number;
  filters: any;
}) {
  const auth = useAuth();
  const query = useQuery<ResponseParsed<TReservationListItemParsed[]>>({
    queryKey: [
      "reservations",
      { page: params.page, pageSize: params.pageSize },
      params.filters,
    ],
    queryFn: () =>
      fetchReservationsList({
        page: params.page,
        pageSize: params.pageSize,
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        filters: params.filters,
        clientDate: new Date(),
      }).then((dataObj) => {
        const parsed = ReservationListItemListSchema.parse(dataObj.data);

        return { ...dataObj, data: parsed };
      }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialApiData([] as any[]),
  });
  return query;
}
