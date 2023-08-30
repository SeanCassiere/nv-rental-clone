import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { fetchVehicleSummaryAmounts } from "@/api/summary";

import { getAuthToken } from "@/utils/authLocal";
import { localDateTimeToQueryYearMonthDay } from "@/utils/date";
import { fleetQKeys } from "@/utils/query-key";

import { fleetRoute } from ".";

export const fleetPathIdRoute = new Route({
  getParentRoute: () => fleetRoute,
  path: "$vehicleId",
  loader: async ({
    params: { vehicleId },
    context: { queryClient, apiClient },
  }) => {
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
            apiClient.vehicle.getById({
              params: {
                vehicleId,
              },
              query: {
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                clientTime: localDateTimeToQueryYearMonthDay(new Date()),
                getMakeDetails: "true",
              },
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
