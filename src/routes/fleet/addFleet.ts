import { Route } from "@tanstack/router";

import { fleetRoute } from ".";

export const addFleetRoute = new Route({
  getParentRoute: () => fleetRoute,
  path: "new",
  component: () => "Add Fleet Route",
});
