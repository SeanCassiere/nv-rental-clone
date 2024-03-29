import { createFileRoute, redirect } from "@tanstack/react-router";

import {
  fetchReservationsSearchColumnsOptions,
  fetchReservationsSearchListOptions,
} from "@/lib/query/reservation";

import { normalizeReservationListSearchParams } from "@/lib/utils/normalize-search-params";

export const Route = createFileRoute(
  "/_auth/(fleet)/fleet/$vehicleId/_details/reservations"
)({
  beforeLoad: ({
    context: { authParams: auth, queryClient, viewVehicleOptions },
    params,
  }) => {
    const vehicleCache = queryClient.getQueryData(viewVehicleOptions.queryKey);

    const vehicle = vehicleCache?.status === 200 ? vehicleCache.body : null;

    const vehicleNo = vehicle?.vehicle?.vehicleNo || null;

    if (!vehicleNo) {
      throw redirect({
        to: "/fleet/$vehicleId/summary",
        params,
        replace: true,
      });
    }

    const search = normalizeReservationListSearchParams({
      page: 1,
      size: 50,
      filters: { VehicleNo: vehicle?.vehicle?.vehicleNo || undefined },
    });

    return {
      vehicleNo,
      reservationColumnsOptions: fetchReservationsSearchColumnsOptions({
        auth,
      }),
      reservationListOptions: fetchReservationsSearchListOptions({
        auth,
        pagination: {
          page: search.pageNumber,
          pageSize: search.size,
        },
        filters: {
          ...search.searchFilters,
          clientDate: new Date(),
        },
      }),
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    const promises = [
      context.queryClient.ensureQueryData(context.reservationColumnsOptions),
      context.queryClient.ensureQueryData(context.reservationListOptions),
    ];

    await Promise.all(promises);

    return;
  },
});
