import { createFileRoute } from "@tanstack/react-router";

import {
  fetchVehiclesByIdOptions,
  fetchVehiclesSummaryByIdOptions,
} from "@/lib/query/vehicle";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute("/_auth/(fleet)/fleet/$vehicleId")({
  beforeLoad: ({ context, params: { vehicleId } }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      viewVehicleSummaryOptions: fetchVehiclesSummaryByIdOptions({
        auth,
        vehicleId,
      }),
      viewVehicleOptions: fetchVehiclesByIdOptions({ auth, vehicleId }),
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    const promises = [
      context.queryClient.ensureQueryData(context.viewVehicleSummaryOptions),
      context.queryClient.ensureQueryData(context.viewVehicleOptions),
    ];

    await Promise.all(promises);
  },
});
