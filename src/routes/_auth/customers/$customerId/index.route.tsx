import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  fetchCustomerByIdOptions,
  fetchCustomerSummaryByIdOptions,
} from "@/lib/query/customer";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute("/_auth/customers/$customerId/")({
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

    if (!context.auth.isAuthenticated) return;

    const promises = [];

    // get summary
    promises.push(queryClient.ensureQueryData(viewCustomerSummaryOptions));

    // get customer
    promises.push(queryClient.ensureQueryData(viewCustomerOptions));

    await Promise.all(promises);

    return;
  },
});
