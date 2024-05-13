import { createFileRoute } from "@tanstack/react-router";

import {
  fetchReservationStatusesOptions,
  fetchReservationTypesOptions,
} from "@/lib/query/reservation";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute("/_auth/(reservations)/reservations")({
  beforeLoad: ({ context }) => {
    const auth = getAuthFromRouterContext(context);
    const reservationTypesOptions = fetchReservationTypesOptions({ auth });
    const reservationStatusesOptions = fetchReservationStatusesOptions({
      auth,
    });
    return {
      reservationTypesOptions,
      reservationStatusesOptions,
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    const promises = [
      context.queryClient.ensureQueryData(context.reservationTypesOptions),
      context.queryClient.ensureQueryData(context.reservationStatusesOptions),
    ];

    await Promise.allSettled(promises);

    return {};
  },
});
