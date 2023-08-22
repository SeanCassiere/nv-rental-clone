import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { fetchAgreementsListModded } from "@/hooks/network/agreement/useGetAgreementsList";
import { fetchModuleColumnsModded } from "@/hooks/network/module/useGetModuleColumns";

import { AgreementSearchQuerySchema } from "@/schemas/agreement";

import { getAuthToken } from "@/utils/authLocal";
import { APP_DEFAULTS, USER_STORAGE_KEYS } from "@/utils/constants";
import { normalizeAgreementListSearchParams } from "@/utils/normalize-search-params";
import { agreementQKeys } from "@/utils/query-key";
import { getLocalStorageForUser } from "@/utils/user-local-storage";

import { agreementsRoute } from ".";

export const searchAgreementsRoute = new Route({
  getParentRoute: () => agreementsRoute,
  path: "/",
  validateSearch: (search) => AgreementSearchQuerySchema.parse(search),
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
  loader: async ({ search, context: { queryClient } }) => {
    const auth = getAuthToken();

    const {
      searchFilters,
      pageNumber,
      size: pageSize,
    } = normalizeAgreementListSearchParams(search);

    if (auth) {
      const promises = [];

      // get columns
      const columnsKey = agreementQKeys.columns();
      promises.push(
        queryClient.ensureQueryData({
          queryKey: columnsKey,
          queryFn: () =>
            fetchModuleColumnsModded({
              query: {
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                module: "agreement",
              },
            }),
        })
      );

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
              accessToken: auth.access_token,
              currentDate: new Date(),
              filters: searchFilters,
            }),
        })
      );

      await Promise.all(promises);
    }
    return {};
  },
}).update({
  component: lazyRouteComponent(() => import("@/pages/search-agreements")),
});
