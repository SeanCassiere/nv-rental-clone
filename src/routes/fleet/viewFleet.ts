import { lazy, Route } from "@tanstack/react-router";
import { z } from "zod";

import { fleetRoute } from ".";
import { fetchVehicleSummaryAmounts } from "../../api/summary";
import { fetchVehicleData } from "../../api/vehicles";

import { queryClient as qc } from "../../App";
import { getAuthToken } from "../../utils/authLocal";
import { fleetQKeys } from "../../utils/query-key";

export const viewFleetRoute = new Route({
  getParentRoute: () => fleetRoute,
  path: "$vehicleId",
  validateSearch: (search) =>
    z.object({ tab: z.string().optional() }).parse(search),
  preSearchFilters: [() => ({ tab: "summary" })],
  onLoad: async ({ params: { vehicleId } }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      // get summary
      const summaryKey = fleetQKeys.summary(vehicleId);
      if (!qc.getQueryData(summaryKey)) {
        promises.push(
          qc.prefetchQuery({
            queryKey: summaryKey,
            queryFn: () =>
              fetchVehicleSummaryAmounts({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                vehicleId,
                clientDate: new Date(),
              }),
          })
        );
      }

      const dataKey = fleetQKeys.id(vehicleId);
      if (!qc.getQueryData(dataKey)) {
        promises.push(
          qc.prefetchQuery({
            queryKey: dataKey,
            queryFn: () => {
              return fetchVehicleData({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                vehicleId,
                clientTime: new Date(),
              });
            },
            retry: 0,
          })
        );
      }

      await Promise.all(promises);
    }
    return {};
  },
  component: lazy(() => import("../../pages/FleetView/FleetViewPage")),
  parseParams: (params) => ({
    vehicleId: z.string().parse(params.vehicleId),
  }),
  stringifyParams: (params) => ({ vehicleId: `${params.vehicleId}` }),
});
