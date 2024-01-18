import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext, getAuthToken } from "@/utils/auth";
import { customerQKeys } from "@/utils/query-key";
import { fetchCustomerByIdOptions } from "@/utils/query/customer";

import { customersRoute } from ".";

export const customerPathIdRoute = new Route({
  getParentRoute: () => customersRoute,
  path: "$customerId",
  loader: async ({
    params: { customerId },
    context: { queryClient, apiClient },
  }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      // get summary
      const summaryKey = customerQKeys.summary(customerId);
      promises.push(
        queryClient.ensureQueryData({
          queryKey: summaryKey,
          queryFn: () =>
            apiClient.customer.getSummaryForId({
              params: {
                customerId,
              },
              query: {
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
              },
            }),
        })
      );

      try {
        await Promise.all(promises);
      } catch (error) {
        console.error("route prefetch failed for /customers/:id", error);
      }
    }
    return;
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
  beforeLoad: ({ context, params: { customerId } }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      viewCustomerOptions: fetchCustomerByIdOptions({ auth, customerId }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, viewCustomerOptions } = context;

    const promises = [];

    promises.push(queryClient.ensureQueryData(viewCustomerOptions));

    await Promise.all(promises);

    return;
  },
  component: lazyRouteComponent(() => import("@/pages/view-customer")),
});

export const editCustomerByIdRoute = new Route({
  getParentRoute: () => customerPathIdRoute,
  path: "edit",
  beforeLoad: ({ context, params: { customerId } }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      viewCustomerOptions: fetchCustomerByIdOptions({ auth, customerId }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, viewCustomerOptions } = context;

    const promises = [];

    promises.push(queryClient.ensureQueryData(viewCustomerOptions));

    await Promise.all(promises);

    return;
  },
  component: () => "Edit Customer Route",
});
