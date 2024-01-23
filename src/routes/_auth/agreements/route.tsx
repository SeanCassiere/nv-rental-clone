import { FileRoute } from "@tanstack/react-router";

import { AgreementSearchQuerySchema } from "@/schemas/agreement";

import { getAuthFromRouterContext } from "@/utils/auth";
import { STORAGE_DEFAULTS } from "@/utils/constants";
import { normalizeAgreementListSearchParams } from "@/utils/normalize-search-params";
import {
  fetchAgreementsSearchColumnsOptions,
  fetchAgreementsSearchListOptions,
} from "@/utils/query/agreement";
import { sortObjectKeys } from "@/utils/sort";

export const Route = new FileRoute("/_auth/agreements").createRoute({
  validateSearch: AgreementSearchQuerySchema.parse,
  preSearchFilters: [
    (search) => ({
      page: search?.page || 1,
      size: search?.size || parseInt(STORAGE_DEFAULTS.tableRowCount),
      ...(search.filters ? { filters: search.filters } : {}),
    }),
  ],
  beforeLoad: ({ context, search }) => {
    const auth = getAuthFromRouterContext(context);
    const parsedSearch = normalizeAgreementListSearchParams(search);

    return {
      authParams: auth,
      searchColumnsOptions: fetchAgreementsSearchColumnsOptions({
        auth,
      }),
      searchListOptions: fetchAgreementsSearchListOptions({
        auth,
        pagination: {
          page: parsedSearch.pageNumber,
          pageSize: parsedSearch.size,
        },
        filters: {
          ...parsedSearch.searchFilters,
          currentDate: new Date(),
        },
      }),
      search: parsedSearch,
    };
  },
  loaderDeps: ({ search }) => ({
    page: search.page,
    size: search.size,
    filters: sortObjectKeys(search.filters),
  }),
});