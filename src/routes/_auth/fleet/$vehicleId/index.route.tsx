import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchVehiclesByIdOptions,
  fetchVehiclesSummaryByIdOptions,
} from "@/utils/query/vehicle";

export const Route = createFileRoute("/_auth/fleet/$vehicleId/")({
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

    if (!context.auth.isAuthenticated) return;

    const promises = [];

    // get summary
    promises.push(queryClient.ensureQueryData(viewVehicleSummaryOptions));

    // get vehicle
    promises.push(queryClient.ensureQueryData(viewVehicleOptions));

    await Promise.all(promises);

    return;
  },
});
