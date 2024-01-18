import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchFleetByIdOptions,
  fetchSummaryForFleetByIdOptions,
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
      viewFleetSummaryOptions: fetchSummaryForFleetByIdOptions({
        auth,
        fleetId: vehicleId,
      }),
      viewFleetOptions: fetchFleetByIdOptions({ auth, fleetId: vehicleId }),
      viewTab: search?.tab || "",
    };
  },
  loader: async ({ context }) => {
    const { queryClient, viewFleetOptions, viewFleetSummaryOptions } = context;

    const promises = [];

    // get summary
    promises.push(queryClient.ensureQueryData(viewFleetSummaryOptions));

    // get vehicle
    promises.push(queryClient.ensureQueryData(viewFleetOptions));

    await Promise.all(promises);

    return;
  },
  component: lazyRouteComponent(() => import("@/pages/view-fleet")),
});

export const editFleetByIdRoute = new Route({
  getParentRoute: () => fleetPathIdRoute,
  path: "edit",
  component: () => "Edit Vehicle Route",
});
