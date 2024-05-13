import { createFileRoute } from "@tanstack/react-router";

import { fetchCustomerTypesOptions } from "@/lib/query/customer";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute("/_auth/(customers)/customers")({
  beforeLoad: ({ context }) => {
    const auth = getAuthFromRouterContext(context);
    const customerTypesOptions = fetchCustomerTypesOptions({ auth });
    return {
      customerTypesOptions,
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    const promises = [
      context.queryClient.ensureQueryData(context.customerTypesOptions),
    ];

    await Promise.allSettled(promises);

    return {};
  },
});
