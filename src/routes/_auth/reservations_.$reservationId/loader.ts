import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/_auth/reservations/$reservationId")(
  async ({ context }) => {
    const {
      queryClient,
      viewReservationOptions,
      viewReservationSummaryOptions,
      viewTab,
    } = context;
    const promises = [];

    if (!context.auth.isAuthenticated) return;

    promises.push(queryClient.ensureQueryData(viewReservationOptions));

    switch (viewTab.trim().toLowerCase()) {
      case "notes":
        break;
      case "summary":
      default:
        promises.push(
          queryClient.ensureQueryData(viewReservationSummaryOptions)
        );
        break;
    }

    await Promise.all(promises);

    return;
  }
);
