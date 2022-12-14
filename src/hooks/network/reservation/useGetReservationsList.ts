import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchReservationsList } from "../../../api/reservation";
import { makeInitialApiData, type ResponseParsed } from "../../../api/fetcher";
import type { ReservationListItemType } from "../../../types/Reservation";

export function useGetReservationsList(params: {
  page: number;
  pageSize: number;
  filters: any;
}) {
  const auth = useAuth();
  const query = useQuery<ResponseParsed<ReservationListItemType[]>>({
    queryKey: [
      "reservations",
      JSON.stringify({ page: params.page, pageSize: params.pageSize }),
      JSON.stringify(params.filters),
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
        const updated = dataObj.data.map((reservation: any) => ({
          ...reservation,
          id: `${reservation?.ReserveId}`,
          FullName: reservation?.FirstName + " " + reservation?.LastName, // done for columns accessors
        }));

        return { ...dataObj, data: updated };
      }),
    enabled: auth.isAuthenticated,
    initialData: makeInitialApiData([] as any[]),
  });
  return query;
}
