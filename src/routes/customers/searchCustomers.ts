import { lazy } from "@tanstack/react-router";

import { customersRoute } from ".";
import { makeInitialApiData } from "../../api/fetcher";
import { queryClient as qc } from "../../App";
import { fetchCustomersListModded } from "../../hooks/network/customer/useGetCustomersList";
import { fetchModuleColumnsModded } from "../../hooks/network/module/useGetModuleColumns";

import { getAuthToken } from "../../utils/authLocal";
import { normalizeCustomerListSearchParams } from "../../utils/normalize-search-params";
import { customerQKeys } from "../../utils/query-key";
import { CustomerSearchQuerySchema } from "../../utils/schemas/customer";

export const searchCustomersRoute = customersRoute.createRoute({
  path: "/",
  component: lazy(
    () => import("../../pages/CustomerSearch/CustomerSearchPage")
  ),
  validateSearch: (search) => CustomerSearchQuerySchema.parse(search),
  preSearchFilters: [
    ({ filters, ...search }) => ({
      ...search,
      page: search.page || 1,
      size: search.size || 10,
    }),
  ],
  onLoad: async ({ search }) => {
    const auth = getAuthToken();

    const { pageNumber, size, searchFilters } =
      normalizeCustomerListSearchParams(search);

    if (auth) {
      const promises = [];

      // get columns
      const columnsKey = customerQKeys.columns();
      if (!qc.getQueryData(columnsKey)) {
        promises.push(
          qc.prefetchQuery({
            queryKey: columnsKey,
            queryFn: () =>
              fetchModuleColumnsModded({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                module: "customers",
              }),
            initialData: [],
          })
        );
      }

      // get search
      const searchKey = customerQKeys.search({
        pagination: { page: pageNumber, pageSize: size },
        filters: searchFilters,
      });
      if (!qc.getQueryData(searchKey)) {
        promises.push(
          qc.prefetchQuery({
            queryKey: searchKey,
            queryFn: () =>
              fetchCustomersListModded({
                page: pageNumber,
                pageSize: size,
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                filters: searchFilters,
              }),

            initialData: makeInitialApiData([]),
          })
        );
      }

      await Promise.all(promises);
    }
    return {};
  },
});
