import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { rootRoute } from "./__root";

export const devRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "dev",
  component: lazyRouteComponent(() => import("@/pages/dev")),
});
