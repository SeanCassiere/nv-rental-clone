import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { fetchAgreementsListModded } from "@/hooks/network/agreement/useGetAgreementsList";

import { AgreementSearchQuerySchema } from "@/schemas/agreement";

import { getAuthFromRouterContext, getAuthToken } from "@/utils/auth";
import { APP_DEFAULTS, USER_STORAGE_KEYS } from "@/utils/constants";
import { normalizeAgreementListSearchParams } from "@/utils/normalize-search-params";
import { agreementQKeys } from "@/utils/query-key";
import { fetchAgreementsSearchColumnsOptions } from "@/utils/query/agreement";
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
    return {
      authParams: auth,
      searchColumnsOptions: fetchAgreementsSearchColumnsOptions({
        auth,
      }),
      search: normalizeAgreementListSearchParams(search),
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

    const { searchFilters, pageNumber, size: pageSize } = search;

    if (auth) {
      const promises = [];

      // get columns
      promises.push(queryClient.ensureQueryData(searchColumnsOptions));

      // get list
      const searchKey = agreementQKeys.search({
        pagination: { page: pageNumber, pageSize: pageSize },
        filters: searchFilters,
      });
      promises.push(
        queryClient.ensureQueryData({
          queryKey: searchKey,
          queryFn: () =>
            fetchAgreementsListModded({
              page: pageNumber,
              pageSize: pageSize,
              clientId: auth.profile.navotar_clientid,
              userId: auth.profile.navotar_userid,
              currentDate: new Date(),
              ...searchFilters,
            }),
        })
      );

      await Promise.all(promises);
    }
    return;
  },
  component: lazyRouteComponent(() => import("@/pages/search-agreements")),
});
