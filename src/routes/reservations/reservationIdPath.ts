import { lazy, Route } from "@tanstack/router";
import { z } from "zod";

import { reservationsRoute } from ".";
import { queryClient as qc } from "../../App";
import { fetchRentalRateSummaryAmounts } from "../../api/summary";
import { fetchReservationData } from "../../api/reservations";

import { getAuthToken } from "../../utils/authLocal";
import { reservationQKeys } from "../../utils/query-key";

export const reservationPathIdRoute = new Route({
  getParentRoute: () => reservationsRoute,
  path: "$reservationId",
  loader: async ({ params: { reservationId } }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      // get summary
      const summaryKey = reservationQKeys.summary(reservationId);
      if (!qc.getQueryData(summaryKey)) {
        promises.push(
          qc.prefetchQuery({
            queryKey: summaryKey,
            queryFn: () =>
              fetchRentalRateSummaryAmounts({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                module: "reservations",
                referenceId: reservationId,
              }),
          })
        );
      }

      const dataKey = reservationQKeys.id(reservationId);
      if (!qc.getQueryData(dataKey)) {
        promises.push(
          qc.prefetchQuery({
            queryKey: dataKey,
            queryFn: () => {
              return fetchReservationData({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                reservationId,
              });
            },
            retry: 0,
          })
        );
      }

      await Promise.all(promises);
    }
    return {};
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
  preSearchFilters: [() => ({ tab: "summary" })],
  component: lazy(
    () => import("../../pages/ReservationView/ReservationViewPage")
  ),
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
  component: lazy(
    () => import("../../pages/EditReservation/EditReservationPage")
  ),
});
