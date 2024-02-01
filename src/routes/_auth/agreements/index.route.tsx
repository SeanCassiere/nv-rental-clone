import { createFileRoute } from "@tanstack/react-router";

import { AgreementSearchQuerySchema } from "@/schemas/agreement";

import { getAuthFromRouterContext } from "@/utils/auth";
import { STORAGE_DEFAULTS } from "@/utils/constants";
import { normalizeAgreementListSearchParams } from "@/utils/normalize-search-params";
import {
  fetchAgreementByIdOptions,
  fetchAgreementsSearchColumnsOptions,
  fetchAgreementsSearchListOptions,
} from "@/utils/query/agreement";
import { sortObjectKeys } from "@/utils/sort";

export const Route = createFileRoute("/_auth/agreements/")({
  validateSearch: AgreementSearchQuerySchema.parse,
  preSearchFilters: [
    (search) => ({
      agreement_id: search?.agreement_id,
      page: search?.page || 1,
      size: search?.size || parseInt(STORAGE_DEFAULTS.tableRowCount),
      ...(search.filters ? { filters: search.filters } : {}),
    }),
  ],
  beforeLoad: ({ context, search }) => {
    const auth = getAuthFromRouterContext(context);
    const parsedSearch = normalizeAgreementListSearchParams(search);

    const previewViewAgreementByIdOptions = search?.agreement_id
      ? fetchAgreementByIdOptions({ auth, agreementId: search?.agreement_id })
      : null;

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
      previewAgreementIdOptions: previewViewAgreementByIdOptions,
    };
  },
  loaderDeps: ({ search }) => ({
    page: search.page,
    size: search.size,
    filters: sortObjectKeys(search.filters),
    agreement_id: search?.agreement_id ?? "",
  }),
  loader: async ({ context }) => {
    const {
      queryClient,
      searchColumnsOptions,
      searchListOptions,
      previewAgreementIdOptions,
    } = context;

    const promises = [];

    // get columns
    promises.push(queryClient.ensureQueryData(searchColumnsOptions));

    // get list
    promises.push(queryClient.ensureQueryData(searchListOptions));

    // get preview agreement
    if (previewAgreementIdOptions) {
      promises.push(queryClient.ensureQueryData(previewAgreementIdOptions));
    }

    await Promise.all(promises);
    return;
  },
});
