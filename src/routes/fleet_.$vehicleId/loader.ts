import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/fleet/$vehicleId")(async ({
  context,
}) => {
  const { queryClient, viewVehicleOptions, viewVehicleSummaryOptions } =
    context;

  const promises = [];

  // get summary
  promises.push(queryClient.ensureQueryData(viewVehicleSummaryOptions));

  // get vehicle
  promises.push(queryClient.ensureQueryData(viewVehicleOptions));

  await Promise.all(promises);

  return;
});
