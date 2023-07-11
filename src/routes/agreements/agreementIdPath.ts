import { lazy, Route } from "@tanstack/router";
import { z } from "zod";

import { agreementsRoute } from ".";
import { queryClient as qc } from "../../App";
import { fetchRentalRateSummaryAmounts } from "../../api/summary";
import { fetchAgreementData } from "../../api/agreements";

import { getAuthToken } from "../../utils/authLocal";
import { agreementQKeys } from "../../utils/query-key";

export const agreementPathIdRoute = new Route({
  getParentRoute: () => agreementsRoute,
  path: "$agreementId",
  loader: async ({ params: { agreementId } }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      // get summary
      const summaryKey = agreementQKeys.summary(agreementId);
      if (!qc.getQueryData(summaryKey)) {
        promises.push(
          qc.prefetchQuery({
            queryKey: summaryKey,
            queryFn: () =>
              fetchRentalRateSummaryAmounts({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                module: "agreements",
                referenceId: agreementId,
              }),
          })
        );
      }

      const dataKey = agreementQKeys.id(agreementId);
      if (!qc.getQueryData(dataKey)) {
        promises.push(
          qc.prefetchQuery({
            queryKey: dataKey,
            queryFn: () => {
              return fetchAgreementData({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                agreementId,
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
  preSearchFilters: [() => ({ tab: "summary" })],
  component: lazy(() => import("../../pages/AgreementView/AgreementViewPage")),
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
  component: lazy(() => import("../../pages/EditAgreement/EditAgreementPage")),
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
  component: lazy(
    () => import("../../pages/CheckinAgreement/CheckinAgreementPage")
  ),
});
