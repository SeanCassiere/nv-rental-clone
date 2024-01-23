import { FileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchReservationByIdOptions,
  fetchReservationSummaryByIdOptions,
} from "@/utils/query/reservation";

export const Route = new FileRoute(
  "/_auth/reservations/$reservationId/edit"
).createRoute({
  validateSearch: (search) =>
    z
      .object({
        stage: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [() => ({ stage: "rental-information" })],
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
});
