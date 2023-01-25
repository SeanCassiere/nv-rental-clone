import { Route } from "@tanstack/react-router";

import { rootRoute } from "../__root";

export const vehiclesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "vehicles",
});
