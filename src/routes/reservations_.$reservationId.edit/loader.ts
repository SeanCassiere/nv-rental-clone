import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/reservations/$reservationId/edit")(
  async ({ context }) => {
    const {
      queryClient,
      viewReservationOptions,
      viewReservationSummaryOptions,
    } = context;
    const promises = [];

    promises.push(queryClient.ensureQueryData(viewReservationOptions));

    promises.push(queryClient.ensureQueryData(viewReservationSummaryOptions));

    await Promise.all(promises);

    return;
  }
);
