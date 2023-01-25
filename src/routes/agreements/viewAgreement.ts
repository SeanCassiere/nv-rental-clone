import { lazy, Route } from "@tanstack/react-router";
import { z } from "zod";

import { agreementsRoute } from ".";
import { queryClient as qc } from "../../App";
import { fetchRentalRateSummaryAmounts } from "../../api/summary";

import { getAuthToken } from "../../utils/authLocal";
import { agreementQKeys } from "../../utils/query-key";

export const viewAgreementRoute = new Route({
  getParentRoute: () => agreementsRoute,
  path: "$agreementId",
  validateSearch: (search) =>
    z
      .object({
        tab: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [() => ({ tab: "summary" })],
  onLoad: async ({ params: { agreementId } }) => {
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

      await Promise.all(promises);
    }
    return {};
  },
  parseParams: (params) => ({
    agreementId: z.string().parse(params.agreementId),
  }),
  stringifyParams: (params) => ({ agreementId: `${params.agreementId}` }),
  component: lazy(() => import("../../pages/AgreementView/AgreementViewPage")),
});
