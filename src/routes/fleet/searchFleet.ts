import { lazy, Route } from "@tanstack/react-router";

import { fleetRoute } from ".";
import { queryClient } from "../../App";

import { fetchModuleColumnsModded } from "../../hooks/network/module/useGetModuleColumns";
import { fetchVehiclesListModded } from "../../hooks/network/vehicle/useGetVehiclesList";

import { getAuthToken } from "../../utils/authLocal";
import { normalizeVehicleListSearchParams } from "../../utils/normalize-search-params";
import { fleetQKeys } from "../../utils/query-key";
import { VehicleSearchQuerySchema } from "../../utils/schemas/vehicle";

export const searchFleetRoute = new Route({
  getParentRoute: () => fleetRoute,
  path: "/",
  validateSearch: (search) => VehicleSearchQuerySchema.parse(search),
  preSearchFilters: [
    () => ({
      page: 1,
      size: 10,
    }),
  ],
  onLoad: async ({ search }) => {
    const auth = getAuthToken();
    const { pageNumber, size, searchFilters } =
      normalizeVehicleListSearchParams(search);

    if (auth) {
      const promises = [];

      // get columns
      const columnsKey = fleetQKeys.columns();
      if (!queryClient.getQueryData(columnsKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: columnsKey,
            queryFn: () =>
              fetchModuleColumnsModded({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                module: "vehicles",
              }),
            initialData: [],
          })
        );
      }

      // get search
      const searchKey = fleetQKeys.search({
        pagination: { page: pageNumber, pageSize: size },
        filters: searchFilters,
      });
      if (!queryClient.getQueryData(searchKey)) {
        promises.push(
          queryClient.prefetchQuery({
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
      }

      await Promise.all(promises);
    }
    return {};
  },
  component: lazy(() => import("../../pages/FleetSearch/FleetSearchPage")),
});
