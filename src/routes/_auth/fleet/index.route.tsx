import { createFileRoute } from "@tanstack/react-router";

import { VehicleSearchQuerySchema } from "@/lib/schemas/vehicle";
import {
  fetchVehiclesSearchColumnsOptions,
  fetchVehiclesSearchListOptions,
} from "@/lib/query/vehicle";

import { getAuthFromRouterContext } from "@/lib/utils/auth";
import { STORAGE_DEFAULTS } from "@/lib/utils/constants";
import { normalizeVehicleListSearchParams } from "@/lib/utils/normalize-search-params";

export const Route = createFileRoute("/_auth/fleet/")({
  validateSearch: (search) => VehicleSearchQuerySchema.parse(search),
  preSearchFilters: [
    (search) => ({
      page: search?.page || 1,
      size: search?.size || parseInt(STORAGE_DEFAULTS.tableRowCount),
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

    if (!context.auth.isAuthenticated) return;

    const promises = [];

    // get columns
    promises.push(queryClient.ensureQueryData(searchColumnsOptions));

    // get search
    promises.push(queryClient.ensureQueryData(searchListOptions));

    await Promise.all(promises);

    return;
  },
});
