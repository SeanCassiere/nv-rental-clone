import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { fetchModuleColumnsModded } from "@/hooks/network/module/useGetModuleColumns";
import { fetchReservationsListModded } from "@/hooks/network/reservation/useGetReservationsList";

import { ReservationSearchQuerySchema } from "@/schemas/reservation";

import { getAuthToken } from "@/utils/authLocal";
import { APP_DEFAULTS } from "@/utils/constants";
import { normalizeReservationListSearchParams } from "@/utils/normalize-search-params";
import { reservationQKeys } from "@/utils/query-key";

import { reservationsRoute } from ".";

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
  loaderContext: ({ search }) => {
    return {
      search: normalizeReservationListSearchParams(search),
    };
  },
  loader: async ({ context: { queryClient, search } }) => {
    const auth = getAuthToken();

    const { pageNumber, size, searchFilters } = search;

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
              clientId: auth.profile.navotar_clientid,
              userId: auth.profile.navotar_userid,
              page: pageNumber,
              pageSize: size,
              clientDate: new Date(),
              ...searchFilters,
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
