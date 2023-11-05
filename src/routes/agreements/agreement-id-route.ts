import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthToken } from "@/utils/authLocal";
import { agreementQKeys } from "@/utils/query-key";

import { agreementsRoute } from ".";

export const agreementPathIdRoute = new Route({
  getParentRoute: () => agreementsRoute,
  path: "$agreementId",
  load: async ({
    params: { agreementId },
    meta: { queryClient, apiClient },
  }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      // get summary
      const summaryKey = agreementQKeys.summary(agreementId);
      promises.push(
        queryClient.ensureQueryData({
          queryKey: summaryKey,
          queryFn: () =>
            apiClient.summary.getSummaryForReferenceId({
              params: {
                referenceType: "agreements",
                referenceId: agreementId,
              },
              query: {
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
              },
            }),
        })
      );

      const dataKey = agreementQKeys.id(agreementId);
      promises.push(
        queryClient.ensureQueryData({
          queryKey: dataKey,
          queryFn: () => {
            return apiClient.agreement.getById({
              params: {
                agreementId,
              },
              query: {
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
              },
            });
          },
        })
      );

      try {
        await Promise.all(promises);
      } catch (e) {
        console.error(e);
      }
    }
    return;
  },
  parseParams: (params) => ({
    agreementId: z.string().parse(params.agreementId),
  }),
  stringifyParams: (params) => ({
    agreementId: `${params.agreementId}`,
  }),
});

export const viewAgreementByIdRoute = new Route({
  getParentRoute: () => agreementPathIdRoute,
  path: "/",
  validateSearch: (search) =>
    z
      .object({
        tab: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [(search) => ({ tab: search?.tab || "summary" })],
}).update({
  component: lazyRouteComponent(() => import("@/pages/view-agreement")),
});

export const editAgreementByIdRoute = new Route({
  getParentRoute: () => agreementPathIdRoute,
  path: "edit",
  validateSearch: (search) =>
    z
      .object({
        stage: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [() => ({ stage: "rental-information" })],
}).update({
  component: lazyRouteComponent(() => import("@/pages/edit-agreement")),
});

export const checkinAgreementByIdRoute = new Route({
  getParentRoute: () => agreementPathIdRoute,
  path: "check-in",
  validateSearch: (search) =>
    z
      .object({
        stage: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [() => ({ stage: "rental-information" })],
}).update({
  component: lazyRouteComponent(() => import("@/pages/checkin-agreement")),
});
