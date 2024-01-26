import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import { fetchReportsListOptions } from "@/utils/query/report";

export const Route = createFileRoute("/_auth/reports/")({
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
  loader: async ({ context }) => {
    const { queryClient, searchListOptions } = context;

    if (!context.auth.isAuthenticated) return;

    await queryClient.ensureQueryData(searchListOptions);

    return;
  },
});
