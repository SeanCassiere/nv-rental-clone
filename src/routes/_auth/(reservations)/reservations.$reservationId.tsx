import { createFileRoute } from "@tanstack/react-router";

import {
  fetchReservationByIdOptions,
  fetchReservationSummaryByIdOptions,
} from "@/lib/query/reservation";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute(
  "/_auth/(reservations)/reservations/$reservationId"
)({
  beforeLoad: ({ context, params: { reservationId } }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      viewReservationSummaryOptions: fetchReservationSummaryByIdOptions({
        auth,
        reservationId,
      }),
      viewReservationOptions: fetchReservationByIdOptions({
        auth,
        reservationId,
      }),
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    const promises = [
      context.queryClient.ensureQueryData(context.viewReservationOptions),
      context.queryClient.ensureQueryData(
        context.viewReservationSummaryOptions
      ),
    ];
    await Promise.all(promises);
  },
});
