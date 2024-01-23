import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/_auth/reservations")(async ({
  context,
}) => {
  const { queryClient, searchListOptions, searchColumnsOptions } = context;

  if (!context.auth.isAuthenticated) return;

  const promises = [];

  // get columns
  promises.push(queryClient.ensureQueryData(searchColumnsOptions));

  // get search
  promises.push(queryClient.ensureQueryData(searchListOptions));

  await Promise.all(promises);

  return;
});
