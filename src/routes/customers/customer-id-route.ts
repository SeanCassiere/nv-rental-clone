import { Route, lazyRouteComponent } from "@tanstack/router";
import { z } from "zod";

import { customersRoute } from ".";

import { fetchCustomerSummaryAmounts } from "@/api/summary";
import { fetchCustomerData } from "@/api/customers";

import { getAuthToken } from "@/utils/authLocal";
import { customerQKeys } from "@/utils/query-key";

export const customerPathIdRoute = new Route({
  getParentRoute: () => customersRoute,
  path: "$customerId",
  loader: async ({ params: { customerId }, context: { queryClient } }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      // get summary
      const summaryKey = customerQKeys.summary(customerId);
      promises.push(
        queryClient.ensureQueryData({
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

      const dataKey = customerQKeys.id(customerId);
      promises.push(
        queryClient.ensureQueryData({
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

      await Promise.all(promises);
    }
    return {};
  },
  parseParams: (params) => ({
    customerId: z.string().parse(params.customerId),
  }),
  stringifyParams: (params) => ({
    customerId: `${params.customerId}`,
  }),
});

export const viewCustomerByIdRoute = new Route({
  getParentRoute: () => customerPathIdRoute,
  path: "/",
  validateSearch: (search) =>
    z.object({ tab: z.string().optional() }).parse(search),
  preSearchFilters: [(search) => ({ tab: search?.tab || "summary" })],
}).update({
  component: lazyRouteComponent(() => import("@/pages/view-customer")),
});

export const editCustomerByIdRoute = new Route({
  getParentRoute: () => customerPathIdRoute,
  path: "edit",
  component: () => "Edit Customer Route",
});
