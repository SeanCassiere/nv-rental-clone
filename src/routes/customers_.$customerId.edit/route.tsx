import { FileRoute } from "@tanstack/react-router";

import { getAuthFromRouterContext } from "@/utils/auth";
import { fetchCustomerByIdOptions } from "@/utils/query/customer";

export const Route = new FileRoute("/customers/$customerId/edit").createRoute({
  beforeLoad: ({ context, params: { customerId } }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      viewCustomerOptions: fetchCustomerByIdOptions({ auth, customerId }),
    };
  },
});
