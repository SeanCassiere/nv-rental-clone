import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/_auth/fleet/$vehicleId")(async ({
  context,
}) => {
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
});
