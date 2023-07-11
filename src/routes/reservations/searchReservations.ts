import { lazy, Route } from "@tanstack/router";

import { reservationsRoute } from ".";
import { queryClient } from "../../App";

import { fetchModuleColumnsModded } from "../../hooks/network/module/useGetModuleColumns";
import { fetchReservationsListModded } from "../../hooks/network/reservation/useGetReservationsList";

import { getAuthToken } from "../../utils/authLocal";
import { normalizeReservationListSearchParams } from "../../utils/normalize-search-params";
import { reservationQKeys } from "../../utils/query-key";
import { ReservationSearchQuerySchema } from "../../utils/schemas/reservation";

export const searchReservationsRoute = new Route({
  getParentRoute: () => reservationsRoute,
  path: "/",
  validateSearch: ReservationSearchQuerySchema,
  preSearchFilters: [
    () => ({
      page: 1,
      size: 10,
    }),
  ],
  loader: async ({ search }) => {
    const auth = getAuthToken();

    const { pageNumber, size, searchFilters } =
      normalizeReservationListSearchParams(search);

    if (auth) {
      const promises = [];

      // get columns
      const columnsKey = reservationQKeys.columns();
      if (!queryClient.getQueryData(columnsKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: columnsKey,
            queryFn: () =>
              fetchModuleColumnsModded({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                module: "reservations",
              }),
            initialData: [],
          })
        );
      }

      // get search
      const searchKey = reservationQKeys.search({
        pagination: { page: pageNumber, pageSize: size },
        filters: searchFilters,
      });
      if (!queryClient.getQueryData(searchKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: searchKey,
            queryFn: () =>
              fetchReservationsListModded({
                page: pageNumber,
                pageSize: size,
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                filters: searchFilters,
                clientDate: new Date(),
              }),
          })
        );
      }
      await Promise.all(promises);
    }
    return {};
  },
  component: lazy(() => import("../../pages/ReservationsSearch/ReservationsSearchPage")),
});
