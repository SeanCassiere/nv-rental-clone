import { Route } from "@tanstack/react-router";

import { rootRoute } from "../__root";

export const agreementsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "agreements",
});
