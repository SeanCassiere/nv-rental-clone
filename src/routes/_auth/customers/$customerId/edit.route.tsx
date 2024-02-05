import { createFileRoute } from "@tanstack/react-router";

import { fetchCustomerByIdOptions } from "@/lib/query/customer";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute("/_auth/customers/$customerId/edit")({
  beforeLoad: ({ context, params: { customerId } }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      viewCustomerOptions: fetchCustomerByIdOptions({ auth, customerId }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, viewCustomerOptions } = context;

    if (!context.auth.isAuthenticated) return;

    const promises = [];

    promises.push(queryClient.ensureQueryData(viewCustomerOptions));

    await Promise.all(promises);

    return;
  },
});
