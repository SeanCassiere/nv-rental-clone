import { lazy } from "@tanstack/react-router";

import { vehiclesRoute } from ".";
import { queryClient } from "../../App";
import { makeInitialApiData } from "../../api/fetcher";
import { fetchModuleColumnsModded } from "../../hooks/network/module/useGetModuleColumns";
import { fetchVehiclesListModded } from "../../hooks/network/vehicle/useGetVehiclesList";

import { getAuthToken } from "../../utils/authLocal";
import { normalizeVehicleListSearchParams } from "../../utils/normalize-search-params";
import { vehicleQKeys } from "../../utils/query-key";
import { VehicleSearchQuerySchema } from "../../utils/schemas/vehicle";

export const searchVehiclesRoute = vehiclesRoute.createRoute({
  path: "/",
  component: lazy(
    () => import("../../pages/VehiclesSearch/VehiclesSearchPage")
  ),
  validateSearch: (search) => VehicleSearchQuerySchema.parse(search),
  preSearchFilters: [
    (search) => ({
      ...search,
      page: search.page || 1,
      size: search.size || 10,
    }),
  ],
  onLoad: async ({ search }) => {
    const auth = getAuthToken();
    const { pageNumber, size, searchFilters } =
      normalizeVehicleListSearchParams(search);

    if (auth) {
      const promises = [];

      // get columns
      const columnsKey = vehicleQKeys.columns();
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
      const searchKey = vehicleQKeys.search({
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
            initialData: makeInitialApiData([]),
          })
        );
      }

      await Promise.all(promises);
    }
    return {};
  },
});
