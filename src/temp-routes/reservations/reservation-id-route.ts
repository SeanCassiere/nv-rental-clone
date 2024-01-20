import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchReservationByIdOptions,
  fetchReservationSummaryByIdOptions,
} from "@/utils/query/reservation";

import { reservationsRoute } from ".";

export const reservationPathIdRoute = new Route({
  getParentRoute: () => reservationsRoute,
  path: "$reservationId",
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
    const promises = [];

    promises.push(queryClient.ensureQueryData(viewReservationOptions));

    promises.push(queryClient.ensureQueryData(viewReservationSummaryOptions));

    await Promise.all(promises);

    return;
  },
  component: lazyRouteComponent(() => import("@/pages/edit-reservation")),
});
