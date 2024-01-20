import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/reports")(async ({ context }) => {
  const { queryClient, searchListOptions } = context;
  await queryClient.ensureQueryData(searchListOptions);
  return;
});
