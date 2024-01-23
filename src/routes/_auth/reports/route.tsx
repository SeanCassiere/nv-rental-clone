import { FileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import { fetchReportsListOptions } from "@/utils/query/report";

export const Route = new FileRoute("/_auth/reports").createRoute({
  validateSearch: z.object({
    category: z.string().optional(),
  }),
  preSearchFilters: [(curr) => ({ category: curr?.category })],
  beforeLoad: ({ context }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      searchListOptions: fetchReportsListOptions({ auth }),
    };
  },
});
