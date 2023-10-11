import { Route } from "@tanstack/react-router";

import { rootRoute } from "../__root";

export const reportsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "reports",
});
