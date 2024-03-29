import { createFileRoute } from "@tanstack/react-router";

import { fetchReservationNotesByIdOptions } from "@/lib/query/reservation";

export const Route = createFileRoute(
  "/_auth/(reservations)/reservations/$reservationId/_details/notes"
)({
  beforeLoad: ({
    context: { authParams: auth },
    params: { reservationId },
  }) => {
    return {
      viewReservationNotesOptions: fetchReservationNotesByIdOptions({
        auth,
        reservationId,
      }),
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    await context.queryClient.ensureQueryData(
      context.viewReservationNotesOptions
    );

    return;
  },
});
