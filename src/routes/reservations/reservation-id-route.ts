import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthToken } from "@/utils/authLocal";
import { reservationQKeys } from "@/utils/query-key";

import { reservationsRoute } from ".";

export const reservationPathIdRoute = new Route({
  getParentRoute: () => reservationsRoute,
  path: "$reservationId",
  loader: async ({
    params: { reservationId },
    context: { queryClient, apiClient },
  }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      // get summary
      const summaryKey = reservationQKeys.summary(reservationId);
      promises.push(
        queryClient.ensureQueryData({
          queryKey: summaryKey,
          queryFn: () =>
            apiClient.summary.getSummaryForReferenceId({
              params: {
                referenceType: "reservations",
                referenceId: reservationId,
              },
              query: {
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
              },
            }),
        })
      );

      const dataKey = reservationQKeys.id(reservationId);
      promises.push(
        queryClient.ensureQueryData({
          queryKey: dataKey,
          queryFn: () =>
            apiClient.reservation.getById({
              query: {
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
              },
              params: {
                reservationId,
              },
            }),
          retry: 0,
        })
      );

      try {
        await Promise.all(promises);
      } catch (error) {
        console.log("route prefetch failed for /reservations/:id", error);
      }
    }
    return;
  },
  parseParams: (params) => ({
    reservationId: z.string().parse(params.reservationId),
  }),
  stringifyParams: (params) => ({
    reservationId: `${params.reservationId}`,
  }),
});

export const viewReservationByIdRoute = new Route({
  getParentRoute: () => reservationPathIdRoute,
  path: "/",
  validateSearch: (search) =>
    z
      .object({
        tab: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [(search) => ({ tab: search?.tab || "summary" })],
  component: lazyRouteComponent(() => import("@/pages/view-reservation")),
});

export const editReservationByIdRoute = new Route({
  getParentRoute: () => reservationPathIdRoute,
  path: "edit",
  validateSearch: (search) =>
    z
      .object({
        stage: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [() => ({ stage: "rental-information" })],
  component: lazyRouteComponent(() => import("@/pages/edit-reservation")),
});
