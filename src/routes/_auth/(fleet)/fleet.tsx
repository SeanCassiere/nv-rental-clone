import { createFileRoute } from "@tanstack/react-router";

import {
  fetchVehiclesStatusesOptions,
  fetchVehiclesTypesOptions,
} from "@/lib/query/vehicle";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute("/_auth/(fleet)/fleet")({
  beforeLoad: ({ context }) => {
    const auth = getAuthFromRouterContext(context);
    const vehicleTypesOptions = fetchVehiclesTypesOptions({ auth });
    const vehicleStatusesOptions = fetchVehiclesStatusesOptions({ auth });
    return {
      vehicleTypesOptions,
      vehicleStatusesOptions,
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    const promises = [
      context.queryClient.ensureQueryData(context.vehicleTypesOptions),
      context.queryClient.ensureQueryData(context.vehicleStatusesOptions),
    ];

    await Promise.allSettled(promises);

    return {};
  },
});
