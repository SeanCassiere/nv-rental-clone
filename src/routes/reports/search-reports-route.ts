import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { reportsRoute } from ".";

export const searchReportsRoute = new Route({
  getParentRoute: () => reportsRoute,
  path: "/",
  loaderContext: ({ search }) => ({ category: search?.category }),
  validateSearch: z.object({
    category: z.string().optional(),
  }),
  preSearchFilters: [(curr) => ({ category: curr?.category })],
}).update({
  component: lazyRouteComponent(() => import("@/pages/search-reports")),
});
