import { lazy, Route } from "@tanstack/react-router";
import { z } from "zod";

import { customersRoute } from ".";
import { queryClient as qc } from "../../App";
import { fetchCustomerSummaryAmounts } from "../../api/summary";
import { fetchCustomerData } from "../../api/customer";

import { getAuthToken } from "../../utils/authLocal";
import { customerQKeys } from "../../utils/query-key";
import { b64_decode, b64_encode } from "../../utils/base64";

export const viewCustomerRoute = new Route({
  getParentRoute: () => customersRoute,
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

      const dataKey = customerQKeys.id(customerId);
      if (!qc.getQueryData(dataKey)) {
        promises.push(
          qc.prefetchQuery({
            queryKey: dataKey,
            queryFn: () => {
              return fetchCustomerData({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                customerId,
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
    customerId: b64_decode(z.string().parse(params.customerId)),
  }),
  stringifyParams: (params) => ({
    customerId: b64_encode(`${params.customerId}`),
  }),
});
