import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { fetchReservationsListModded } from "@/hooks/network/reservation/useGetReservationsList";

import { ReservationSearchQuerySchema } from "@/schemas/reservation";

import { getAuthFromRouterContext, getAuthToken } from "@/utils/auth";
import { APP_DEFAULTS } from "@/utils/constants";
import { normalizeReservationListSearchParams } from "@/utils/normalize-search-params";
import { reservationQKeys } from "@/utils/query-key";
import { fetchReservationsSearchColumnsOptions } from "@/utils/query/reservation";

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
  beforeLoad: ({ context, search }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      searchColumnsOptions: fetchReservationsSearchColumnsOptions({ auth }),
      search: normalizeReservationListSearchParams(search),
    };
  },
  loaderDeps: ({ search }) => ({
    page: search.page,
    size: search.size,
    filters: search.filters,
  }),
  loader: async ({ context }) => {
    const { queryClient, search, searchColumnsOptions } = context;
    const auth = getAuthToken();

    const { pageNumber, size, searchFilters } = search;

    if (auth) {
      const promises = [];

      // get columns
      promises.push(queryClient.ensureQueryData(searchColumnsOptions));

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
    return;
  },
  component: lazyRouteComponent(() => import("@/pages/search-reservations")),
});
