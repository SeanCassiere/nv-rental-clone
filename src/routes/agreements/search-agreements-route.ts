import { lazy, Route } from "@tanstack/router";

import { agreementsRoute } from ".";
import { queryClient as qc } from "@/app-entry";
import { fetchModuleColumnsModded } from "@/hooks/network/module/useGetModuleColumns";
import { fetchAgreementsListModded } from "@/hooks/network/agreement/useGetAgreementsList";

import { getAuthToken } from "@/utils/authLocal";
import { agreementQKeys } from "@/utils/query-key";
import { AgreementSearchQuerySchema } from "@/schemas/agreement";
import { normalizeAgreementListSearchParams } from "@/utils/normalize-search-params";

export const searchAgreementsRoute = new Route({
  getParentRoute: () => agreementsRoute,
  path: "/",
  validateSearch: (search) => AgreementSearchQuerySchema.parse(search),
  preSearchFilters: [
    (search) => ({
      page: search?.page || 1,
      size: search?.size || 10,
      ...(search.filters ? { filters: search.filters } : {}),
    }),
  ],
  loader: async ({ search }) => {
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
      if (!qc.getQueryData(columnsKey)) {
        promises.push(
          qc.prefetchQuery({
            queryKey: columnsKey,
            queryFn: () =>
              fetchModuleColumnsModded({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                module: "agreements",
              }),
          })
        );
      }

      // get list
      const searchKey = agreementQKeys.search({
        pagination: { page: pageNumber, pageSize: pageSize },
        filters: searchFilters,
      });
      if (!qc.getQueryData(searchKey)) {
        promises.push(
          qc.prefetchQuery({
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
      }

      await Promise.all(promises);
    }
    return {};
  },
  component: lazy(() => import("../../pages/search-agreements")),
});
