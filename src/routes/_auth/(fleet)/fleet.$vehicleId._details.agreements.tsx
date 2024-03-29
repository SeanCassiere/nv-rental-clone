import { createFileRoute, redirect } from "@tanstack/react-router";

import {
  fetchAgreementsSearchColumnsOptions,
  fetchAgreementsSearchListOptions,
} from "@/lib/query/agreement";

import { normalizeAgreementListSearchParams } from "@/lib/utils/normalize-search-params";

export const Route = createFileRoute(
  "/_auth/(fleet)/fleet/$vehicleId/_details/agreements"
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

    const search = normalizeAgreementListSearchParams({
      page: 1,
      size: 50,
      filters: { VehicleNo: vehicle?.vehicle?.vehicleNo || undefined },
    });

    return {
      vehicleNo,
      agreementColumnsOptions: fetchAgreementsSearchColumnsOptions({
        auth,
      }),
      agreementListOptions: fetchAgreementsSearchListOptions({
        auth,
        pagination: {
          page: search.pageNumber,
          pageSize: search.size,
        },
        filters: {
          ...search.searchFilters,
          currentDate: new Date(),
        },
      }),
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    const promises = [
      context.queryClient.ensureQueryData(context.agreementColumnsOptions),
      context.queryClient.ensureQueryData(context.agreementListOptions),
    ];

    await Promise.all(promises);

    return;
  },
});
