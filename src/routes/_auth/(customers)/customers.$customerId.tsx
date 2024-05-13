import { createFileRoute } from "@tanstack/react-router";

import {
  fetchCustomerByIdOptions,
  fetchCustomerSummaryByIdOptions,
} from "@/lib/query/customer";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute(
  "/_auth/(customers)/customers/$customerId"
)({
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
    if (!context.auth.isAuthenticated) return;

    const promises = [
      context.queryClient.ensureQueryData(context.viewCustomerOptions),
      context.queryClient.ensureQueryData(context.viewCustomerSummaryOptions),
    ];

    await Promise.all(promises);
  },
});
