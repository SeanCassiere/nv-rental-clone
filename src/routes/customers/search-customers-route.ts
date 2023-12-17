import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { fetchCustomersListModded } from "@/hooks/network/customer/useGetCustomersList";
import { fetchModuleColumnsModded } from "@/hooks/network/module/useGetModuleColumns";

import { CustomerSearchQuerySchema } from "@/schemas/customer";

import { getAuthToken } from "@/utils/authLocal";
import { APP_DEFAULTS } from "@/utils/constants";
import { normalizeCustomerListSearchParams } from "@/utils/normalize-search-params";
import { customerQKeys } from "@/utils/query-key";

import { customersRoute } from ".";

export const searchCustomersRoute = new Route({
  getParentRoute: () => customersRoute,
  path: "/",
  validateSearch: (search) => CustomerSearchQuerySchema.parse(search),
  preSearchFilters: [
    (search) => ({
      page: search?.page || 1,
      size: search?.size || parseInt(APP_DEFAULTS.tableRowCount),
      ...(search.filters ? { filters: search.filters } : {}),
    }),
  ],
  beforeLoad: ({ search }) => ({
    search: normalizeCustomerListSearchParams(search),
  }),
  loaderDeps: ({ search }) => ({
    page: search.page,
    size: search.size,
    filters: search.filters,
  }),
  loader: async ({ context: { queryClient, search } }) => {
    const auth = getAuthToken();

    const { pageNumber, size, searchFilters } = search;

    if (auth) {
      const promises = [];

      // get columns
      const columnsKey = customerQKeys.columns();
      promises.push(
        queryClient.ensureQueryData({
          queryKey: columnsKey,
          queryFn: () =>
            fetchModuleColumnsModded({
              query: {
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                module: "customer",
              },
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
              ...searchFilters,
            }),
        })
      );

      await Promise.all(promises);
    }
    return;
  },
  component: lazyRouteComponent(() => import("@/pages/search-customers")),
});
