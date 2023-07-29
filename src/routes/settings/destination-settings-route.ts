import { lazy, Route } from "@tanstack/router";
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
  component: lazy(() => import("@/pages/settings-destination")),
});
