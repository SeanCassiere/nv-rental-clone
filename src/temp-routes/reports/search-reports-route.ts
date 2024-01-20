import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import { fetchReportsListOptions } from "@/utils/query/report";

import { reportsRoute } from ".";

export const searchReportsRoute = new Route({
  getParentRoute: () => reportsRoute,
  path: "/",
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
    await queryClient.ensureQueryData(searchListOptions);
    return;
  },
  component: lazyRouteComponent(() => import("@/pages/search-reports")),
});
