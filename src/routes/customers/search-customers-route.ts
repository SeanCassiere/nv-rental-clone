import { lazy, Route } from "@tanstack/router";

import { customersRoute } from ".";
import { queryClient as qc } from "../../app-entry";
import { fetchCustomersListModded } from "@/hooks/network/customer/useGetCustomersList";
import { fetchModuleColumnsModded } from "@/hooks/network/module/useGetModuleColumns";

import { getAuthToken } from "@/utils/authLocal";
import { normalizeCustomerListSearchParams } from "@/utils/normalize-search-params";
import { customerQKeys } from "@/utils/query-key";
import { CustomerSearchQuerySchema } from "@/schemas/customer";

export const searchCustomersRoute = new Route({
  getParentRoute: () => customersRoute,
  path: "/",
  component: lazy(() => import("../../pages/search-customers")),
  validateSearch: (search) =>
    CustomerSearchQuerySchema.passthrough().parse(search),
  preSearchFilters: [
    () => ({
      page: 1,
      size: 10,
    }),
  ],
  loader: async ({ search }) => {
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
          })
        );
      }

      await Promise.all(promises);
    }
    return {};
  },
});
