import { Route } from "@tanstack/react-router";

import { rootRoute } from "@/routes/__root";

export const reportsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "reports",
});
