import { Route } from "@tanstack/router";
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
  component: () => "Destination settings",
});
