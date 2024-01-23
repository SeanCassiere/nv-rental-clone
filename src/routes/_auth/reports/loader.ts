import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/_auth/reports")(async ({ context }) => {
  const { queryClient, searchListOptions } = context;

  if (!context.auth.isAuthenticated) return;

  await queryClient.ensureQueryData(searchListOptions);

  return;
});
