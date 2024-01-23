import { FileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchReservationByIdOptions,
  fetchReservationSummaryByIdOptions,
} from "@/utils/query/reservation";

export const Route = new FileRoute("/_auth/reservations/$reservationId").createRoute({
  validateSearch: (search) =>
    z
      .object({
        tab: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [(search) => ({ tab: search?.tab || "summary" })],
  beforeLoad: ({ context, search, params: { reservationId } }) => {
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
      viewTab: search?.tab || "",
    };
  },
});
