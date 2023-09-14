import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { fetchModuleColumnsModded } from "@/hooks/network/module/useGetModuleColumns";
import { fetchVehiclesListModded } from "@/hooks/network/vehicle/useGetVehiclesList";

import { VehicleSearchQuerySchema } from "@/schemas/vehicle";

import { getAuthToken } from "@/utils/authLocal";
import { APP_DEFAULTS } from "@/utils/constants";
import { normalizeVehicleListSearchParams } from "@/utils/normalize-search-params";
import { fleetQKeys } from "@/utils/query-key";

import { fleetRoute } from ".";

export const searchFleetRoute = new Route({
  getParentRoute: () => fleetRoute,
  path: "/",
  validateSearch: (search) => VehicleSearchQuerySchema.parse(search),
  preSearchFilters: [
    (search) => ({
      page: search?.page || 1,
      size: search?.size || parseInt(APP_DEFAULTS.tableRowCount),
      ...(search.filters ? { filters: search.filters } : {}),
    }),
  ],
  loader: async ({ search, context: { queryClient } }) => {
    const auth = getAuthToken();
    const { pageNumber, size, searchFilters } =
      normalizeVehicleListSearchParams(search);

    if (auth) {
      const promises = [];

      // get columns
      const columnsKey = fleetQKeys.columns();
      promises.push(
        queryClient.ensureQueryData({
          queryKey: columnsKey,
          queryFn: () =>
            fetchModuleColumnsModded({
              query: {
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                module: "vehicle",
              },
            }),
        })
      );

      // get search
      const searchKey = fleetQKeys.search({
        pagination: { page: pageNumber, pageSize: size },
        filters: searchFilters,
      });
      promises.push(
        queryClient.ensureQueryData({
          queryKey: searchKey,
          queryFn: () =>
            fetchVehiclesListModded({
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
    return {};
  },
}).update({
  component: lazyRouteComponent(() => import("@/pages/search-fleet")),
});
