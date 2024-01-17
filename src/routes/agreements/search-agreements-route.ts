import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { AgreementSearchQuerySchema } from "@/schemas/agreement";

import { getAuthFromRouterContext, getAuthToken } from "@/utils/auth";
import { APP_DEFAULTS, USER_STORAGE_KEYS } from "@/utils/constants";
import { normalizeAgreementListSearchParams } from "@/utils/normalize-search-params";
import {
  fetchAgreementsListOptions,
  fetchAgreementsSearchColumnsOptions,
} from "@/utils/query/agreement";
import { sortObjectKeys } from "@/utils/sort";
import { getLocalStorageForUser } from "@/utils/user-local-storage";

import { agreementsRoute } from ".";

export const searchAgreementsRoute = new Route({
  getParentRoute: () => agreementsRoute,
  path: "/",
  validateSearch: AgreementSearchQuerySchema.parse,
  preSearchFilters: [
    (search) => {
      const auth = getAuthToken();

      const localRowCountStr = auth
        ? getLocalStorageForUser(
            auth.profile.navotar_clientid,
            auth.profile.navotar_userid,
            USER_STORAGE_KEYS.tableRowCount
          )
        : null;
      const rowCount = parseInt(
        localRowCountStr || APP_DEFAULTS.tableRowCount,
        10
      );

      return {
        page: search?.page || 1,
        size: search?.size || rowCount,
        ...(search.filters ? { filters: search.filters } : {}),
      };
    },
  ],
  beforeLoad: ({ context, search }) => {
    const auth = getAuthFromRouterContext(context);
    const parsedSearch = normalizeAgreementListSearchParams(search);

    return {
      authParams: auth,
      searchColumnsOptions: fetchAgreementsSearchColumnsOptions({
        auth,
      }),
      searchListOptions: fetchAgreementsListOptions({
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
  component: lazyRouteComponent(() => import("@/pages/search-agreements")),
});
