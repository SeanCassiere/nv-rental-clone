import { Route, lazyRouteComponent } from "@tanstack/router";

import { reservationsRoute } from ".";

import { fetchModuleColumnsModded } from "@/hooks/network/module/useGetModuleColumns";
import { fetchReservationsListModded } from "@/hooks/network/reservation/useGetReservationsList";

import { ReservationSearchQuerySchema } from "@/schemas/reservation";

import { getAuthToken } from "@/utils/authLocal";
import { normalizeReservationListSearchParams } from "@/utils/normalize-search-params";
import { reservationQKeys } from "@/utils/query-key";
import { APP_DEFAULTS } from "@/utils/constants";

export const searchReservationsRoute = new Route({
  getParentRoute: () => reservationsRoute,
  path: "/",
  validateSearch: (search) => ReservationSearchQuerySchema.parse(search),
  preSearchFilters: [
    (search) => ({
      page: search?.page || 1,
      size: search?.size || parseInt(APP_DEFAULTS.tableRowCount),
      ...(search.filters ? { filters: search.filters } : {}),
    }),
  ],
  loader: async ({ search, context: { queryClient } }) => {
    const auth = getAuthToken();

    const { pageNumber, size, searchFilters } =
      normalizeReservationListSearchParams(search);

    if (auth) {
      const promises = [];

      // get columns
      const columnsKey = reservationQKeys.columns();
      promises.push(
        queryClient.ensureQueryData({
          queryKey: columnsKey,
          queryFn: () =>
            fetchModuleColumnsModded({
              query: {
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                module: "reservation",
              },
            }),
        })
      );

      // get search
      const searchKey = reservationQKeys.search({
        pagination: { page: pageNumber, pageSize: size },
        filters: searchFilters,
      });
      promises.push(
        queryClient.ensureQueryData({
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

      await Promise.all(promises);
    }
    return {};
  },
}).update({
  component: lazyRouteComponent(() => import("@/pages/search-reservations")),
});
