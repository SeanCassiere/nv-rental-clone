import { Route, lazyRouteComponent } from "@tanstack/router";
import { z } from "zod";

import { fleetRoute } from ".";

import { fetchVehicleSummaryAmounts } from "@/api/summary";
import { fetchVehicleData } from "@/api/vehicles";

import { getAuthToken } from "@/utils/authLocal";
import { fleetQKeys } from "@/utils/query-key";

export const fleetPathIdRoute = new Route({
  getParentRoute: () => fleetRoute,
  path: "$vehicleId",
  loader: async ({ params: { vehicleId }, context: { queryClient } }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      // get summary
      const summaryKey = fleetQKeys.summary(vehicleId);
      promises.push(
        queryClient.ensureQueryData({
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

      const dataKey = fleetQKeys.id(vehicleId);
      promises.push(
        queryClient.ensureQueryData({
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

      await Promise.all(promises);
    }
    return {};
  },
  parseParams: (params) => ({
    vehicleId: z.string().parse(params.vehicleId),
  }),
  stringifyParams: (params) => ({
    vehicleId: `${params.vehicleId}`,
  }),
});

export const viewFleetByIdRoute = new Route({
  getParentRoute: () => fleetPathIdRoute,
  path: "/",
  validateSearch: (search) =>
    z
      .object({
        tab: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [(search) => ({ tab: search?.tab || "summary" })],
}).update({
  component: lazyRouteComponent(() => import("@/pages/view-fleet")),
});

export const editFleetByIdRoute = new Route({
  getParentRoute: () => fleetPathIdRoute,
  path: "edit",
  component: () => "Edit Vehicle Route",
});
