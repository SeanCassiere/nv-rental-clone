import { lazy, Route } from "@tanstack/react-router";

import { reservationsRoute } from ".";
import { queryClient } from "../../App";
import { makeInitialApiData } from "../../api/fetcher";
import { fetchModuleColumnsModded } from "../../hooks/network/module/useGetModuleColumns";
import { fetchReservationsListModded } from "../../hooks/network/reservation/useGetReservationsList";

import { getAuthToken } from "../../utils/authLocal";
import { normalizeReservationListSearchParams } from "../../utils/normalize-search-params";
import { reservationQKeys } from "../../utils/query-key";
import { ReservationSearchQuerySchema } from "../../utils/schemas/reservation";

export const searchReservationsRoute = new Route({
  getParentRoute: () => reservationsRoute,
  path: "/",
  component: lazy(
    () => import("../../pages/ReservationsSearch/ReservationsSearchPage")
  ),
  validateSearch: (search) => ReservationSearchQuerySchema.parse(search),
  preSearchFilters: [
    ({ filters, ...search }) => ({
      page: search.page || 1,
      size: search.size || 10,
    }),
  ],
  onLoad: async ({ search }) => {
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
            initialData: makeInitialApiData([]),
          })
        );
      }
      await Promise.all(promises);
    }
    return {};
  },
});
