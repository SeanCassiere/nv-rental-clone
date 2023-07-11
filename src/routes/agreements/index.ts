import { Route } from "@tanstack/router";

import { rootRoute } from "../__root";

export const agreementsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "agreements",
});
