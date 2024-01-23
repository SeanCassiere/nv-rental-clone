import { FileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchCustomerByIdOptions,
  fetchCustomerSummaryByIdOptions,
} from "@/utils/query/customer";

export const Route = new FileRoute("/_auth/customers/$customerId").createRoute({
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
});
