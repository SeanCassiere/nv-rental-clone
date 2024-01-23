import { FileRoute } from "@tanstack/react-router";

import { CustomerSearchQuerySchema } from "@/schemas/customer";

import { getAuthFromRouterContext } from "@/utils/auth";
import { STORAGE_DEFAULTS } from "@/utils/constants";
import { normalizeCustomerListSearchParams } from "@/utils/normalize-search-params";
import {
  fetchCustomersSearchColumnsOptions,
  fetchCustomersSearchListOptions,
} from "@/utils/query/customer";

export const Route = new FileRoute("/_auth/customers").createRoute({
  validateSearch: (search) => CustomerSearchQuerySchema.parse(search),
  preSearchFilters: [
    (search) => ({
      page: search?.page || 1,
      size: search?.size || parseInt(STORAGE_DEFAULTS.tableRowCount),
      ...(search.filters ? { filters: search.filters } : {}),
    }),
  ],
  beforeLoad: ({ context, search }) => {
    const auth = getAuthFromRouterContext(context);
    const parsedSearch = normalizeCustomerListSearchParams(search);
    return {
      authParams: auth,
      searchColumnsOptions: fetchCustomersSearchColumnsOptions({ auth }),
      searchListOptions: fetchCustomersSearchListOptions({
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
});
