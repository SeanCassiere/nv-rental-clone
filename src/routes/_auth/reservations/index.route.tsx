import { createFileRoute } from "@tanstack/react-router";

import { ReservationSearchQuerySchema } from "@/lib/schemas/reservation";
import {
  fetchReservationsSearchColumnsOptions,
  fetchReservationsSearchListOptions,
} from "@/lib/query/reservation";

import { getAuthFromRouterContext } from "@/lib/utils/auth";
import { STORAGE_DEFAULTS } from "@/lib/utils/constants";
import { normalizeReservationListSearchParams } from "@/lib/utils/normalize-search-params";

export const Route = createFileRoute("/_auth/reservations/")({
  validateSearch: (search) => ReservationSearchQuerySchema.parse(search),
  preSearchFilters: [
    (search) => ({
      page: search?.page || 1,
      size: search?.size || parseInt(STORAGE_DEFAULTS.tableRowCount),
      ...(search.filters ? { filters: search.filters } : {}),
    }),
  ],
  beforeLoad: ({ context, search }) => {
    const auth = getAuthFromRouterContext(context);
    const parsedSearch = normalizeReservationListSearchParams(search);
    return {
      authParams: auth,
      searchColumnsOptions: fetchReservationsSearchColumnsOptions({ auth }),
      searchListOptions: fetchReservationsSearchListOptions({
        auth,
        pagination: {
          page: parsedSearch.pageNumber,
          pageSize: parsedSearch.size,
        },
        filters: { ...parsedSearch.searchFilters, clientDate: new Date() },
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
    const { queryClient, searchListOptions, searchColumnsOptions } = context;

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
