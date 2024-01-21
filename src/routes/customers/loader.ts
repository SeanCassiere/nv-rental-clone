import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/customers")(async ({ context }) => {
  const { queryClient, searchColumnsOptions, searchListOptions } = context;

  if (!context.auth.isAuthenticated) return;

  const promises = [];

  // get columns
  promises.push(queryClient.ensureQueryData(searchColumnsOptions));

  // get search
  promises.push(queryClient.ensureQueryData(searchListOptions));

  await Promise.all(promises);
  return;
});
