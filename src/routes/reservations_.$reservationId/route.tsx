import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchReservationByIdOptions,
  fetchReservationSummaryByIdOptions,
} from "@/utils/query/reservation";

export const Route = new FileRoute("/reservations/$reservationId").createRoute({
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
  loader: async ({ context }) => {
    const {
      queryClient,
      viewReservationOptions,
      viewReservationSummaryOptions,
      viewTab,
    } = context;
    const promises = [];

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
  },
  component: lazyRouteComponent(() => import("@/pages/view-reservation")),
});
