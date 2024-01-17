import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { fetchVehiclesListModded } from "@/hooks/network/vehicle/useGetVehiclesList";

import { VehicleSearchQuerySchema } from "@/schemas/vehicle";

import { getAuthFromRouterContext, getAuthToken } from "@/utils/auth";
import { APP_DEFAULTS } from "@/utils/constants";
import { normalizeVehicleListSearchParams } from "@/utils/normalize-search-params";
import { fleetQKeys } from "@/utils/query-key";
import { fetchFleetSearchColumnsOptions } from "@/utils/query/fleet";

import { fleetRoute } from ".";

export const searchFleetRoute = new Route({
  getParentRoute: () => fleetRoute,
  path: "/",
  validateSearch: (search) => VehicleSearchQuerySchema.parse(search),
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
      searchColumnsOptions: fetchFleetSearchColumnsOptions({ auth }),
      search: normalizeVehicleListSearchParams(search),
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
      const searchKey = fleetQKeys.search({
        pagination: { page: pageNumber, pageSize: size },
        filters: searchFilters,
      });
      promises.push(
        queryClient.ensureQueryData({
          queryKey: searchKey,
          queryFn: () =>
            fetchVehiclesListModded({
              page: pageNumber,
              pageSize: size,
              clientId: auth.profile.navotar_clientid,
              userId: auth.profile.navotar_userid,
              ...searchFilters,
            }),
        })
      );

      await Promise.all(promises);
    }
    return;
  },
  component: lazyRouteComponent(() => import("@/pages/search-fleet")),
});
