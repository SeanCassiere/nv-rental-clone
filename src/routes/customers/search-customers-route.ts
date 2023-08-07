import { Route, lazyRouteComponent } from "@tanstack/router";

import { customersRoute } from ".";

import { fetchCustomersListModded } from "@/hooks/network/customer/useGetCustomersList";
import { fetchModuleColumnsModded } from "@/hooks/network/module/useGetModuleColumns";

import { getAuthToken } from "@/utils/authLocal";
import { customerQKeys } from "@/utils/query-key";
import { normalizeCustomerListSearchParams } from "@/utils/normalize-search-params";
import { CustomerSearchQuerySchema } from "@/schemas/customer";

export const searchCustomersRoute = new Route({
  getParentRoute: () => customersRoute,
  path: "/",
  validateSearch: (search) => CustomerSearchQuerySchema.parse(search),
  preSearchFilters: [
    (search) => ({
      page: search?.page || 1,
      size: search?.size || 10,
      ...(search.filters ? { filters: search.filters } : {}),
    }),
  ],
  loader: async ({ search, context: { queryClient } }) => {
    const auth = getAuthToken();

    const { pageNumber, size, searchFilters } =
      normalizeCustomerListSearchParams(search);

    if (auth) {
      const promises = [];

      // get columns
      const columnsKey = customerQKeys.columns();
      promises.push(
        queryClient.ensureQueryData({
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

      // get search
      const searchKey = customerQKeys.search({
        pagination: { page: pageNumber, pageSize: size },
        filters: searchFilters,
      });
      promises.push(
        queryClient.ensureQueryData({
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

      await Promise.all(promises);
    }
    return {};
  },
}).update({
  component: lazyRouteComponent(() => import("@/pages/search-customers")),
});
