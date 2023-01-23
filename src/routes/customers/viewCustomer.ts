import { lazy } from "@tanstack/react-router";
import { z } from "zod";

import { customersRoute } from ".";
import { queryClient as qc } from "../../App";
import { fetchCustomerSummaryAmounts } from "../../api/summary";

import { getAuthToken } from "../../utils/authLocal";
import { customerQKeys } from "../../utils/query-key";

export const viewCustomerRoute = customersRoute.createRoute({
  path: "$customerId",
  component: lazy(() => import("../../pages/CustomerView/CustomerViewPage")),
  validateSearch: (search) =>
    z.object({ tab: z.string().optional() }).parse(search),
  preSearchFilters: [() => ({ tab: "summary" })],
  onLoad: async ({ params: { customerId } }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      // get summary
      const summaryKey = customerQKeys.summary(customerId);
      if (!qc.getQueryData(summaryKey)) {
        promises.push(
          qc.prefetchQuery({
            queryKey: summaryKey,
            queryFn: () =>
              fetchCustomerSummaryAmounts({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                customerId,
              }),
          })
        );
      }

      await Promise.all(promises);
    }
    return {};
  },
  parseParams: (params) => ({
    customerId: z.string().parse(params.customerId),
  }),
  stringifyParams: (params) => ({ customerId: `${params.customerId}` }),
});
