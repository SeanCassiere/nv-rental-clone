import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { settingsRoute } from ".";

export const destinationSettingsRoute = new Route({
  getParentRoute: () => settingsRoute,
  path: "$destination",
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
