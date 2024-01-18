import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchVehiclesByIdOptions,
  fetchVehiclesSummaryByIdOptions,
} from "@/utils/query/vehicle";

import { fleetRoute } from ".";

export const fleetPathIdRoute = new Route({
  getParentRoute: () => fleetRoute,
  path: "$vehicleId",
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
  beforeLoad: ({ context, params: { vehicleId }, search }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      viewVehicleSummaryOptions: fetchVehiclesSummaryByIdOptions({
        auth,
        vehicleId,
      }),
      viewVehicleOptions: fetchVehiclesByIdOptions({ auth, vehicleId }),
      viewTab: search?.tab || "",
    };
  },
  loader: async ({ context }) => {
    const { queryClient, viewVehicleOptions, viewVehicleSummaryOptions } =
      context;

    const promises = [];

    // get summary
    promises.push(queryClient.ensureQueryData(viewVehicleSummaryOptions));

    // get vehicle
    promises.push(queryClient.ensureQueryData(viewVehicleOptions));

    await Promise.all(promises);

    return;
  },
  component: lazyRouteComponent(() => import("@/pages/view-vehicle")),
});

export const editFleetByIdRoute = new Route({
  getParentRoute: () => fleetPathIdRoute,
  path: "edit",
  component: () => "Edit Vehicle Route",
});
