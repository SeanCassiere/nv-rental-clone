import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";

export const Route = new FileRoute("/settings/$destination").createRoute({
  parseParams: (params) => ({
    destination: z.string().parse(params.destination),
  }),
  stringifyParams: (params) => ({
    destination: `${params.destination}`,
  }),
  validateSearch: (search) =>
    z
      .object({
        tab: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [(prev) => prev],
  component: lazyRouteComponent(() => import("@/pages/settings-destination")),
});
