import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/reports")(async ({ context }) => {
  const { queryClient, searchListOptions } = context;

  if (!context.auth.isAuthenticated) return;

  await queryClient.ensureQueryData(searchListOptions);

  return;
});
