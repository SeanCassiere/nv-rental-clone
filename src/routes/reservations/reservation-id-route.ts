import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext, getAuthToken } from "@/utils/auth";
import { reservationQKeys } from "@/utils/query-key";
import { fetchReservationByIdOptions } from "@/utils/query/reservation";

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
  beforeLoad: ({ context, search, params: { reservationId } }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      viewReservationOptions: fetchReservationByIdOptions({
        auth,
        reservationId,
      }),
      viewTab: search?.tab || "",
    };
  },
  loader: async ({ context }) => {
    const { queryClient, viewReservationOptions, viewTab } = context;
    const promises = [];

    promises.push(queryClient.ensureQueryData(viewReservationOptions));

    switch (viewTab.trim().toLowerCase()) {
      case "notes":
        break;
      default:
        break;
    }

    await Promise.all(promises);

    return;
  },
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
  beforeLoad: ({ context, search, params: { reservationId } }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      viewReservationOptions: fetchReservationByIdOptions({
        auth,
        reservationId,
      }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, viewReservationOptions } = context;
    const promises = [];

    promises.push(queryClient.ensureQueryData(viewReservationOptions));

    await Promise.all(promises);

    return;
  },
  component: lazyRouteComponent(() => import("@/pages/edit-reservation")),
});
