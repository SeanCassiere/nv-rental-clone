import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchCustomerByIdOptions,
  fetchCustomerSummaryByIdOptions,
} from "@/utils/query/customer";

export const Route = new FileRoute("/customers/$customerId").createRoute({
  validateSearch: (search) =>
    z.object({ tab: z.string().optional() }).parse(search),
  preSearchFilters: [(search) => ({ tab: search?.tab || "summary" })],
  beforeLoad: ({ context, params: { customerId } }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      viewCustomerOptions: fetchCustomerByIdOptions({ auth, customerId }),
      viewCustomerSummaryOptions: fetchCustomerSummaryByIdOptions({
        auth,
        customerId,
      }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, viewCustomerSummaryOptions, viewCustomerOptions } =
      context;

    const promises = [];

    // get summary
    promises.push(queryClient.ensureQueryData(viewCustomerSummaryOptions));

    // get customer
    promises.push(queryClient.ensureQueryData(viewCustomerOptions));

    await Promise.all(promises);

    return;
  },
  component: lazyRouteComponent(() => import("@/pages/view-customer")),
});
