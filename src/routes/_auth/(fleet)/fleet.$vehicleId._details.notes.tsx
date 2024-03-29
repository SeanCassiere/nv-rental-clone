import { createFileRoute } from "@tanstack/react-router";

import { fetchVehiclesByIdOptions } from "@/lib/query/vehicle";

export const Route = createFileRoute(
  "/_auth/(fleet)/fleet/$vehicleId/_details/notes"
)({
  beforeLoad: ({ context: { authParams: auth }, params: { vehicleId } }) => {
    return {
      viewVehicleOptions: fetchVehiclesByIdOptions({
        auth,
        vehicleId,
      }),
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    await context.queryClient.ensureQueryData(context.viewVehicleOptions);

    return;
  },
});
