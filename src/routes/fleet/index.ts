import { Route } from "@tanstack/react-router";

import { rootRoute } from "../__root";

export const fleetRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "fleet",
});
