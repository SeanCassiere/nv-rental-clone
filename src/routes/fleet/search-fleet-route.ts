import { Route, lazyRouteComponent } from "@tanstack/router";

import { fleetRoute } from ".";

import { fetchModuleColumnsModded } from "@/hooks/network/module/useGetModuleColumns";
import { fetchVehiclesListModded } from "@/hooks/network/vehicle/useGetVehiclesList";

import { getAuthToken } from "@/utils/authLocal";
import { fleetQKeys } from "@/utils/query-key";
import { normalizeVehicleListSearchParams } from "@/utils/normalize-search-params";
import { VehicleSearchQuerySchema } from "@/schemas/vehicle";

export const searchFleetRoute = new Route({
  getParentRoute: () => fleetRoute,
  path: "/",
  validateSearch: (search) => VehicleSearchQuerySchema.parse(search),
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
              clientId: auth.profile.navotar_clientid,
              userId: auth.profile.navotar_userid,
              accessToken: auth.access_token,
              module: "vehicles",
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
  component: lazyRouteComponent(() => import("@/pages/search-fleet")),
});
