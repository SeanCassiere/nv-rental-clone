import { createFileRoute } from "@tanstack/react-router";

import { AgreementSearchQuerySchema } from "@/lib/schemas/agreement";
import {
  fetchAgreementsSearchColumnsOptions,
  fetchAgreementsSearchListOptions,
} from "@/lib/query/agreement";

import { getAuthFromRouterContext } from "@/lib/utils/auth";
import { STORAGE_DEFAULTS } from "@/lib/utils/constants";
import { normalizeAgreementListSearchParams } from "@/lib/utils/normalize-search-params";

import { sortObjectKeys } from "@/lib/utils";

export const Route = createFileRoute("/_auth/agreements/")({
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
  loader: async ({ context }) => {
    const { queryClient, searchColumnsOptions, searchListOptions } = context;

    const promises = [];

    // get columns
    promises.push(queryClient.ensureQueryData(searchColumnsOptions));

    // get list
    promises.push(queryClient.ensureQueryData(searchListOptions));

    await Promise.all(promises);
    return;
  },
});
