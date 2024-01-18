import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { VehicleSearchQuerySchema } from "@/schemas/vehicle";

import { getAuthFromRouterContext } from "@/utils/auth";
import { APP_DEFAULTS } from "@/utils/constants";
import { normalizeVehicleListSearchParams } from "@/utils/normalize-search-params";
import {
  fetchVehiclesSearchColumnsOptions,
  fetchVehiclesSearchListOptions,
} from "@/utils/query/vehicle";

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
    const parsedSearch = normalizeVehicleListSearchParams(search);
    return {
      authParams: auth,
      searchColumnsOptions: fetchVehiclesSearchColumnsOptions({ auth }),
      searchListOptions: fetchVehiclesSearchListOptions({
        auth,
        pagination: {
          page: parsedSearch.pageNumber,
          pageSize: parsedSearch.size,
        },
        filters: parsedSearch.searchFilters,
      }),
      search: parsedSearch,
    };
  },
  loaderDeps: ({ search }) => ({
    page: search.page,
    size: search.size,
    filters: search.filters,
  }),
  loader: async ({ context }) => {
    const { queryClient, searchColumnsOptions, searchListOptions } = context;

    const promises = [];

    // get columns
    promises.push(queryClient.ensureQueryData(searchColumnsOptions));

    // get search
    promises.push(queryClient.ensureQueryData(searchListOptions));

    await Promise.all(promises);

    return;
  },
  component: lazyRouteComponent(() => import("@/pages/search-vehicles")),
});
