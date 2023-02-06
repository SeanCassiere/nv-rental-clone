import { lazy, Route } from "@tanstack/react-router";
import { z } from "zod";

import { reservationsRoute } from ".";
import { queryClient as qc } from "../../App";
import { fetchRentalRateSummaryAmounts } from "../../api/summary";
import { fetchReservationData } from "../../api/reservation";

import { getAuthToken } from "../../utils/authLocal";
import { reservationQKeys } from "../../utils/query-key";
import { b64_decode, b64_encode } from "../../utils/base64";

export const viewReservationRoute = new Route({
  getParentRoute: () => reservationsRoute,
  path: "$reservationId",
  validateSearch: (search) =>
    z.object({ tab: z.string().optional() }).parse(search),
  preSearchFilters: [() => ({ tab: "summary" })],
  onLoad: async ({ params: { reservationId } }) => {
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
  component: lazy(
    () => import("../../pages/ReservationView/ReservationViewPage")
  ),
  parseParams: (params) => ({
    reservationId: b64_decode(z.string().parse(params.reservationId)),
  }),
  stringifyParams: (params) => ({
    reservationId: b64_encode(`${params.reservationId}`),
  }),
});
