import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/")(async ({ context }) => {
  const {
    queryClient,
    dashboardMessagesOptions,
    dashboardWidgetsOptions,
    activeLocationsOptions,
  } = context;
  const promises = [];

  // get messages
  promises.push(queryClient.ensureQueryData(dashboardMessagesOptions));

  // get widgets
  promises.push(queryClient.ensureQueryData(dashboardWidgetsOptions));

  // get locations
  promises.push(queryClient.ensureQueryData(activeLocationsOptions));

  await Promise.all(promises);
  return;
});
