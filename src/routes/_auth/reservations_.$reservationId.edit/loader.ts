import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader(
  "/_auth/reservations/$reservationId/edit"
)(async ({ context }) => {
  const { queryClient, viewReservationOptions, viewReservationSummaryOptions } =
    context;

  if (!context.auth.isAuthenticated) return;

  const promises = [];

  promises.push(queryClient.ensureQueryData(viewReservationOptions));

  promises.push(queryClient.ensureQueryData(viewReservationSummaryOptions));

  await Promise.all(promises);

  return;
});
