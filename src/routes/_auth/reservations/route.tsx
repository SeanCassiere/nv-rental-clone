import { FileRoute } from "@tanstack/react-router";

import { ReservationSearchQuerySchema } from "@/schemas/reservation";

import { getAuthFromRouterContext } from "@/utils/auth";
import { STORAGE_DEFAULTS } from "@/utils/constants";
import { normalizeReservationListSearchParams } from "@/utils/normalize-search-params";
import {
  fetchReservationsSearchColumnsOptions,
  fetchReservationsSearchListOptions,
} from "@/utils/query/reservation";

export const Route = new FileRoute("/_auth/reservations").createRoute({
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
});