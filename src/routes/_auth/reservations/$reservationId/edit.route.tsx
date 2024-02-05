import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  fetchReservationByIdOptions,
  fetchReservationSummaryByIdOptions,
} from "@/lib/query/reservation";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute("/_auth/reservations/$reservationId/edit")(
  {
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
    loader: async ({ context }) => {
      const {
        queryClient,
        viewReservationOptions,
        viewReservationSummaryOptions,
      } = context;

      if (!context.auth.isAuthenticated) return;

      const promises = [];

      promises.push(queryClient.ensureQueryData(viewReservationOptions));

      promises.push(queryClient.ensureQueryData(viewReservationSummaryOptions));

      await Promise.all(promises);

      return;
    },
  }
);
