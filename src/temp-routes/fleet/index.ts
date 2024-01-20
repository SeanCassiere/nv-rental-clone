import { Route } from "@tanstack/react-router";

import { Route } from "../../routes/__root";

export const fleetRoute = new Route({
  getParentRoute: () => Route,
  path: "fleet",
});
