import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { fetchReportsListOptions } from "@/lib/query/report";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute("/_auth/(reports)/reports/")({
  validateSearch: (search) =>
    z
      .object({
        category: z.string().default("all").catch("all").optional(),
      })
      .parse(search),
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
  loaderDeps: ({ search: { category } }) => ({ category }),
});
